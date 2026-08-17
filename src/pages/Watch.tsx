import { motion } from 'framer-motion';
import { ExternalLink, PlaySquare, Youtube } from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const Watch = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ember-500/10 border border-ember-500/30 mb-6">
            <Youtube className="w-4 h-4 text-ember-200" />
            <span className="text-ember-100 text-sm tracking-wide">YouTube</span>
          </div>
          <h1 className="section-heading mb-4">Watch</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            Lore videos, shorts, and behind-the-stacks updates — all in one place.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="card-glow p-6 md:p-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50">
              Latest uploads
            </h2>
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

          <div className="rounded-xl border border-ink-800 bg-ink-950/40 overflow-hidden">
            <iframe
              title={`${siteInfo.title} — YouTube uploads`}
              src={siteInfo.externalLinks.youtubeUploadsEmbed}
              width="100%"
              height="480"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              loading="lazy"
              className="block w-full"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={siteInfo.externalLinks.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Watch on YouTube
              <PlaySquare className="w-4 h-4 ml-2" />
            </a>
            <a
              href={siteInfo.externalLinks.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Back to the site
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Watch;

