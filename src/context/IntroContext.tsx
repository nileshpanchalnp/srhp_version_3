import { createContext, useContext } from 'react';

/**
 * True once the opening loader has handed the screen over to the site.
 * Pages without a provider (or tests) behave as if the intro already finished.
 */
export const IntroContext = createContext<boolean>(true);

export const useIntroReady = () => useContext(IntroContext);
