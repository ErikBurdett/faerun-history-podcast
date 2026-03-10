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

- Edit show info (including the host, and the Printful shop URL), episodes, and blog posts in `src/data/podcastData.ts`.


