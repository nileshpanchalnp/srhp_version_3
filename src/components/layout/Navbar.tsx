import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { EASE } from '../../motion/language';
import { useModalLock } from '../../hooks/useModalLock';
import { scrollToElement, scrollToTop } from '../../lib/scroll';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, SOCIAL_LINKS } from '../../data/siteContent';
import srhpLogo from '../../img/srhp_logo.webp';

const navLinks = [
  { name: 'Home', href: '/', anchor: 'home', isRoute: false },
  { name: 'Films', href: '/films', anchor: 'films', isRoute: true },
  { name: 'About Us', href: '/#about', anchor: 'about', isRoute: false },
  { name: 'News', href: '/newsandevent', anchor: 'news', isRoute: true },
  { name: 'Contact', href: '/#contact', anchor: 'contact', isRoute: false },
] as const;

type NavLink = (typeof navLinks)[number];

const SCROLL_KEY = 'navbar_pending_scroll';
const SECTION_IDS = ['home', 'about', 'films', 'news', 'contact'];

/** Which home-page section currently owns the middle of the screen. */
const useActiveSection = (enabled: boolean) => {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const measure = () => {
      const line = window.innerHeight * 0.4;
      let current = 'home';
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);
  return active;
};

export const Navbar = () => {
  const [navVisible, setNavVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const scrollAttemptRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const activeSection = useActiveSection(isHome);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useModalLock(menuOpen);

  /* ── pending anchor scroll after a route change ── */
  useEffect(() => {
    if (!isHome) return;
    const pending = sessionStorage.getItem(SCROLL_KEY);
    if (!pending) return;
    sessionStorage.removeItem(SCROLL_KEY);
    let attempts = 0;
    const tryScroll = () => {
      attempts++;
      const el = document.getElementById(pending);
      if (el) requestAnimationFrame(() => scrollToElement(el));
      else if (attempts < 15) scrollAttemptRef.current = setTimeout(tryScroll, 100);
    };
    scrollAttemptRef.current = setTimeout(tryScroll, 450);
    return () => {
      if (scrollAttemptRef.current) clearTimeout(scrollAttemptRef.current);
    };
  }, [isHome, location.key]);

  /* ── hide on scroll-down / show on scroll-up ── */
  useEffect(() => {
    const THRESHOLD = 6;
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastScrollY.current;
      if (y <= 10) {
        setNavVisible(true);
        setScrolled(false);
      } else {
        setScrolled(true);
        if (diff > THRESHOLD) setNavVisible(false);
        else if (diff < -THRESHOLD) setNavVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── close on route change ── */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ── keyboard: Esc closes, Tab stays inside the menu, focus returns ── */
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button') ?? []).filter((el) => !el.hasAttribute('disabled'));
    const first = window.setTimeout(() => focusables()[0]?.focus(), 450);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const idx = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && idx === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const toggle = toggleRef.current;
    return () => {
      window.clearTimeout(first);
      document.removeEventListener('keydown', onKey);
      toggle?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const go = (link: { href: string; anchor: string | null; isRoute: boolean }) => {
    setMenuOpen(false);
    if (link.isRoute) {
      navigate(link.href);
      return;
    }
    if (link.anchor === 'home') {
      if (isHome) scrollToTop();
      else navigate('/');
      return;
    }
    if (isHome) {
      scrollToElement(document.getElementById(link.anchor!));
    } else {
      sessionStorage.setItem(SCROLL_KEY, link.anchor!);
      navigate('/');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    e.preventDefault();
    go(link);
  };

  const isActive = (link: NavLink) => {
    if (isHome) return activeSection === link.anchor;
    return location.pathname === link.href;
  };

  return (
    <>
      {/* page progress: a single gold line across the top edge */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[103] h-[2px] origin-left bg-champagne"
        style={{ scaleX: progress, opacity: scrolled ? 1 : 0 }}
      />

      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[102] flex justify-center px-3 pt-3 md:px-6 md:pt-5"
        animate={{ y: navVisible || menuOpen ? 0 : '-130%' }}
        transition={{ duration: 0.45, ease: EASE.out }}
      >
        <nav
          aria-label="Primary"
          className={`pointer-events-auto flex w-full max-w-[1180px] items-center justify-between gap-4 border pl-4 pr-2 transition-[background-color,border-color,padding] duration-500 md:pl-6 ${
            menuOpen
              ? 'border-transparent bg-transparent py-2'
              : scrolled
                ? 'border-ivory/12 bg-ink/80 py-1.5 backdrop-blur-xl'
                : 'border-ivory/10 bg-ink/55 py-2.5 backdrop-blur-md'
          }`}
        >
          <a
            href="/"
            aria-label="SRHP Films — home"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              if (isHome) scrollToTop();
              else navigate('/');
            }}
            className="flex shrink-0 items-center"
          >
            <img src={srhpLogo} alt="SRHP Films" draggable={false} className="h-8 w-auto object-contain md:h-10" />
          </a>

          {/* desktop links */}
          <ul className="hidden items-center lg:flex">
            {navLinks.map((link) => {
              const on = isActive(link);
              return (
                <li key={link.name} className="relative">
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    aria-current={on ? 'page' : undefined}
                    className={`relative block px-5 py-3 font-title text-[1.15rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300 ${
                      on ? 'text-champagne' : 'text-ivory/75 hover:text-ivory'
                    }`}
                  >
                    {link.name}
                    {on && (
                      <motion.span
                        layoutId="nav-mark"
                        aria-hidden
                        className="absolute inset-x-5 bottom-1.5 h-[2px] bg-champagne"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="/#contact"
              onClick={(e) => handleClick(e, navLinks[4])}
              className="hidden bg-champagne px-5 py-3 font-title text-[1.05rem] font-bold uppercase tracking-[0.06em] text-ink transition-colors duration-300 hover:bg-ivory sm:block"
            >
              Start a Project
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="relative flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <motion.span
                  className="absolute left-0 top-0 block h-px w-6 bg-current"
                  animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: EASE.out }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 block h-px w-6 bg-current"
                  animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.4, ease: EASE.out }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile menu: opens like the loader's shutter ── */}
      <AnimatePresence>
        {menuOpen && (
          <div id="site-menu" className="fixed inset-0 z-[101] lg:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
            <motion.div
              ref={panelRef}
              data-lenis-prevent
              className="absolute inset-0 flex flex-col overflow-y-auto bg-ink px-6 pb-8 pt-28"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: EASE.inOut } }}
              exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.5, ease: EASE.inOut } }}
            >
              <div aria-hidden className="grain absolute inset-0" />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{ background: 'radial-gradient(60% 40% at 90% 0%, rgb(var(--c-champagne) / 0.12), transparent 70%)' }}
              />

              <ul className="relative z-10 my-auto">
                {navLinks.map((link, i) => {
                  const on = isActive(link);
                  return (
                    <li key={link.name} className="overflow-hidden border-b border-ivory/10">
                      <motion.div
                        initial={{ y: '105%' }}
                        animate={{ y: 0, transition: { delay: 0.3 + i * 0.06, duration: 0.7, ease: EASE.out } }}
                        exit={{ y: '105%', transition: { duration: 0.25 } }}
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleClick(e, link)}
                          aria-current={on ? 'page' : undefined}
                          className={`block py-3 font-title text-[clamp(3.4rem,17vw,6.5rem)] font-black uppercase leading-[0.95] ${
                            on ? 'text-champagne' : 'text-ivory'
                          }`}
                        >
                          {link.name}
                        </a>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>

              <motion.div
                className="relative z-10 mt-8 flex flex-col gap-1.5 text-[0.95rem] text-mute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.75, duration: 0.7 } }}
              >
                <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit transition-colors hover:text-champagne">
                  {CONTACT_EMAIL}
                </a>
                <a href={CONTACT_PHONE_HREF} className="w-fit transition-colors hover:text-champagne">
                  {CONTACT_PHONE}
                </a>
                <div className="mt-3 flex gap-6">
                  {SOCIAL_LINKS.map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="text-ivory transition-colors hover:text-champagne">
                      {s.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
