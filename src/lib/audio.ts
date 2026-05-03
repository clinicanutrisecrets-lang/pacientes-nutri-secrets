import type { SoundOption } from './types';

type ActiveAudio = {
  sound: SoundOption;
  ctx: AudioContext;
  master: GainNode;
  nodes: AudioNode[];
};

let active: ActiveAudio | null = null;

const FADE_SECONDS = 2;

function createBrownNoiseSource(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    output[i] = lastOut * 3.5;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.start(0);
  return source;
}

function buildBrown(ctx: AudioContext, master: GainNode): AudioNode[] {
  const source = createBrownNoiseSource(ctx);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 500;
  source.connect(lp);
  lp.connect(master);
  return [source, lp];
}

function buildDrone(ctx: AudioContext, master: GainNode): AudioNode[] {
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 432;
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 432 * 1.5;
  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.6;
  const harmonicGain = ctx.createGain();
  harmonicGain.gain.value = 0.18;
  osc1.connect(oscGain);
  osc2.connect(harmonicGain);
  oscGain.connect(master);
  harmonicGain.connect(master);
  osc1.start();
  osc2.start();
  return [osc1, osc2, oscGain, harmonicGain];
}

function buildRain(ctx: AudioContext, master: GainNode): AudioNode[] {
  // Distant, gentle rain — brown noise base, tight mid-band, heavily
  // attenuated, with slow LFO modulation creating soft waves of intensity.
  const source = createBrownNoiseSource(ctx);

  // Steep high-pass to remove all rumble — rain is mostly mid frequencies
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 480;
  hp.Q.value = 0.7;

  // Aggressive low-pass — keep only the soft "patter" range
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1300;
  lp.Q.value = 0.5;

  // Notch the harsh 1.5–2 kHz region just in case
  const notch = ctx.createBiquadFilter();
  notch.type = 'peaking';
  notch.frequency.value = 1700;
  notch.Q.value = 0.8;
  notch.gain.value = -6;

  // Heavy attenuation so it never feels close or loud
  const reduce = ctx.createGain();
  reduce.gain.value = 0.18;

  // Slow LFO (~14 s period) sweeping the low-pass between 1000–1500 Hz
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 250;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  source.connect(hp);
  hp.connect(lp);
  lp.connect(notch);
  notch.connect(reduce);
  reduce.connect(master);

  return [source, hp, lp, notch, reduce, lfo, lfoGain];
}

function teardown(audio: ActiveAudio, immediate = false): Promise<void> {
  return new Promise((resolve) => {
    const now = audio.ctx.currentTime;
    if (immediate) {
      audio.master.gain.cancelScheduledValues(now);
      audio.master.gain.setValueAtTime(0, now);
    } else {
      audio.master.gain.cancelScheduledValues(now);
      audio.master.gain.setValueAtTime(audio.master.gain.value, now);
      audio.master.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
    }
    const cleanup = () => {
      audio.nodes.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // already stopped
        }
      });
      try {
        audio.ctx.close();
      } catch {
        // already closed
      }
      resolve();
    };
    if (immediate) cleanup();
    else window.setTimeout(cleanup, FADE_SECONDS * 1000 + 50);
  });
}

export async function startAmbient(sound: SoundOption, volume: number): Promise<void> {
  if (typeof window === 'undefined') return;
  if (sound === 'off') {
    await stopAmbient();
    return;
  }
  if (active && active.sound === sound) {
    setVolume(volume);
    return;
  }
  if (active) {
    const old = active;
    active = null;
    void teardown(old);
  }
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  if (ctx.state === 'suspended') {
    try { await ctx.resume(); } catch { /* ignore */ }
  }
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  let nodes: AudioNode[] = [];
  if (sound === 'brown') nodes = buildBrown(ctx, master);
  else if (sound === 'drone') nodes = buildDrone(ctx, master);
  else if (sound === 'rain') nodes = buildRain(ctx, master);
  active = { sound, ctx, master, nodes };
  const now = ctx.currentTime;
  master.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), now + FADE_SECONDS);
}

export async function stopAmbient(): Promise<void> {
  if (!active) return;
  const old = active;
  active = null;
  await teardown(old);
}

export function setVolume(volume: number): void {
  if (!active) return;
  const v = Math.max(0, Math.min(1, volume));
  const now = active.ctx.currentTime;
  active.master.gain.cancelScheduledValues(now);
  active.master.gain.linearRampToValueAtTime(v, now + 0.4);
}
