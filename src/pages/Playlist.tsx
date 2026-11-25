import ArchiveHeading from '../components/ArchiveHeading';
import { motion } from 'framer-motion';
import { siteInfo } from '../data/podcastData';

const Playlist = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArchiveHeading title="Listen" art="study">
          Settle in for an evening in the stacks. Choose an episode from the full playlist.
        </ArchiveHeading>

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

