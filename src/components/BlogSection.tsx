import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface BlogSectionProps {
  onOpenMaintenanceModal: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenMaintenanceModal }) => {
  const { t } = useLanguage();

  const posts = [
    {
      id: 1,
      title: t.blog.article1Title,
      excerpt: t.blog.article1Desc,
      category: t.blog.article1Tag,
      date: 'Oct 02, 2026',
      readTime: '4 min read',
      image:
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 2,
      title: t.blog.article2Title,
      excerpt: t.blog.article2Desc,
      category: t.blog.article2Tag,
      date: 'Sep 28, 2026',
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 3,
      title: t.blog.article3Title,
      excerpt: t.blog.article3Desc,
      category: t.blog.article3Tag,
      date: 'Sep 21, 2026',
      readTime: '5 min read',
      image:
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider">
              {t.blog.kicker}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t.blog.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
              {t.blog.subtitle}
            </p>
          </div>
          <button
            onClick={onOpenMaintenanceModal}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F4C81] hover:text-[#0A3357] transition-colors cursor-pointer group shrink-0"
          >
            <span>{t.departments.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#0F4C81] shadow-xs">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0F4C81] transition-colors mb-2.5 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={onOpenMaintenanceModal}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0F4C81] hover:text-[#0A3357] transition-colors cursor-pointer"
                >
                  <span>{t.blog.readArticle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
