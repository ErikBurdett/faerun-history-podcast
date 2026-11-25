import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, ChevronDown, Compass, Menu } from 'lucide-react';

import { destinations } from '../data/navigation';

export default function Navbar() {
  const { pathname } = useLocation();
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (menu.current && !menu.current.contains(event.target as Node)) menu.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, []);

  return <header className="masthead">
    <div className="folio-width masthead-inner">
      <Link className="wordmark" to="/"><span className="book-seal"><BookOpen size={23} /></span>The Lich’s Tale</Link>
      <nav aria-label="Main navigation" className="folio-nav">
        {destinations.slice(0, 4).map(([label, path]) => <NavLink key={path} to={path} end={path === '/'} className="top-link">{path === '/theandril' && <Compass size={15} />}{label}</NavLink>)}
        <details ref={menu} className="more-menu">
          <summary><span className="wide-menu">More <ChevronDown size={14} /></span><span className="small-menu"><Menu size={19} /> Menu</span></summary>
          <div className="menu-links">{destinations.map(([label, path], index) =>
            <NavLink key={path} to={path} end={path === '/'} className={index < 4 ? 'mobile-destination' : ''} onClick={() => { if (menu.current) menu.current.open = false; }}>{label}</NavLink>
          )}</div>
        </details>
      </nav>
    </div>
  </header>;
}
