import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpenText, Tag } from 'lucide-react';
import { blogPosts } from '../data/podcastData';

const Blog = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-candle-500/10 border border-candle-500/30 mb-6">
            <BookOpenText className="w-4 h-4 text-candle-300" />
            <span className="text-candle-200 text-sm tracking-wide">
              Blog & Show Notes
            </span>
          </div>
          <h1 className="section-heading mb-4">The Scribe’s Desk</h1>
          <p className="text-ink-200 max-w-2xl mx-auto text-lg">
            Episode notes, reading lists, and small relics from the stacks.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: Math.min(index * 0.08, 0.3) }}
              className="card-glow p-6 hover-lift"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <p className="text-xs text-ink-300">{post.publishedDateLabel}</p>
                <div className="inline-flex items-center gap-2 text-xs text-ink-300">
                  <Tag className="w-3.5 h-3.5 text-mana-300" />
                  <span className="truncate">
                    {post.tags.slice(0, 2).join(' · ')}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-display font-semibold text-bone-50 mb-2">
                <Link
                  to={`/blog/${post.slug}`}
                  className="hover:text-candle-200 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-ink-200 leading-relaxed">{post.excerpt}</p>

              <div className="mt-5">
                <Link to={`/blog/${post.slug}`} className="btn btn-outline">
                  Read
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

