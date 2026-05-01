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

function createPinkishNoiseSource(ctx: AudioContext): AudioBufferSourceNode {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
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
  const source = createPinkishNoiseSource(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 800;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 5000;
  source.connect(hp);
  hp.connect(lp);
  lp.connect(master);
  return [source, hp, lp];
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
