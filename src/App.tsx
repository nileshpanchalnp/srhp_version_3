// App.tsx
import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Home from './pages/Home';
import NewsAndEventPage from './pages/NewsAndEventPage';
import { LegalPage } from './pages/LegalPage';
import { AllFilmsPage } from './pages/Allfilmspage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/layout/CustomCursor';
import { Loader } from './components/layout/Loader';
import { IntroContext } from './context/IntroContext';
import { setLenis, scrollToTop } from './lib/scroll';
import { EASE } from './motion/language';

/**
 * Route-level transition: the new page is wiped in from the top like a rising blind.
 * The clip is removed once it finishes so nothing (shadows, fixed children) stays clipped.
 */
const PageShell = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    animate={{ clipPath: 'inset(0% 0% 0% 0%)', transitionEnd: { clipPath: 'none' }, transition: { duration: 0.85, ease: EASE.inOut } }}
    exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE.inOut } }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  /* Opening loader: `introReady` flips when the curtain starts opening, `showLoader` when it is gone. */
  const [showLoader, setShowLoader] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const handleReveal = useCallback(() => setIntroReady(true), []);
  const handleDone = useCallback(() => setShowLoader(false), []);

  /* Smooth scrolling — created once, always destroyed, loop cancelled. */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  /* A new route always opens at the top — unless a navbar anchor is pending. */
  useEffect(() => {
    if (sessionStorage.getItem('navbar_pending_scroll')) return;
    scrollToTop(true);
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introReady}>
      {showLoader && <Loader onReveal={handleReveal} onDone={handleDone} />}
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[300] -translate-y-24 bg-champagne px-4 py-2 text-xs text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageShell><Home /></PageShell>} />
          <Route path="/newsandevent" element={<PageShell><NewsAndEventPage /></PageShell>} />
          <Route path="/films" element={<PageShell><AllFilmsPage /></PageShell>} />
          <Route path="/terms" element={<PageShell><LegalPage type="terms" /></PageShell>} />
          <Route path="/privacy" element={<PageShell><LegalPage type="privacy" /></PageShell>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      </IntroContext.Provider>
    </MotionConfig>
  );
}

export default App;
