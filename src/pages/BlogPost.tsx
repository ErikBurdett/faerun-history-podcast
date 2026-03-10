import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpenText } from 'lucide-react';
import { blogPosts } from '../data/podcastData';

const URL_RE = /(https?:\/\/[^\s]+)/g;

function renderTextWithLinks(text: string) {
  const parts = text.split(URL_RE);

  return parts.map((part, idx) => {
    if (!part.startsWith('http://') && !part.startsWith('https://')) {
      return <span key={idx}>{part}</span>;
    }

    let url = part;
    let trailing = '';
    while (/[),.;!?]$/.test(url)) {
      trailing = url.slice(-1) + trailing;
      url = url.slice(0, -1);
    }

    return (
      <span key={idx}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-candle-200 hover:text-candle-100 underline underline-offset-4"
        >
          {url}
        </a>
        {trailing}
      </span>
    );
  });
}

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-glow p-8">
            <h1 className="text-2xl font-display font-semibold text-bone-50 mb-3">
              Page not found
            </h1>
            <p className="text-ink-200 mb-6">
              That entry isn’t in the archive. Try the index instead.
            </p>
            <Link to="/blog" className="btn btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/blog" className="inline-flex items-center text-ink-200 hover:text-candle-200 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </motion.div>

        <article className="card-glow p-7 md:p-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-mana-500/10 border border-mana-500/30 flex items-center justify-center">
              <BookOpenText className="w-5 h-5 text-mana-300" />
            </div>
            <div>
              <p className="text-xs text-ink-300">{post.publishedDateLabel}</p>
              <p className="text-xs text-ink-300">
                {post.tags.join(' · ')}
              </p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-bone-50 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-ink-200 text-lg leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="space-y-6">
            {post.content.map((block, idx) => {
              if (block.type === 'h2') {
                return (
                  <h2
                    key={idx}
                    className="text-2xl md:text-3xl font-display font-semibold text-bone-50"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'ul') {
                return (
                  <ul
                    key={idx}
                    className="space-y-2 pl-5 list-disc text-ink-200"
                  >
                    {block.items.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {renderTextWithLinks(item)}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-ink-200 leading-relaxed">
                  {renderTextWithLinks(block.text)}
                </p>
              );
            })}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;

