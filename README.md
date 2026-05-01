# MindSpark

> A small, gentle PWA brain-puzzle game in English and Brazilian Portuguese.
> Um app PWA pequeno e gentil de enigmas para a mente, em inglês e português.

---

## English

### What it is
- A bilingual (EN / PT-BR) Progressive Web App that runs in the browser, installs to the home screen, and works offline after the first load.
- Five hand-picked puzzles per day, plus a free-play mode by category and difficulty.
- A calming design layer (no timers, no streak shame, soft colors, warm copy) and an always-accessible breathing companion.

### Tech
React 18 · Vite 5 · TypeScript · Tailwind CSS · react-i18next · `vite-plugin-pwa` · Web Audio API.

### Local development
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in /dist
npm run preview  # preview the built app
npm run typecheck
npm run generate-icons   # regenerate /public/icons/*.png from script
```

### Deploy to Vercel (free tier)
1. Push this repo to GitHub.
2. In Vercel, *Add New Project* → import the repo.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build`. Output directory: `dist`.
5. Deploy. The PWA service worker registers automatically.

### Install to your home screen
- **iOS (Safari):** open the site, tap the **Share** icon, then **Add to Home Screen**.
- **Android (Chrome / Edge):** open the site, open the menu, tap **Install app** (or **Add to Home Screen**).
- **Desktop (Chrome / Edge):** click the install icon in the address bar.

### Replacing puzzle data
- English bank: `src/data/puzzles_en.json`
- Portuguese bank: `src/data/puzzles_pt.json`
- UI strings: `src/locales/en/common.json` and `src/locales/pt-BR/common.json`.

### Notes
- All progress lives in `localStorage` (`mindspark_progress`, `mindspark_settings`, `mindspark_lang`). Nothing is sent off-device.
- The app uses a `HashRouter` for safe deployment to any static host (no server-side rewrites required).

---

## Português (Brasil)

### O que é
- Um Progressive Web App bilíngue (PT-BR / EN) que roda no navegador, se instala na tela inicial e funciona offline depois do primeiro carregamento.
- Cinco enigmas escolhidos a dedo por dia, mais um modo livre por categoria e dificuldade.
- Design pensado para acalmar (sem cronômetros, sem culpa de sequência, cores suaves, textos gentis) e um botão de respiração sempre acessível.

### Tecnologias
React 18 · Vite 5 · TypeScript · Tailwind CSS · react-i18next · `vite-plugin-pwa` · Web Audio API.

### Desenvolvimento local
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle de produção em /dist
npm run preview  # preview do app buildado
npm run typecheck
npm run generate-icons   # regenera /public/icons/*.png
```

### Deploy na Vercel (plano gratuito)
1. Suba este repositório no GitHub.
2. Na Vercel, *Add New Project* → importe o repositório.
3. Framework preset: **Vite** (detectado automaticamente).
4. Comando de build: `npm run build`. Diretório de saída: `dist`.
5. Faça o deploy. O service worker do PWA é registrado automaticamente.

### Instalar na tela inicial
- **iOS (Safari):** abra o site, toque no ícone de **Compartilhar** e depois em **Adicionar à Tela de Início**.
- **Android (Chrome / Edge):** abra o site, abra o menu e toque em **Instalar app** (ou **Adicionar à Tela inicial**).
- **Desktop (Chrome / Edge):** clique no ícone de instalação na barra de endereço.

### Trocar os enigmas
- Banco em inglês: `src/data/puzzles_en.json`
- Banco em português: `src/data/puzzles_pt.json`
- Textos de interface: `src/locales/en/common.json` e `src/locales/pt-BR/common.json`.

### Observações
- Todo progresso fica no `localStorage` (`mindspark_progress`, `mindspark_settings`, `mindspark_lang`). Nada é enviado para fora do dispositivo.
- O app usa `HashRouter`, então funciona em qualquer host estático (sem precisar de redirecionamentos no servidor).
