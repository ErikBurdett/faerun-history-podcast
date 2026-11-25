import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { destinations } from '../data/navigation';
import { siteInfo } from '../data/podcastData';

export default function Footer() {
  return <footer className="site-footer"><div className="folio-width">
    <div className="footer-grid">
      <div><Link className="wordmark" to="/"><BookOpen size={25} />The Lich’s Tale</Link><p>A Faerûn Lorecast</p>
        <a href={`mailto:${siteInfo.contactEmail}`}>{siteInfo.contactEmail}</a></div>
      <nav aria-label="Footer navigation">{destinations.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}</nav>
      <div className="footer-platforms"><a href={siteInfo.externalLinks.spotifyShow}>Spotify</a><a href={siteInfo.externalLinks.youtubeChannel}>YouTube</a><a href={siteInfo.externalLinks.rssFeed}>RSS feed</a></div>
    </div>
    <div className="colophon"><p>{siteInfo.disclaimerLines.join(' ')}</p><Link to="/sponsors#dharma-web-solutions">Dharma Web Solutions</Link></div>
  </div></footer>;
}
