# SRHP Films — Frontend

Static React + Vite + TypeScript site for [srhpfilms.com](https://srhpfilms.com).

This project no longer talks to a backend, database, or admin dashboard.
All film and news content lives directly in TypeScript files under `src/data/`.

## Editing content

- **Films** — `src/data/filmsData.ts`. Each film is one object in the `FILMS`
  array (title, year, genre, status, rating, synopsis, platforms, trailer
  link, poster + hero image). Add, remove, or edit an entry and rebuild —
  no admin panel needed.
- **News / press** — `src/data/newsData.ts`. Same idea: one object per
  article in the `NEWS` array.
- **Images** — poster and hero images live in `src/img/films/`, press
  photos in `src/img/news/`. Drop a new image in the matching folder,
  `import` it at the top of the relevant data file, and reference it on
  the entry.

`getFilms()` / `getFeaturedNews()` / `getAllNews()` in those data files
return the same `{ data: { success, count, data } }` shape the old API
calls did, so the rest of the app didn't need to change.

## Contact form

The Contact section posts to `/api/contact`, a small serverless function
(`api/contact.js`) that sends the message via [Resend](https://resend.com)
— no axios, no reCAPTCHA, no database.

To make it work:

1. `npm install` (the `resend` package is already in `package.json`).
2. Create a Resend account and API key.
3. Set `RESEND_API_KEY` as an environment variable on your hosting
   platform (see `.env.example`).
4. Verify a sending domain in Resend, then update `FROM_EMAIL` in
   `api/contact.js` (until then it can only send from
   `onboarding@resend.dev`, which is fine for testing).

`api/contact.js` is written as a Vercel-style serverless function
(`export default function handler(req, res)`). If you're hosting on
Vercel, it works with zero extra config. If you're deploying to
traditional shared hosting (cPanel, plain Apache/Nginx, etc.) that
doesn't run serverless functions, you'll need to host this one endpoint
somewhere that does (Vercel/Netlify/Cloudflare Functions all have free
tiers) and point the fetch call in `ContactSection.tsx` at that URL
instead of the relative `/api/contact` path.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run typecheck # tsc --noEmit
```

## Design system (cinematic redesign)

- **Tokens** — `src/index.css` (CSS variables) + `tailwind.config.js` (`ink`, `midnight`, `ivory`, `paper`, `newsprint`, `champagne`, `gilt`, `bronze`, `oxblood`, `sage`, `mute`, `soft`). Fonts: Cormorant Garamond (display), Inter (body), Barlow Condensed (labels).
- **Motion language** — `src/motion/language.ts` (easings, durations, variants) and `src/components/motion/*` (MaskText, ImageReveal, Magnetic, Tilt, FrameMarks).
- **Section transitions** — `src/components/transitions/Bridges.tsx`.
- **Images** — `src/img/` is not included in this ZIP; add your original folder back unchanged (all import paths are untouched).

## Redesign v23 — "one feature film"

Each section was rebuilt with its own concept; content, colours, routes and `src/img` import paths are unchanged.

- Loader: countdown leader (3·2·1) tied to real load progress, logo card, venetian shutter opens.
- Header: floating bar with sliding gold marker, scene-aware; shutter menu on mobile.
- Hero: film titles are the navigation over full-bleed stills; hero pins and About rises over it.
- About: sticky portrait, bio lights up word by word on scroll, ledger stats.
- Transitions: crossing genre bands (About→Films), press sheet slides over (Films→News), studio lamp (News→Contact).
- Filmography: one pinned full-screen scene per film, each covers the last.
- News: lead banner, publication band, headline rows. News page: sticky masthead, tag filters, cursor photo preview.
- Contact: clapperboard slate form. Footer: end credits.
- Films page: poster wall with a double-size lead tile. Film dialog: screening room.
- Fonts: Big Shoulders Display (titles), Newsreader (editorial), Inter (body).
