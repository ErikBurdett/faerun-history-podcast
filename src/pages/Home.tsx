import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Headphones, Play } from 'lucide-react';
import FolioHero from '../components/FolioHero';
import { blogPosts, siteInfo } from '../data/podcastData';
import { usePodcastFeedEpisodes } from '../lib/podcastFeed';

export default function Home() {
  const { episodes, loading } = usePodcastFeedEpisodes(siteInfo.externalLinks.rssFeed);
  const latest = episodes[0];

  return <div className="folio-page">
    <FolioHero art="erilian" alt="Erilian in his gold-embroidered hood, reading by candlelight in the Hidden Stacks." label="A Faerûn Lorecast" title={<>The Lich’s <em>Tale</em></>}>
      <p className="hero-lede">Beneath Waterdeep, Erilian Kantonine keeps a candle burning for the forgotten histories of Faerûn. Pull up a chair.</p>
      <div className="folio-actions"><Link className="gilt-button" to="/episodes"><Play size={15} fill="currentColor" />Listen to the episodes</Link><Link className="quiet-link" to="/about#meet-the-host">Meet Erilian <ArrowRight size={17} /></Link></div>
    </FolioHero>

    <section className="folio-width front-shelf">
      <div className="section-title"><div><p className="folio-label">The listening room</p><h2>Latest episode</h2></div><Link className="quiet-link" to="/episodes">Episode archive <ArrowRight size={16} /></Link></div>
      <article className="episode-feature">
        {latest?.imageUrl ? <img className="episode-cover" src={latest.imageUrl} alt={`Cover for ${latest.title}`} loading="lazy" /> : <img className="episode-cover" src="/assets/lichtale-cover-final.JPG" alt="The Lich’s Tale show cover" loading="lazy" />}
        <div><p className="folio-label episode-meta"><Headphones size={14}/>{[latest?.episodeLabel, latest?.publishedDateLabel, latest?.durationLabel].filter(Boolean).join(' · ') || 'The Lich’s Tale'}</p>
          <h3>{latest?.title ?? (loading ? 'Opening the archive…' : 'Listen to The Lich’s Tale')}</h3>
          {latest?.description && <p className="episode-excerpt">{latest.description}</p>}
          {latest?.audioUrl && <audio controls preload="none" aria-label={latest.title} src={latest.audioUrl} />}
          <div className="mini-links">{latest?.episodeUrl && <a href={latest.episodeUrl}>Episode notes <ArrowUpRight size={14}/></a>}<Link to="/listen">Full playlist <ArrowRight size={14}/></Link><a href={siteInfo.externalLinks.spotifyShow}>Spotify <ArrowUpRight size={14}/></a></div>
        </div>
      </article>
    </section>

    <section className="folio-width world-invitation">
      <img src="/assets/folio/wardhall.webp" alt="A stone bridge crosses the river at Wardhall beneath an autumn oak." loading="lazy" />
      <div><p className="folio-label">Worlds &amp; games</p><h2>Theandril</h2><p>Follow the broken Witness Roads into our original fantasy setting, from Erilian’s card tavern to the realms beyond the river.</p><Link className="quiet-link" to="/theandril">Explore Theandril <ArrowRight size={17}/></Link></div>
    </section>

    <section className="folio-width front-shelf">
      <div className="section-title"><div><p className="folio-label">The Hidden Stacks</p><h2>From the archive</h2></div><Link className="quiet-link" to="/blog">All writing <ArrowRight size={16}/></Link></div>
      <div className="archive-grid"><img src="/assets/folio/study.webp" alt="A scholar’s study with a writing desk beneath a tall arched window." loading="lazy" /><div>{blogPosts.slice(0, 2).map(post => <Link className="article-link" to={`/blog/${post.slug}`} key={post.slug}><BookOpen size={18}/><div><h3>{post.title}</h3><p>{post.excerpt}</p></div><ArrowRight size={16}/></Link>)}</div></div>
      <div className="mini-links section-links"><Link to="/watch">Watch the show <ArrowRight size={14}/></Link><Link to="/library">Browse the D&amp;D library <ArrowRight size={14}/></Link><Link to="/contact">Request an episode <ArrowRight size={14}/></Link></div>
    </section>
  </div>;
}
