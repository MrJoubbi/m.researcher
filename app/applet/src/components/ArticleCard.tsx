import React from 'react';
import { Clock, Heart, Edit3, Trash2, ArrowRight, Bookmark, Sparkles } from 'lucide-react';
import { Article } from '../types/article';

interface ArticleCardProps {
  article: Article;
  onRead: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleLike: (id: string) => void;
  isLiked?: boolean;
  isAdmin?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onRead,
  onEdit,
  onDelete,
  onToggleLike,
  isLiked = false,
  isAdmin = false,
}) => {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#E6DEC8] shadow-sm hover:shadow-xl hover:border-[#C85A32]/40 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#2C1810]/5 cursor-pointer" onClick={() => onRead(article)}>
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#2C1810] shadow-sm backdrop-blur-sm border border-white/40">
            {article.category}
          </span>
          {article.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D4AF37] text-[#2C1810] shadow-sm flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#2C1810]" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {/* Read Time on Image bottom right */}
        <div className="absolute bottom-3 right-3 text-[11px] font-medium text-white/90 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center space-x-1">
          <Clock className="w-3 h-3 text-[#D4AF37]" />
          <span>{article.readTime}</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Arabic Title if provided */}
          {article.arabicTitle && (
            <p className="text-xs font-serif-moroccan font-bold text-[#C85A32] tracking-wide" dir="rtl">
              {article.arabicTitle}
            </p>
          )}

          {/* Main Title */}
          <h3
            onClick={() => onRead(article)}
            className="text-lg sm:text-xl font-bold font-display text-[#2C1810] group-hover:text-[#C85A32] transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-[#6B5E4F] line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-[#786C5E] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#E6DEC8]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info: Author, date, actions */}
        <div className="pt-5 mt-5 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
          {/* Author avatar & info */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-8 h-8 rounded-full object-cover border border-[#E6DEC8] shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#2C1810] truncate">
                {article.author.name}
              </p>
              <p className="text-[11px] text-[#8C7E6D] truncate">
                {article.publishedAt}
              </p>
            </div>
          </div>

          {/* Card Action buttons */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* Like button */}
            <button
              onClick={() => onToggleLike(article.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-xs ${
                isLiked
                  ? 'text-[#C85A32] bg-[#C85A32]/10'
                  : 'text-[#8C7E6D] hover:text-[#C85A32] hover:bg-[#FAF7F2]'
              }`}
              title="Like article"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-semibold text-[11px]">{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            {/* Edit & Delete buttons (Admin Only) */}
            {isAdmin && (
              <>
                <button
                  onClick={() => onEdit(article)}
                  className="p-1.5 text-[#8C7E6D] hover:text-[#2C1810] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                  title="Edit article"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
                      onDelete(article.id);
                    }
                  }}
                  className="p-1.5 text-[#8C7E6D] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Read full arrow */}
            <button
              onClick={() => onRead(article)}
              className="p-1.5 text-[#C85A32] hover:bg-[#C85A32]/10 rounded-lg transition-colors cursor-pointer ml-1"
              title="Read full article"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
