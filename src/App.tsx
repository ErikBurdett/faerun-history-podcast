import { useEffect } from 'react';
import Theandril from './pages/Theandril';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import Playlist from './pages/Playlist';
import Watch from './pages/Watch';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Sponsors from './pages/Sponsors';
import Library from './pages/Library';

function App() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = pathname === '/theandril' ? 'Theandril | The Lich’s Tale' : 'The Lich’s Tale | A Faerûn Lorecast';
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', new URL(pathname, 'https://taleofthelich.com').href);
  }, [pathname, hash]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theandril" element={<Theandril />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/listen" element={<Playlist />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:category" element={<Library />} />
          <Route path="/library/:category/:index" element={<Library />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

