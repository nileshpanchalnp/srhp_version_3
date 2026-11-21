/**
 * Film record used by the static data in `data/filmsData.ts`.
 */
export type FilmStatus = 'Released' | 'Upcoming' | 'Post Production' | 'In Production';

export interface IFilm {
  id: string;
  title: string;
  year: number;
  genre: string[];
  status: FilmStatus;
  rating: number;
  /** Content rating: 'U' | 'UA' | 'A' | 'S' */
  contentRating?: 'U' | 'UA' | 'A' | 'S';
  synopsis: string;
  posterUrl: string;
  heroPosterUrl?: string;
  platform: string[];
  trailerUrl: string;
  /** 'Film' or 'Web Series' */
  type?: 'Film' | 'Web Series';
  releaseDate?: string;
}
