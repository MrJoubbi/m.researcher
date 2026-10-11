import React, { useState } from 'react';
import { X, Clock, Calendar, Heart, Share2, Edit3, Bookmark, Check, Sparkles, User, Tag, Printer } from 'lucide-react';
import { Article } from '../types/article';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onEdit: (article: Article) => void;
  onToggleLike: (id: string) => void;
  isLiked?: boolean;
  isAdmin?: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onEdit,
  onToggleLike,
  isLiked = false,
  isAdmin = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const printArticle = () => {
    window.print();
  };

  // Simple rich text renderer for content with headers and quotes
  const renderFormattedContent = (rawText: string) => {
    const paragraphs = rawText.split('\n\n');
    return paragraphs.map((block, i) => {
      const trimmed = block.trim();

      // Check for markdown image or data URL image embedded in text
      if (trimmed.startsWith('![')) {
        const match = trimmed.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, alt, url] = match;
          return (
            <div key={i} className="my-6 space-y-1.5">
              <div className="rounded-2xl overflow-hidden shadow-md border border-[#E6DEC8] max-h-[500px] bg-[#2C1810]/5">
                <img src={url} alt={alt || 'Article image'} className="w-full h-full object-cover max-h-[500px]" />
              </div>
              {alt && alt !== 'Article image' && (
                <p className="text-center text-xs text-[#786C5E] italic">{alt}</p>
              )}
            </div>
          );
        }
      }

      // Check for standalone base64 or image url
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
        return (
          <div key={i} className="my-6">
            <div className="rounded-2xl overflow-hidden shadow-md border border-[#E6DEC8] max-h-[500px] bg-[#2C1810]/5">
              <img src={trimmed} alt="Embedded article image" className="w-full h-full object-cover max-h-[500px]" />
            </div>
          </div>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={i} className="text-xl sm:text-2xl font-bold font-display text-[#2C1810] mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={i} className="text-2xl sm:text-3xl font-bold font-display text-[#2C1810] mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="my-5 pl-5 border-l-4 border-[#C85A32] italic text-[#5C4D3C] bg-[#FAF7F2] py-3.5 pr-4 rounded-r-xl text-base sm:text-lg leading-relaxed shadow-sm">
            {trimmed.replace('> ', '').replace(/^["']|["']$/g, '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map((item) => item.replace(/^[-\*]\s+/, ''));
        return (
          <ul key={i} className="list-disc list-inside space-y-2 my-4 pl-2 text-[#4A3E31] leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx} className="text-sm sm:text-base">
                {item}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={i} className="text-sm sm:text-base text-[#4A3E31] leading-relaxed my-4">
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
      <div className="relative bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E6DEC8] w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Sticky Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DEC8] bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/20">
              {article.category}
            </span>
            <span className="text-xs text-[#786C5E] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Print PDF Button */}
            <button
              onClick={printArticle}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#2C1810] bg-white border border-[#E0D7C4] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Imprimer PDF / Print article with logo"
            >
              <Printer className="w-4 h-4 text-[#C85A32]" />
              <span className="hidden sm:inline">Imprimer PDF</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#5C4D3C] hover:text-[#2C1810] bg-white border border-[#E0D7C4] rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Share article link"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#C85A32]" />}
              <span className="hidden sm:inline">{copied ? 'Copied Link!' : 'Share'}</span>
            </button>

            {/* Like Button */}
            <button
              onClick={() => onToggleLike(article.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                isLiked 
                  ? 'bg-[#C85A32] text-white border-[#C85A32]' 
                  : 'bg-white text-[#786C5E] border-[#E0D7C4] hover:text-[#C85A32]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{article.likes + (isLiked ? 1 : 0)}</span>
            </button>

            {/* Edit Button (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(article);
                }}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-[#2C1810] bg-[#EFE8DC] hover:bg-[#E6DEC8] rounded-lg transition-colors border border-[#DDD3C0] cursor-pointer"
                title="Edit article"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#C85A32]" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-[#786C5E] hover:text-[#2C1810] hover:bg-[#EFE8DC] rounded-xl transition-colors cursor-pointer ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 space-y-8">
          
          {/* Printable Header with Logo (shows on print) */}
          <div className="hidden print:flex items-center space-x-3 mb-6 pb-4 border-b border-[#2C1810]">
            <div className="w-10 h-10 rounded-xl bg-[#C85A32] flex items-center justify-center text-white font-bold text-xl">
              م
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#2C1810]">MOROCCO MAG • Heritage Hub</h2>
              <p className="text-xs text-[#786C5E]">Official Publication &amp; Article Export</p>
            </div>
          </div>

          {/* Article Header Info */}
          <div className="space-y-4 max-w-3xl mx-auto text-center">
            {article.arabicTitle && (
              <p className="text-sm sm:text-base font-serif-moroccan font-bold text-[#C85A32] tracking-wider" dir="rtl">
                {article.arabicTitle}
              </p>
            )}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#2C1810] leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-[#6B5E4F] font-normal leading-relaxed max-w-2xl mx-auto">
              {article.excerpt}
            </p>

            {/* Author Meta Row */}
            <div className="pt-4 flex items-center justify-center space-x-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C85A32]/30 shadow-sm"
              />
              <div className="text-left">
                <p className="text-sm font-bold text-[#2C1810]">{article.author.name}</p>
                <p className="text-xs text-[#786C5E]">{article.author.role} • {article.publishedAt}</p>
              </div>
            </div>
          </div>

          {/* Cover Image Banner */}
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-[#E6DEC8] aspect-[16/9] max-h-[500px] bg-[#2C1810]/5">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main Formatted Article Content */}
          <div className="max-w-3xl mx-auto pb-12">
            <div className="prose prose-stone max-w-none text-[#2C1810] font-sans">
              {renderFormattedContent(article.content)}
            </div>

            {/* Tags footer */}
            <div className="pt-8 mt-12 border-t border-[#E6DEC8] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#786C5E] uppercase tracking-wider mr-2">Topics:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-white text-[#5C4D3C] border border-[#E6DEC8] shadow-sm"
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
