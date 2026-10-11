import React, { useState } from 'react';
import { X, Clock, Calendar, Heart, Share2, Edit3, Bookmark, Check, Sparkles, User, Tag } from 'lucide-react';
import { Article } from '../types/article';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onEdit: (article: Article) => void;
  onToggleLike: (id: string) => void;
  isLiked?: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onEdit,
  onToggleLike,
  isLiked = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Simple rich text renderer for content with headers and quotes
  const renderFormattedContent = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} className="text-xl sm:text-2xl font-bold font-display text-[#2C1810] mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="my-5 pl-4 border-l-4 border-[#C85A32] italic text-[#5C4D3C] text-base sm:text-lg bg-[#F7F2E9] py-3 pr-4 rounded-r-xl">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(Boolean);
        return (
          <ul key={i} className="list-disc list-inside space-y-1.5 my-3 text-[#4A3E31] leading-relaxed">
            {items.map((it, idx) => (
              <li key={idx}>{it.replace(/^-\s*/, '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={i} className="text-base sm:text-lg text-[#3E342B] leading-relaxed my-3 font-normal">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E6DEC8] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
          <button
            onClick={() => onEdit(article)}
            className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
            title="Edit article"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
            title="Share article link"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-[#2C1810]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-transparent to-black/40" />
            
            {/* Category tag */}
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C85A32] text-white shadow-md">
                {article.category}
              </span>
            </div>
          </div>

          <div className="px-6 sm:px-12 pb-12 -mt-12 relative z-10 space-y-6">
            {/* Arabic title if present */}
            {article.arabicTitle && (
              <p className="text-xl sm:text-2xl font-serif-moroccan font-bold text-[#C85A32] tracking-wide" dir="rtl">
                {article.arabicTitle}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#2C1810] leading-tight">
              {article.title}
            </h1>

            {/* Meta Row: Author, Date, Read time, Like */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E6DEC8]/80">
              <div className="flex items-center space-x-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C85A32]/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#2C1810]">{article.author.name}</h4>
                  <p className="text-xs text-[#786C5E]">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-[#786C5E]">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#C85A32]" />
                  <span>{article.publishedAt}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#C85A32]" />
                  <span>{article.readTime}</span>
                </div>
                <button
                  onClick={() => onToggleLike(article.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isLiked
                      ? 'bg-[#C85A32] text-white'
                      : 'bg-[#EFE8DC] text-[#5C4D3C] hover:bg-[#E6DEC8]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{article.likes + (isLiked ? 1 : 0)} Likes</span>
                </button>
              </div>
            </div>

            {/* Excerpt Lead */}
            <p className="text-lg sm:text-xl font-medium text-[#5C4D3C] italic leading-relaxed border-l-2 border-[#D4AF37] pl-4">
              "{article.excerpt}"
            </p>

            {/* Main Article Body */}
            <div className="prose prose-stone max-w-none pt-2">
              {renderFormattedContent(article.content)}
            </div>

            {/* Tags section */}
            <div className="pt-6 border-t border-[#E6DEC8] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#786C5E] uppercase tracking-wider flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Tags:</span>
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#EFE8DC] text-[#5C4D3C] border border-[#DDD3C0]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
