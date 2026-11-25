import ArchiveHeading from '../components/ArchiveHeading';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { blogPosts } from '../data/podcastData';

const Blog = () => {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ArchiveHeading title="The Scribe’s Desk" art="cartography">
          Episode notes, reading lists, and small relics from the stacks.
        </ArchiveHeading>

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

