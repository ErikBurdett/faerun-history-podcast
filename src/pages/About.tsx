import { motion } from 'framer-motion';
import { BookOpenText, Headphones, ScrollText, Skull, UserRound } from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const About = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wraith-500/10 border border-wraith-500/30 mb-6">
            <Skull className="w-4 h-4 text-wraith-300" />
            <span className="text-wraith-200 text-sm tracking-wide">
              About the Show
            </span>
          </div>
          <h1 className="section-heading mb-4">What is {siteInfo.title}?</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            {siteInfo.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: ScrollText,
              title: 'Realms history, not just trivia',
              body: 'We follow cause-and-effect: empires rising, magic breaking, and the scars left behind.',
              accent: 'text-candle-200',
              ring: 'border-candle-500/30 bg-candle-500/10',
            },
            {
              icon: BookOpenText,
              title: 'Show notes & reading lists',
              body: 'Each episode gets an entry in the archive: summaries, names, and optional references.',
              accent: 'text-mana-200',
              ring: 'border-mana-500/30 bg-mana-500/10',
            },
            {
              icon: Headphones,
              title: 'Listen anywhere',
              body: 'Use the Episodes page for embeds, or open a direct Spotify link when you’re on the move.',
              accent: 'text-wraith-200',
              ring: 'border-wraith-500/30 bg-wraith-500/10',
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.08 }}
              className="card-glow p-6"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.ring} mb-4`}
              >
                <card.icon className={`w-6 h-6 ${card.accent}`} />
              </div>
              <h2 className="text-xl font-display font-semibold text-bone-50 mb-2">
                {card.title}
              </h2>
              <p className="text-ink-200 leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.section
          id="meet-the-host"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.06 }}
          className="mt-14"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mana-500/10 border border-mana-500/30 mb-6">
              <UserRound className="w-4 h-4 text-mana-300" />
              <span className="text-mana-200 text-sm tracking-wide">
                Meet The Host
              </span>
            </div>
            <h2 className="section-heading mb-4">Meet The Host</h2>
            <p className="text-ink-200 max-w-2xl mx-auto text-lg">
              A profile of {siteInfo.host.name} — and the vow that bound him to
              undeath so the archive could endure.
            </p>
          </div>

          <div className="gradient-border">
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <div className="md:col-span-2">
                  <div className="card-glow p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-candle-500/80 via-mana-500/70 to-wraith-500/60 border border-ink-800 flex items-center justify-center shadow-lg shadow-mana-500/20">
                        <span className="font-display font-bold text-ink-950 tracking-wide">
                          EC
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-display font-semibold text-bone-50 leading-tight">
                          {siteInfo.host.name}
                        </h3>
                        <p className="text-sm text-mana-200 mt-1">
                          {siteInfo.host.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <p className="text-ink-200 leading-relaxed">
                        {siteInfo.host.profile}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="card-glow p-6 md:p-7">
                    <h3 className="text-xl font-display font-semibold text-bone-50 mb-3">
                      History
                    </h3>
                    <div className="space-y-4 text-ink-200 leading-relaxed">
                      {siteInfo.host.history.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="disclaimer"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.08 }}
          className="mt-14"
        >
          <div className="card-glow p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-bone-50 mb-4">
              Disclaimer
            </h2>
            <div className="text-ink-200 leading-relaxed space-y-2">
              {siteInfo.disclaimerLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;

