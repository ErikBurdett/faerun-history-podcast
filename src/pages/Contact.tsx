import { motion } from 'framer-motion';
import { Globe, Headphones, Mail, ScrollText, Youtube } from 'lucide-react';
import { siteInfo } from '../data/podcastData';

const Contact = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mana-500/10 border border-mana-500/30 mb-6"
          >
            <Mail className="w-4 h-4 text-mana-300" />
            <span className="text-mana-200 text-sm tracking-wide">
              Contact the Archive
            </span>
          </motion.div>
          <h1 className="section-heading mb-4">Contact</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            Requests, corrections, guest ideas, and lore rabbit holes welcome.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: 'Official site',
              body: 'taleofthelich.com',
              href: siteInfo.externalLinks.officialSite,
              accent: 'text-wraith-200',
              ring: 'border-wraith-500/30 bg-wraith-500/10',
            },
            {
              icon: Mail,
              title: 'Email',
              body: siteInfo.contactEmail,
              href: `mailto:${siteInfo.contactEmail}`,
              accent: 'text-mana-200',
              ring: 'border-mana-500/30 bg-mana-500/10',
            },
            {
              icon: Headphones,
              title: 'Listen',
              body: 'Open the show on Spotify',
              href: siteInfo.externalLinks.spotifyShow,
              accent: 'text-candle-200',
              ring: 'border-candle-500/30 bg-candle-500/10',
            },
            {
              icon: Youtube,
              title: 'YouTube',
              body: 'Watch new uploads',
              href: siteInfo.externalLinks.youtubeChannel,
              accent: 'text-ember-200',
              ring: 'border-ember-500/30 bg-ember-500/10',
            },
            {
              icon: ScrollText,
              title: 'Show notes',
              body: 'Read the blog & archive',
              href: '/blog',
              accent: 'text-wraith-200',
              ring: 'border-wraith-500/30 bg-wraith-500/10',
            },
          ].map((card, idx) => (
            <motion.a
              key={card.title}
              href={card.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.08 }}
              className="card-glow p-6 block hover-lift"
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
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;

