import { IFilm } from '../types/film.types';
import jioHotstarLogo from '../img/jiohotstar-logo-hd.webp';
import zee5Logo from '../img/Zee5-official-logo.jpeg';
import sonyLivLogo from '../img/SonyLIV_2020.png';
import primeVideoLogo from '../img/prime_video_logo_one.png';
import netflixLogo from '../img/Netflix_Logo_three.png';

/** Upcoming first, then newest year first (unchanged ordering rule). */
export const sortFilms = (films: IFilm[]): IFilm[] =>
  [...films].sort((a, b) => {
    if (a.status === 'Upcoming' && b.status !== 'Upcoming') return -1;
    if (b.status === 'Upcoming' && a.status !== 'Upcoming') return 1;
    return b.year - a.year;
  });

export const PLATFORM_LOGOS: Record<string, string> = {
  Netflix: netflixLogo,
  'Prime Video': primeVideoLogo,
  JioHotstar: jioHotstarLogo,
  ZEE5: zee5Logo,
  SonyLIV: sonyLivLogo,
};

/** Content-rating chips: colour is meaningful, text always accompanies it. */
export const CONTENT_RATING: Record<string, { chip: string; label: string }> = {
  U: { chip: 'bg-sage text-ink', label: 'U — Universal' },
  UA: { chip: 'bg-champagne text-ink', label: 'UA — 12+' },
  A: { chip: 'bg-oxblood text-ivory', label: 'A — Adults 18+' },
  S: { chip: 'bg-ivory text-ink', label: 'S — Restricted' },
};

/** Per-film "gel" tint so each poster has its own light. Cycled by index. */
export const FILM_TINTS = [
  'rgb(var(--c-bronze) / 0.55)',
  'rgb(70 96 140 / 0.5)',
  'rgb(var(--c-oxblood) / 0.55)',
  'rgb(var(--c-champagne) / 0.45)',
  'rgb(60 110 104 / 0.5)',
  'rgb(120 84 140 / 0.45)',
  'rgb(var(--c-sage) / 0.4)',
] as const;

export const getYouTubeEmbedUrl = (url: string, autoplay = false): string => {
  if (!url) return '';
  let id = '';
  try {
    const u = new URL(url);
    id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop() || '';
  }
  return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&controls=1&rel=0&modestbranding=1`;
};

export const pad = (n: number, size = 2) => String(n).padStart(size, '0');
