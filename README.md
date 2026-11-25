# Tale of the Lich

A modern podcast site for a D&D Forgotten Realms history show, featuring an **Episodes archive** (with Spotify embeds), a **Blog** for show notes and lore resources, and a **Meet The Host** section.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide icons

## Project structure

```
tale-of-the-lich/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── podcastData.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Episodes.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Getting started

```bash
cd tale-of-the-lich
npm install
npm run dev
```

## Deploying to AWS Amplify (GitHub)

- **Build settings**: Amplify should run `npm ci` and `npm run build` (already configured in `amplify.yml`).
- **Output directory**: `dist` (already configured in `amplify.yml`).
- **Node version**: `.nvmrc` is set to Node 20.
- **SPA routing (React Router)**: add an Amplify **rewrite rule** so deep links work:
  - source: `</^[^.]+$|.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`
  - target: `/index.html`
  - type: `200 (Rewrite)`

## Customize content

- Edit show info (including the host), episodes, and blog posts in `src/data/podcastData.ts`.



## Theandril atlas

The reader at `/theandril/atlas` uses a local snapshot of the published games. The 4X source is [Theandril at e3f3931](https://github.com/ErikBurdett/Theandril/tree/e3f393177638c13a64b89e5861e976c77f011173). Its journal lore library and compendium supply the chronicle, cultures, city-states, and illustrated register. Its campaign content supplies the paired landmarks and relics, notable people, and council petitions. The tavern material comes from [Hearth & Card at eb3275d](https://github.com/ErikBurdett/theandril-hearth-and-card/tree/eb3275da6ce95954b8fd8b0e9efc73f057a6a1d7), the source of the published Pages build d64b0c3d. Set accounts, card marginalia, named guests, menus and paintings come from that edition.

The search inventory is in `src/data/atlas/index.json`. Reader files alongside it are keyed by stable shelf/entry paths. Card records load by parent volume. Artwork is served locally from `public/assets/atlas`. Keep Ilthen’s testimony, Erilian’s collector interpretations, and possible campaign events distinct when updating from a later published edition.
