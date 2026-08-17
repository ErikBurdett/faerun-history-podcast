import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenText,
  Calendar,
  Clock,
  ExternalLink,
  Headphones,
  Sparkles,
  Youtube,
} from 'lucide-react';
import { blogPosts, siteInfo } from '../data/podcastData';
import { usePodcastFeedEpisodes } from '../lib/podcastFeed';

const Home = () => {
  const { episodes, loading: episodesLoading } = usePodcastFeedEpisodes(
    siteInfo.externalLinks.rssFeed,
  );
  const latestEpisode = episodes[0];
  const latestPosts = blogPosts.slice(0, 2);
  const STAR_COUNT = 32;
  const STAR_ANGLE = '42deg';
  const STAR_DX = '120vw';
  const STAR_DY = '76vh';

  const fallingStars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const xPct = -22 + ((i * 9) % 140); // -22% .. 118%
    const yPct = -26 + ((i * 13) % 84); // -26% .. 58%
    const delay = ((i * 1.35) % 22).toFixed(2);
    const dur = (11.5 + (i % 9) * 1.15).toFixed(2);
    const len = 140 + (i % 10) * 18;
    const size = i % 7 === 0 ? '2.5px' : i % 3 === 0 ? '2px' : '1.5px';

    return {
      x: `${xPct}%`,
      y: `${yPct}%`,
      dx: STAR_DX,
      dy: STAR_DY,
      dur: `${dur}s`,
      delay: `${delay}s`,
      len: `${len}px`,
      angle: STAR_ANGLE,
      size,
    };
  });

  return (
    <div className="min-h-screen pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.32] scale-[1.03]"
            style={{
              backgroundImage: "url('/assets/lichtale-cover-final.JPG')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/10 via-ink-950/60 to-ink-950" />
          <div className="star-field opacity-70">
            {fallingStars.map((s, idx) => (
              <span
                key={`${s.x}-${s.y}-${s.delay}-${s.dur}-${idx}`}
                className="star"
                style={
                  {
                    ['--x']: s.x,
                    ['--y']: s.y,
                    ['--dx']: s.dx,
                    ['--dy']: s.dy,
                    ['--dur']: s.dur,
                    ['--delay']: s.delay,
                    ['--len']: s.len,
                    ['--angle']: s.angle,
                    ['--size']: s.size,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mana-500/10 border border-mana-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-mana-300" />
              <span className="text-mana-200 text-sm tracking-wide">
                Arcane history. Candlelit narration.
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-bone-50 leading-tight mb-4 text-glow">
              {siteInfo.title}
            </h1>
            <p className="text-lg md:text-xl text-ink-200 max-w-3xl mx-auto leading-relaxed mb-5">
              {siteInfo.subtitle}
            </p>
            <p className="text-base md:text-lg text-ink-200/90 max-w-4xl mx-auto leading-relaxed mb-8">
              {siteInfo.description}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/episodes" className="btn btn-primary group">
                Listen now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/blog" className="btn btn-outline">
                Read the blog
                <BookOpenText className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              className="lg:col-span-3 card-glow p-6 md:p-8"
            >
              <div className="flex items-center gap-2 text-ink-300 mb-4">
                <Headphones className="w-4 h-4 text-candle-300" />
                <span className="text-sm tracking-wide">
                  {episodesLoading ? 'Loading latest episode…' : 'Latest episode'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50 mb-2">
                {latestEpisode?.title ?? 'New episode soon'}
              </h2>
              {latestEpisode && (
                <>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {latestEpisode.episodeLabel && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                        {latestEpisode.episodeLabel}
                      </span>
                    )}
                    {latestEpisode.publishedDateLabel && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                        <Calendar className="w-3.5 h-3.5 text-mana-300" />
                        {latestEpisode.publishedDateLabel}
                      </span>
                    )}
                    {latestEpisode.durationLabel && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                        <Clock className="w-3.5 h-3.5 text-candle-300" />
                        {latestEpisode.durationLabel}
                      </span>
                    )}
                  </div>

                  {latestEpisode.imageUrl && (
                    <div className="mb-5">
                      <img
                        src={latestEpisode.imageUrl}
                        alt={`${latestEpisode.title} cover art`}
                        loading="lazy"
                        className="w-full rounded-xl border border-ink-800 bg-ink-950/40 object-cover aspect-[16/10]"
                      />
                    </div>
                  )}

                  {latestEpisode.audioUrl && (
                    <div className="rounded-xl border border-ink-800 bg-ink-950/40 overflow-hidden mb-5 p-4">
                      <audio
                        controls
                        preload="none"
                        src={latestEpisode.audioUrl}
                        className="w-full"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Link to="/episodes" className="btn btn-primary">
                      All episodes
                    </Link>
                    {latestEpisode.episodeUrl && (
                      <a
                        href={latestEpisode.episodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                      >
                        Episode page
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}
                    <a
                      href={siteInfo.externalLinks.spotifyShow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Spotify
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </>
              )}
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: 0.08 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="card-glow p-6">
                <h3 className="text-xl font-display font-semibold text-bone-50 mb-3">
                  Follow the show
                </h3>
                <p className="text-ink-200 leading-relaxed mb-4">
                  The full show feed on Spotify — perfect for browsing and
                  jumping between episodes.
                </p>
                <div className="rounded-xl border border-ink-800 bg-ink-950/40 overflow-hidden">
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: 12 }}
                    src={siteInfo.externalLinks.spotifyShowEmbed}
                    width="100%"
                    height="352"
                    frameBorder={0}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="block w-full"
                  />
                </div>
              </div>

              <div className="card-glow p-6">
                <div className="flex items-center gap-2 text-ink-300 mb-4">
                  <Youtube className="w-4 h-4 text-ember-200" />
                  <span className="text-sm tracking-wide">Watch</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-bone-50 mb-3">
                  YouTube channel
                </h3>
                <p className="text-ink-200 leading-relaxed mb-4">
                  Lore videos, shorts, and behind-the-stacks updates.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/watch" className="btn btn-primary">
                    Watch
                  </Link>
                  <a
                    href={siteInfo.externalLinks.youtubeChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Open channel
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              <div className="card-glow p-6">
                <h3 className="text-xl font-display font-semibold text-bone-50 mb-3">
                  From the blog
                </h3>
                <div className="space-y-4">
                  {latestPosts.map((p) => (
                    <div key={p.slug} className="border border-ink-900/60 rounded-xl p-4 bg-ink-950/30">
                      <p className="text-xs text-ink-300 mb-1">{p.publishedDateLabel}</p>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="block text-bone-50 font-display font-semibold hover:text-candle-200 transition-colors"
                      >
                        {p.title}
                      </Link>
                      <p className="text-ink-200 text-sm mt-2 leading-relaxed">
                        {p.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link to="/blog" className="btn btn-outline">
                    Browse the archive
                  </Link>
                </div>
              </div>

              <div className="card-glow p-6">
                <h3 className="text-xl font-display font-semibold text-bone-50 mb-3">
                  Contact / requests
                </h3>
                <p className="text-ink-200 leading-relaxed mb-4">
                  Send episode requests, corrections, or lore rabbit holes you want us to dig into.
                </p>
                <Link to="/contact" className="btn btn-primary">
                  Contact
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

