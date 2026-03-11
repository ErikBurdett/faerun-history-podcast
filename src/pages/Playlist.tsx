import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const Playlist = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-candle-500/10 border border-candle-500/30 mb-6">
            <Headphones className="w-4 h-4 text-candle-300" />
            <span className="text-candle-200 text-sm tracking-wide">
              Transistor playlist
            </span>
          </div>
          <h1 className="section-heading mb-4">Listen</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            A scrollable playlist embed — perfect for sharing and binge-listening.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="card-glow p-4 md:p-6"
        >
          <iframe
            title={`${siteInfo.title} — playlist`}
            src={siteInfo.externalLinks.transistorPlaylistEmbed}
            width="100%"
            height={390}
            style={{ border: 0 }}
            loading="lazy"
            className="block w-full rounded-xl"
          />
        </motion.section>
      </div>
    </div>
  );
};

export default Playlist;

