import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenText,
  Headphones,
  Mail,
  Menu,
  Skull,
  Youtube,
  X,
} from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Episodes', path: '/episodes' },
  { name: 'Listen', path: '/listen' },
  { name: 'Watch', path: '/watch' },
  { name: 'Library', path: '/library' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Sponsors', path: '/sponsors' },
  { name: 'Contact', path: '/contact' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-950/65 backdrop-blur-lg border-b border-ink-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-candle-500/90 via-ember-400/80 to-mana-500/75 flex items-center justify-center shadow-lg shadow-mana-500/20 group-hover:shadow-mana-500/40 transition-all duration-300 border border-ink-800/80">
              <Skull className="w-6 h-6 text-ink-950/90" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-semibold text-bone-50 text-sm tracking-wide">
                {siteInfo.title}
              </p>
              <p className="text-xs text-mana-200 tracking-wide">
                {siteInfo.subtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                  isActive(link.path) 
                    ? 'text-candle-200' 
                    : 'text-ink-200 hover:text-bone-50'
                }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-mana-500/10 rounded-lg border border-mana-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href={siteInfo.externalLinks.spotifyShow}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-ink-200 hover:text-candle-200 hover:bg-candle-500/10 transition-all duration-300"
              title="Listen on Spotify"
            >
              <Headphones className="w-5 h-5" />
            </a>
            <a
              href={siteInfo.externalLinks.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-ink-200 hover:text-ember-200 hover:bg-ember-500/10 transition-all duration-300"
              title="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <Link
              to="/blog"
              className="p-2 rounded-lg text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 transition-all duration-300"
              title="Blog"
            >
              <BookOpenText className="w-5 h-5" />
            </Link>
            <a 
              href={`mailto:${siteInfo.contactEmail}`}
              className="p-2 rounded-lg text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 transition-all duration-300"
              title="Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-bone-50 hover:text-candle-200 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-ink-950 border-l border-ink-900 z-50 md:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-candle-500/90 via-mana-500/80 to-wraith-500/70 flex items-center justify-center border border-ink-800/80">
                    <Skull className="w-5 h-5 text-ink-950/90" />
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 text-ink-200 hover:text-bone-50 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive(link.path)
                            ? 'text-candle-200 bg-mana-500/10 border border-mana-500/30'
                            : 'text-bone-50/90 hover:text-candle-200 hover:bg-ink-900/40'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-ink-900">
                  <p className="text-sm text-ink-300 mb-4">Links</p>
                  <div className="flex gap-3">
                    <a 
                      href={siteInfo.externalLinks.spotifyShow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-candle-200 hover:bg-candle-500/10 transition-all duration-300 border border-ink-800"
                    >
                      <Headphones className="w-5 h-5" />
                    </a>
                    <a
                      href={siteInfo.externalLinks.youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-ember-200 hover:bg-ember-500/10 transition-all duration-300 border border-ink-800"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                    <Link
                      to="/blog"
                      onClick={() => setMenuOpen(false)}
                      className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 transition-all duration-300 border border-ink-800"
                    >
                      <BookOpenText className="w-5 h-5" />
                    </Link>
                    <a 
                      href={`mailto:${siteInfo.contactEmail}`}
                      className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 transition-all duration-300 border border-ink-800"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

