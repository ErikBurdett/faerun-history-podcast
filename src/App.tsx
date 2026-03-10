import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Sponsors from './pages/Sponsors';

function App() {
  return (
    <div className="min-h-screen bg-ink-950 relative">
      {/* Arcane background pattern */}
      <div className="fixed inset-0 bg-runes opacity-70 pointer-events-none" />
      <div className="fixed inset-0 noise pointer-events-none" />
      <div className="fixed inset-0 vignette pointer-events-none" />

      {/* Ambient magic glows */}
      <div className="fixed top-[-140px] left-[18%] w-[560px] h-[560px] bg-mana-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-180px] right-[18%] w-[720px] h-[720px] bg-candle-500/10 rounded-full blur-[190px] pointer-events-none" />
      <div className="fixed top-[42%] left-[-160px] w-[560px] h-[560px] bg-ember-500/8 rounded-full blur-[190px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/episodes" element={<Episodes />} />
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
    </div>
  );
}

export default App;

