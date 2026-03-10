import { motion } from 'framer-motion';
import { sponsors } from '../data/podcastData';

const Sponsors = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mana-500/10 border border-mana-500/30 mb-6">
            <img
              src="/dharma-wheel.svg"
              alt="Dharma wheel"
              className="w-4 h-4"
            />
            <span className="text-mana-200 text-sm tracking-wide">
              Support the Archive
            </span>
          </div>
          <h1 className="section-heading mb-4">Sponsors</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            Thanks to the sponsors helping keep the candles lit and the stacks
            in order.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {sponsors.map((s, idx) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.08 }}
              className="card-glow p-6 md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl border border-mana-500/30 bg-mana-500/10 flex items-center justify-center">
                  <img
                    src="/dharma-wheel.svg"
                    alt="Dharma wheel"
                    className="w-7 h-7"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-display font-semibold text-bone-50 leading-tight">
                    {s.name}
                  </h2>
                  <p className="text-sm text-ink-300 mt-1">
                    Current sponsor
                  </p>
                </div>
              </div>

              <p className="text-ink-200 leading-relaxed mt-5">{s.description}</p>

              {s.websiteUrl && (
                <div className="mt-6">
                  <a
                    href={s.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    Visit sponsor site
                  </a>
                </div>
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;

