import React, { useState, useEffect } from 'react';
import { X, Image, Sparkles, Plus, Trash2, Check, AlertCircle, Wand2 } from 'lucide-react';
import { Article, ArticleCategory } from '../types/article';
import { IMAGE_PRESETS } from '../data/initialArticles';

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  articleToEdit?: Article | null;
  categories: ArticleCategory[];
}

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>(categories[0]);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(IMAGE_PRESETS[0].url);
  const [authorName, setAuthorName] = useState('Abdellah Jobi');
  const [authorRole, setAuthorRole] = useState('Moroccan Culture Contributor');
  const [readTime, setReadTime] = useState('5 min read');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Morocco', 'Artisanat']);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync state when articleToEdit changes
  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setArabicTitle(articleToEdit.arabicTitle || '');
      setCategory(articleToEdit.category);
      setExcerpt(articleToEdit.excerpt);
      setContent(articleToEdit.content);
      setCoverImage(articleToEdit.coverImage);
      setAuthorName(articleToEdit.author.name);
      setAuthorRole(articleToEdit.author.role);
      setReadTime(articleToEdit.readTime);
      setTags(articleToEdit.tags);
    } else {
      // Default reset
      setTitle('');
      setArabicTitle('');
      setCategory(categories[0]);
      setExcerpt('');
      setContent('');
      setCoverImage(IMAGE_PRESETS[0].url);
      setAuthorName('Abdellah Jobi');
      setAuthorRole('Moroccan Culture Contributor');
      setReadTime('5 min read');
      setTags(['Morocco', 'Artisanat']);
    }
    setErrorMessage('');
  }, [articleToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide an article title.');
      return;
    }
    if (!content.trim() && !excerpt.trim()) {
      setErrorMessage('Please provide article content or an excerpt.');
      return;
    }

    const finalExcerpt = excerpt.trim() || content.trim().slice(0, 150) + '...';

    const newArticle: Article = {
      id: articleToEdit ? articleToEdit.id : `art-${Date.now()}`,
      title: title.trim(),
      arabicTitle: arabicTitle.trim() || undefined,
      category,
      excerpt: finalExcerpt,
      content: content.trim() || finalExcerpt,
      coverImage: coverImage.trim() || IMAGE_PRESETS[0].url,
      author: {
        name: authorName.trim() || 'Contributor',
        role: authorRole.trim() || 'Moroccan Cultural Writer',
        avatar: articleToEdit?.author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authorName)}&backgroundColor=c85a32,2c1810`,
      },
      publishedAt: articleToEdit ? articleToEdit.publishedAt : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime,
      tags: tags.length > 0 ? tags : ['Morocco'],
      likes: articleToEdit ? articleToEdit.likes : 0,
      featured: articleToEdit ? articleToEdit.featured : false,
    };

    onSave(newArticle);
    onClose();
  };

  // Quick fill demo sample
  const handleFillSample = () => {
    setTitle('The Secrets of Argan Oil: Liquid Gold from the Souss Valley');
    setArabicTitle('أسرار زيت الأركان المغربي في سوس');
    setCategory('Artisanat & Crafts');
    setExcerpt('Deep in south-western Morocco, women-led cooperatives harvest the rare fruit of the Argania Spinosa tree, pressing cold-pressed golden elixir celebrated worldwide.');
    setContent(`### An Ancient Moroccan Tree
Endemic strictly to the semi-arid valleys of southwestern Morocco between Essaouira, Agadir, and Taroudant, the Argan tree is a UNESCO-protected biosphere treasure that resists the encroachment of the Sahara desert.

### The Women Cooperatives of the Souss
For generations, Amazigh (Berber) women have gathered fallen argan nuts, cracked their stony shells between river stones with incredible dexterity, and stone-ground the roasted kernels for culinary delicacy or unroasted kernels for restorative cosmetics.

> "Liquid gold is not merely an export; it supports thousands of rural Amazigh families and keeps centuries-old heritage alive."

### Culinary vs Cosmetic Argan
- **Culinary Argan**: Toasted beforehand, exuding a distinct nutty aroma of hazelnut and sesame. Mixed with almonds and raw honey to create traditional Moroccan *Amlou*.
- **Cosmetic Argan**: Cold-pressed unroasted kernels rich in vitamin E, linoleic acid, and squalene for skin rejuvenation.`);
    setCoverImage(IMAGE_PRESETS[3].url);
    setTags(['Argan', 'Souss', 'Cooperatives', 'Amazigh', 'Artisanat']);
    setReadTime('4 min read');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E6DEC8] w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DEC8] bg-[#FAF7F2]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C85A32] flex items-center justify-center text-white shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-[#2C1810]">
                {articleToEdit ? 'Edit Article' : 'Publish New Moroccan Article'}
              </h2>
              <p className="text-xs text-[#786C5E]">
                Fill out the details below to publish your story to the live website
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!articleToEdit && (
              <button
                type="button"
                onClick={handleFillSample}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#C85A32] bg-[#C85A32]/10 hover:bg-[#C85A32]/20 rounded-lg transition-colors border border-[#C85A32]/20 cursor-pointer"
                title="Fill with example Moroccan article"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-fill Sample</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#786C5E] hover:text-[#2C1810] hover:bg-[#EFE8DC] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title and Arabic Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Article Title <span className="text-[#C85A32]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Living Geometry of Moroccan Zellige..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Arabic / Subtitle (Optional)
              </label>
              <input
                type="text"
                dir="rtl"
                value={arabicTitle}
                onChange={(e) => setArabicTitle(e.target.value)}
                placeholder="عنوان بالعربية أو بالفرنسية"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810] font-serif-moroccan"
              />
            </div>
          </div>

          {/* Category & Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Estimated Read Time
              </label>
              <select
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
              >
                <option value="3 min read">3 min read</option>
                <option value="4 min read">4 min read</option>
                <option value="5 min read">5 min read</option>
                <option value="7 min read">7 min read</option>
                <option value="10 min read">10 min read</option>
              </select>
            </div>
          </div>

          {/* Cover Image Selection: Presets or Custom URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Cover Photo
              </label>
              <span className="text-xs text-[#786C5E]">Select a Moroccan photo preset or paste URL</span>
            </div>

            {/* Presets Gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {IMAGE_PRESETS.map((preset, idx) => {
                const isSelected = coverImage === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden h-20 text-left border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-[#C85A32] ring-2 ring-[#C85A32]/30 shadow-sm'
                        : 'border-[#E0D7C4] opacity-80 hover:opacity-100 hover:border-[#C85A32]/50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 flex flex-col justify-end">
                      <span className="text-[11px] font-semibold text-white leading-tight truncate">
                        {preset.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#C85A32] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Image URL field */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="relative flex-1">
                <Image className="w-4 h-4 text-[#A89F91] absolute left-3 top-3" />
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image URL: https://..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0D7C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
                />
              </div>
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
              Short Summary / Excerpt
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief 1-2 sentence hook for the article card preview..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810] resize-none"
            />
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Full Article Content <span className="text-[#C85A32]">*</span>
              </label>
              <span className="text-[11px] text-[#A89F91]">Supports markdown headers (###) and quotes (&gt;)</span>
            </div>
            <textarea
              rows={6}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full story, Moroccan traditions, recipes, history, or cultural insights..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810] leading-relaxed font-sans"
            />
          </div>

          {/* Author info & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Author Name & Title
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author Name"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0D7C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
                />
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="Role (e.g. Writer)"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E0D7C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
                />
              </div>
            </div>

            {/* Tags input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                Tags & Topics
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag & press Enter..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#E0D7C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] text-[#2C1810]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 text-xs bg-[#EFE8DC] hover:bg-[#E6DEC8] text-[#5C4D3C] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
              {/* Tag pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] bg-[#C85A32]/10 text-[#C85A32] font-medium border border-[#C85A32]/20"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-700 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-4 border-t border-[#E6DEC8] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-[#786C5E] hover:text-[#2C1810] hover:bg-[#EFE8DC] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#C85A32] to-[#B3451F] hover:from-[#B3451F] hover:to-[#963515] text-white rounded-xl shadow-md shadow-[#C85A32]/25 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              {articleToEdit ? 'Save Changes' : 'Publish Article Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
