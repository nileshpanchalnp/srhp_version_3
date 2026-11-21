// data/filmsData.ts
//
// Static replacement for the old MySQL `films` table + /api/films endpoint.
// Edit this file directly to add, remove, or update a film — no backend
// or admin dashboard required.

import { IFilm } from '../types/film.types';

import sundownTownPoster from '../img/films/suntown.jpeg';
import sundownTownHero from '../img/films/sundown_hero.png';

import holyFatherPoster from '../img/films/holy-father-poster.jpeg';
import holyFatherHero from '../img/films/holy-father-hero.png';

import twoZeroOneFourPoster from '../img/films/two-zero-one-four-poster.jpeg';
import twoZeroOneFourHero from '../img/films/two-zero-one-four-hero.png';

import holyGhostPoster from '../img/films/holy-ghost-poster.jpg';
import holyGhostHero from '../img/films/holy-ghost-hero.png';

import murshidPoster from '../img/films/murshid-poster.webp';
import murshidHero from '../img/films/murshid-hero.png';

import sevenZeroSixPoster from '../img/films/706-poster.webp';
import sevenZeroSixHero from '../img/films/706-hero.png';

import aazamPoster from '../img/films/aazam-poster.png';
import aazamHero from '../img/films/aazam-hero.png';

export const FILMS: IFilm[] = [
  {
    id: '1',
    title: 'SUNDOWN TOWN',
    year: 2027,
    genre: [ 'Crime','Thriller'],
    status: 'Upcoming',
    rating: 0,
    // contentRating: '',
    synopsis:
      "A crusading journalist and her boyfriend travel to a remote resort in a notorious \"Sundown Town\" to trade evidence of a child exploitation ring for the name of its kingpin—only for her boyfriend to vanish overnight. As she investigates his disappearance, she uncovers a web of racial terror still enforced by local law enforcement, while hiding her own chilling secret: she orchestrated his murder to cover a multi-million dollar blackmail scheme against a powerful senator, weaponizing the town's racist traditions as the perfect alibi.",
    posterUrl: sundownTownPoster,
    heroPosterUrl: sundownTownHero,
    platform: [],
    trailerUrl: '',
    type: 'Film',
  },  {
    id: '2',
    title: 'Holy Father',
    year: 2026,
    genre: ['Horror', 'Crime'],
    status: 'Upcoming',
    rating: 0,
    contentRating: 'A',
    synopsis:
      '"Holy Father" is a Hollywood horror-crime thriller set in Savannah, USA — where a disgraced priest becomes the prime suspect in a string of ritualistic murders that echo his darkest confessions.',
    posterUrl: holyFatherPoster,
    heroPosterUrl: holyFatherHero,
    platform: [],
    trailerUrl: '',
    type: 'Film',
  },
  {
    id: '3',
    title: 'Two Zero One Four',
    year: 2026,
    genre: ['Action', 'Thriller'],
    status: 'Upcoming',
    rating: 0,
    contentRating: 'UA',
    synopsis:
      'Captain Khanna is a former army officer who has worked extensively in counter-intelligence. Forced out of retirement by a threat no one else believes, he races against time to expose a conspiracy buried deep within the establishment.',
    posterUrl: twoZeroOneFourPoster,
    heroPosterUrl: twoZeroOneFourHero,
    platform: [],
    trailerUrl: '',
    type: 'Film',
  },
  {
    id: '4',
    title: 'Holy Ghost',
    year: 2025,
    genre: ['Horror', 'Mystery'],
    status: 'Released',
    rating: 3.3,
    contentRating: 'A',
    synopsis:
      '"Holy Ghost" is a horror-mystery set in a small American town, where a grieving family moves into an old house — only to discover the previous occupants never truly left.',
    posterUrl: holyGhostPoster,
    heroPosterUrl: holyGhostHero,
    platform: ['Prime Video'],
    trailerUrl: 'https://www.youtube.com/watch?v=7Fv7jBCgGXU',
    type: 'Film',
  },
  {
    id: '5',
    title: 'Murshid',
    year: 2024,
    genre: ['Crime', 'Thriller'],
    status: 'Released',
    rating: 7.3,
    contentRating: 'A',
    synopsis:
      'Murshid is a Hindi crime thriller web series released on ZEE5 as an original series — following an informer caught between two worlds who must choose loyalty over survival.',
    posterUrl: murshidPoster,
    heroPosterUrl: murshidHero,
    platform: ['ZEE5'],
    trailerUrl: 'https://www.youtube.com/watch?v=Gc44u7ePbfg',
    type: 'Web Series',
  },
  {
    id: '6',
    title: '706',
    year: 2019,
    genre: ['Thriller'],
    status: 'Released',
    rating: 7.1,
    contentRating: 'A',
    synopsis:
      'A feature length film featuring Divya Dutta and Atul Kulkarni in lead roles. This supernatural crime thriller was shot entirely on location in Mumbai, Ahmedabad, and Benaras. The film was acquired by Netflix, later by Ultra Media, and is currently available on Ultra\u2019s YouTube channel. Initially, it was distributed across theaters in India by Panorama.',
    posterUrl: sevenZeroSixPoster,
    heroPosterUrl: sevenZeroSixHero,
    platform: ['Prime Video', 'Netflix'],
    trailerUrl: 'https://www.youtube.com/watch?v=Iz7cNvFY3w0&t=10s&pp=ygURNzA2IG1vdmllIHRyYWlsZXI%3D',
    type: 'Film',
  },
  {
    id: '7',
    title: 'Aazam',
    year: 2023,
    genre: ['Drama', 'Suspense'],
    status: 'Released',
    rating: 6.1,
    contentRating: 'UA',
    synopsis:
      'Starring Jimmy Shergill in the lead role, this crime thriller focuses on the succession battles within Mumbai underworld.',
    posterUrl: aazamPoster,
    heroPosterUrl: aazamHero,
    platform: ['Prime Video'],
    trailerUrl: 'https://www.youtube.com/watch?v=2Xr-0ZAFYNk',
    type: 'Film',
  },
];

/**
 * Drop-in replacement for the old `getFilms()` API call.
 * Kept as a Promise-returning function with the same
 * `{ data: { success, count, data } }` response shape so every
 * component that used to call the backend needs no other changes.
 */
export const getFilms = (): Promise<{ data: { success: boolean; count: number; data: IFilm[] } }> =>
  Promise.resolve({ data: { success: true, count: FILMS.length, data: FILMS } });

/** Drop-in replacement for the old `getFilm(id)` API call. */
export const getFilm = (id: string | number): Promise<{ data: { success: boolean; data?: IFilm } }> => {
  const film = FILMS.find((f) => f.id === String(id));
  return Promise.resolve(
    film ? { data: { success: true, data: film } } : { data: { success: false } }
  );
};
