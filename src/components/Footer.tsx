import { Link } from 'react-router-dom';
import { BookOpenText, Globe, Headphones, Mail, Skull } from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 border-t border-ink-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-candle-500/90 via-mana-500/80 to-wraith-500/70 flex items-center justify-center shadow-lg shadow-mana-500/20 border border-ink-800/80">
                <Skull className="w-6 h-6 text-ink-950/90" />
              </div>
              <div>
                <p className="font-display font-semibold text-bone-50 tracking-wide">
                  {siteInfo.title}
                </p>
                <p className="text-sm text-mana-200 tracking-wide">
                  {siteInfo.subtitle}
                </p>
              </div>
            </div>
            <p className="text-ink-200 mb-6 max-w-md leading-relaxed">
              {siteInfo.description}
            </p>
            <div className="flex gap-3">
              <a 
                href={siteInfo.externalLinks.spotifyEpisode}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-candle-200 hover:bg-candle-500/10 border border-ink-800 hover:border-candle-500/30 transition-all duration-300"
                title="Listen on Spotify"
              >
                <Headphones className="w-5 h-5" />
              </a>
              <Link
                to="/blog"
                className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 border border-ink-800 hover:border-mana-500/30 transition-all duration-300"
                title="Blog"
              >
                <BookOpenText className="w-5 h-5" />
              </Link>
              <a
                href={`mailto:${siteInfo.contactEmail}`}
                className="p-3 rounded-lg bg-ink-900/40 text-ink-200 hover:text-mana-200 hover:bg-mana-500/10 border border-ink-800 hover:border-mana-500/30 transition-all duration-300"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-bone-50 mb-6 tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/episodes" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  Episodes
                </Link>
              </li>
              <li>
                <Link to="/listen" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  Listen
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-candle-400 transition-colors" />
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="text-ink-200 hover:text-mana-200 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-600 group-hover:bg-mana-400 transition-colors" />
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-bone-50 mb-6 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={siteInfo.externalLinks.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-200 hover:text-mana-200 transition-colors flex items-center gap-3 group"
                >
                  <Globe className="w-4 h-4 text-ink-400 group-hover:text-mana-300 transition-colors" />
                  <span className="text-sm">taleofthelich.com</span>
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="text-ink-200 hover:text-mana-200 transition-colors flex items-center gap-3 group"
                >
                  <Mail className="w-4 h-4 text-ink-400 group-hover:text-mana-300 transition-colors" />
                  <span className="text-sm">{siteInfo.contactEmail}</span>
                </a>
              </li>
              <li>
                <a 
                  href={siteInfo.externalLinks.spotifyEpisode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-200 hover:text-candle-200 transition-colors flex items-center gap-3 group"
                >
                  <Headphones className="w-4 h-4 text-ink-400 group-hover:text-candle-300 transition-colors" />
                  <span className="text-sm">Listen on Spotify</span>
                </a>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-ink-200 hover:text-mana-200 transition-colors flex items-center gap-3 group"
                >
                  <BookOpenText className="w-4 h-4 text-ink-400 group-hover:text-mana-300 transition-colors" />
                  <span className="text-sm">Read show notes</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ink-900/70 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-ink-300 text-sm">
              {currentYear} {siteInfo.title}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to="/sponsors#dharma-web-solutions"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-800 bg-ink-900/30 text-ink-300 hover:text-bone-50 hover:border-mana-500/30 hover:bg-mana-500/10 transition-all duration-300 text-xs"
              >
                <img
                  src="/dharma-wheel.svg"
                  alt="Dharma wheel"
                  className="w-4 h-4"
                />
                <span>Developed with care by Dharma Web Solutions</span>
              </Link>
              <p className="text-ink-500 text-xs">Built with React + Vite</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-ink-500 text-xs leading-relaxed max-w-4xl mx-auto text-center">
              {siteInfo.disclaimerLines.map((line, idx) => (
                <span key={line}>
                  {line}
                  {idx < siteInfo.disclaimerLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

