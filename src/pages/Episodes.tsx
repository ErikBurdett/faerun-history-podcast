import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Headphones } from 'lucide-react';
import { episodes, siteInfo } from '../data/podcastData';

const Episodes = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mana-500/10 border border-mana-500/30 mb-6">
            <Headphones className="w-4 h-4 text-mana-300" />
            <span className="text-mana-200 text-sm tracking-wide">
              Episodes Archive
            </span>
          </div>
          <h1 className="section-heading mb-4">Episodes</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            Each episode is a candlelit page-turn through Faerûn’s shadowed
            history. Listen on-site, or open an episode in Spotify.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="card-glow p-6 md:p-8 mb-10"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50">
              Listen to the show
            </h2>
            <a
              href={siteInfo.externalLinks.spotifyEpisode}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Open latest episode
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
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
        </motion.section>

        <div className="grid gap-8">
          {episodes.map((ep, index) => (
            <motion.article
              key={ep.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: Math.min(index * 0.08, 0.3) }}
              className="card-glow p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm text-ink-300 mb-2">{ep.showName}</p>
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50 leading-tight">
                    {ep.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  {ep.publishedDateLabel && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                      <Calendar className="w-3.5 h-3.5 text-mana-300" />
                      {ep.publishedDateLabel}
                    </span>
                  )}
                  {ep.durationLabel && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                      <Clock className="w-3.5 h-3.5 text-candle-300" />
                      {ep.durationLabel}
                    </span>
                  )}
                </div>
              </div>

              {ep.coverImageUrl && (
                <div className="mb-6">
                  <img
                    src={ep.coverImageUrl}
                    alt={ep.coverImageAlt ?? `${ep.title} cover art`}
                    loading="lazy"
                    className="w-full max-w-md mx-auto rounded-xl border border-ink-800 bg-ink-950/40 object-cover aspect-square"
                  />
                </div>
              )}

              <p className="text-ink-200 leading-relaxed mb-5">
                {ep.description}
              </p>

              <div className="rounded-xl border border-ink-800 bg-ink-950/40 overflow-hidden mb-5">
                <iframe
                  title={`${siteInfo.title} — ${ep.title}`}
                  src={ep.spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block w-full"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  className="btn btn-primary"
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Spotify
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
                <a
                  className="btn btn-outline"
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share link
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Episodes;

