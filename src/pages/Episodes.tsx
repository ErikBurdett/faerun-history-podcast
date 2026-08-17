import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Headphones,
  Search,
} from 'lucide-react';
import { siteInfo } from '../data/podcastData';
import { usePodcastFeedEpisodes } from '../lib/podcastFeed';

const Episodes = () => {
  const { episodes, loading, error, lastUpdatedAt } = usePodcastFeedEpisodes(
    siteInfo.externalLinks.rssFeed,
  );
  const [query, setQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const [visibleCount, setVisibleCount] = useState(14);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [autoplayNonce, setAutoplayNonce] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = episodes;
    if (normalizedQuery) {
      list = list.filter((ep) => {
        const haystack = `${ep.episodeLabel ?? ''} ${ep.title} ${ep.description ?? ''}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }
    if (!sortNewest) list = [...list].reverse();
    return list;
  }, [episodes, normalizedQuery, sortNewest]);

  const visible = filtered.slice(0, visibleCount);

  useEffect(() => {
    if (selectedId || episodes.length === 0) return;
    setSelectedId(episodes[0].id);
  }, [episodes, selectedId]);

  useEffect(() => {
    setVisibleCount(14);
  }, [normalizedQuery, sortNewest]);

  const selectedEpisode = useMemo(
    () => episodes.find((e) => e.id === selectedId),
    [episodes, selectedId],
  );

  const handlePlay = (id: string) => {
    setSelectedId(id);
    setAutoplayNonce((n) => n + 1);
  };

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
            history. Listen on-site, or open the show on Spotify.
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
              href={siteInfo.externalLinks.spotifyShow}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Open on Spotify
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

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="card-glow p-6 md:p-8 mb-10"
        >
          <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50">
                Browse the archive
              </h2>
              <p className="text-ink-300 text-sm mt-2">
                {loading && episodes.length === 0 ? (
                  'Loading episodes…'
                ) : (
                  <>
                    {filtered.length} entries
                    {typeof lastUpdatedAt === 'number' ? (
                      <span className="text-ink-500"> • updated {new Date(lastUpdatedAt).toLocaleString()}</span>
                    ) : null}
                  </>
                )}
              </p>
              {error ? (
                <p className="text-ember-200 text-sm mt-2">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search titles, numbers…"
                  className="input pl-11"
                  aria-label="Search episodes"
                />
              </div>
              <button
                type="button"
                onClick={() => setSortNewest((v) => !v)}
                className="btn btn-outline h-12"
              >
                {sortNewest ? 'Newest first' : 'Oldest first'}
              </button>
            </div>
          </div>
        </motion.section>

        {selectedEpisode ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className="card-glow p-6 md:p-8 mb-10"
          >
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
              <div className="min-w-0">
                <p className="text-sm text-ink-300 mb-2">{selectedEpisode.showName}</p>
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-bone-50 leading-tight">
                  {selectedEpisode.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedEpisode.episodeLabel ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                      {selectedEpisode.episodeLabel}
                    </span>
                  ) : null}
                  {selectedEpisode.episodeType && selectedEpisode.episodeType !== 'full' ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-wraith-500/10 border border-wraith-500/30 text-wraith-100">
                      {selectedEpisode.episodeType}
                    </span>
                  ) : null}
                  {selectedEpisode.publishedDateLabel ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                      <Calendar className="w-3.5 h-3.5 text-mana-300" />
                      {selectedEpisode.publishedDateLabel}
                    </span>
                  ) : null}
                  {selectedEpisode.durationLabel ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                      <Clock className="w-3.5 h-3.5 text-candle-300" />
                      {selectedEpisode.durationLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedEpisode.episodeUrl ? (
                  <a
                    className="btn btn-outline h-10 py-2 px-4"
                    href={selectedEpisode.episodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Episode page
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                ) : null}
                {selectedEpisode.audioUrl ? (
                  <a
                    className="btn btn-outline h-10 py-2 px-4"
                    href={selectedEpisode.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download MP3
                    <Download className="w-4 h-4 ml-2" />
                  </a>
                ) : null}
              </div>
            </div>

            {selectedEpisode.audioUrl ? (
              <div className="rounded-xl border border-ink-800 bg-ink-950/40 overflow-hidden mt-6 p-4">
                <audio
                  key={`${selectedEpisode.id}:${autoplayNonce}`}
                  controls
                  preload="none"
                  autoPlay={autoplayNonce > 0}
                  src={selectedEpisode.audioUrl}
                  className="w-full"
                />
              </div>
            ) : (
              <p className="text-ink-200 mt-6">Audio not available for this entry.</p>
            )}
          </motion.section>
        ) : null}

        <div className="grid gap-6">
          {visible.map((ep, index) => {
            const isSelected = ep.id === selectedId;
            return (
              <motion.article
                key={ep.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: Math.min(index * 0.06, 0.24) }}
                className={`card-glow p-6 md:p-7 ${
                  isSelected ? 'border-mana-500/40' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div className="min-w-0">
                    <p className="text-xs text-ink-300 mb-2">{ep.showName}</p>
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-bone-50 leading-tight">
                      {ep.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {ep.episodeLabel ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                          {ep.episodeLabel}
                        </span>
                      ) : null}
                      {ep.episodeType && ep.episodeType !== 'full' ? (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-wraith-500/10 border border-wraith-500/30 text-wraith-100">
                          {ep.episodeType}
                        </span>
                      ) : null}
                      {ep.publishedDateLabel ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                          <Calendar className="w-3.5 h-3.5 text-mana-300" />
                          {ep.publishedDateLabel}
                        </span>
                      ) : null}
                      {ep.durationLabel ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-ink-950/40 border border-ink-800 text-ink-200">
                          <Clock className="w-3.5 h-3.5 text-candle-300" />
                          {ep.durationLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handlePlay(ep.id)}
                      className={`btn ${
                        isSelected ? 'btn-primary' : 'btn-outline'
                      } h-10 py-2 px-4`}
                    >
                      {isSelected ? 'Selected' : 'Play'}
                    </button>
                    {ep.episodeUrl ? (
                      <a
                        className="btn btn-outline h-10 py-2 px-4"
                        href={ep.episodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Page
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length > visibleCount ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setVisibleCount((n) => n + 14)}
            >
              Load more
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Episodes;

