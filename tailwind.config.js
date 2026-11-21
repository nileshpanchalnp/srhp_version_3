/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),            // deepest charcoal
        midnight: token('midnight'),  // cinematic midnight surface
        surface: token('surface'),    // raised dark surface
        rule: token('rule'),          // hairlines on dark
        ivory: token('ivory'),        // warm editorial ivory
        paper: token('paper'),        // light section ground
        newsprint: token('newsprint'),// press-archive ground
        champagne: token('champagne'),// metallic accent on dark
        gilt: token('gilt'),          // accent that stays legible on paper
        bronze: token('bronze'),      // supporting warm tone
        oxblood: token('oxblood'),    // status: upcoming / in production
        sage: token('sage'),          // status: released
        mute: token('mute'),          // secondary text on dark
        soft: token('soft'),          // secondary text on paper
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        title: ['"Big Shoulders Display"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        label: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
      },
      transitionTimingFunction: {
        cine: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        plate: '0 30px 60px -20px rgb(0 0 0 / 0.55), 0 8px 20px -8px rgb(0 0 0 / 0.4)',
        paper: '0 24px 50px -24px rgb(40 28 10 / 0.35)',
      },
    },
  },
  plugins: [],
};
