import { useEffect, useState } from 'react';
import { getFilms } from '../data/filmsData';
import { sortFilms } from '../lib/filmUtils';
import { IFilm } from '../types/film.types';

/** Loads the static film data through the existing `getFilms()` contract. */
export const useFilms = () => {
  const [films, setFilms] = useState<IFilm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getFilms()
      .then(({ data }) => {
        if (active) setFilms(sortFilms(data.data));
      })
      .catch(() => {
        if (active) setFilms([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { films, loading };
};
