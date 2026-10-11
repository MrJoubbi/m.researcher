import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { AddArticleModal } from './components/AddArticleModal';
import { ImportCodeModal } from './components/ImportCodeModal';
import { Footer } from './components/Footer';
import { Article, ArticleCategory } from './types/article';
import { INITIAL_ARTICLES } from './data/initialArticles';
import { Plus, Search, Filter, SlidersHorizontal, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES: ArticleCategory[] = [
  'Artisanat & Crafts',
  'Gastronomy & Cuisine',
  'Riads & Travel',
  'History & Heritage',
  'Culture & Traditions',
  'Architecture & Design',
];

const STORAGE_KEY = 'moroccan_website_articles_v1';
const LIKES_KEY = 'moroccan_website_liked_ids_v1';

export default function App() {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading articles from localStorage:', e);
    }
    return INITIAL_ARTICLES;
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading liked IDs:', e);
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'short'>('recent');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Success toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync articles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      console.error('Failed to save articles to localStorage', e);
    }
  }, [articles]);

  // Sync likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likedIds));
    } catch (e) {
      console.error('Failed to save likes to localStorage', e);
    }
  }, [likedIds]);

  const handleOpenAddModal = () => {
    setArticleToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setArticleToEdit(article);
    if (readingArticle) {
      setReadingArticle(null);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveArticle = (savedArticle: Article) => {
    if (articleToEdit) {
      // Update
      setArticles((prev) =>
        prev.map((item) => (item.id === savedArticle.id ? savedArticle : item))
      );
      showToast(`Article "${savedArticle.title}" updated successfully!`);
    } else {
      // Add new
      setArticles((prev) => [savedArticle, ...prev]);
      showToast(`New article "${savedArticle.title}" published to website!`);
    }
  };

  const handleDeleteArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (readingArticle?.id === id) {
      setReadingArticle(null);
    }
    showToast(`Article "${target?.title || ''}" removed.`);
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedIds.includes(id);
    if (isLiked) {
      setLikedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setLikedIds((prev) => [...prev, id]);
    }
  };

  const handleImportArticles = (imported: Article[]) => {
    setArticles((prev) => [...imported, ...prev]);
    showToast(`Imported ${imported.length} articles into the website!`);
  };

  // Filter & Sort Logic
  const filteredArticles = articles
    .filter((art) => {
      // Category filter
      if (selectedCategory !== 'all' && art.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query);
        const matchesExcerpt = art.excerpt.toLowerCase().includes(query);
        const matchesContent = art.content.toLowerCase().includes(query);
        const matchesTags = art.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthor = art.author.name.toLowerCase().includes(query);
        const matchesArabic = art.arabicTitle?.toLowerCase().includes(query);
        return matchesTitle || matchesExcerpt || matchesContent || matchesTags || matchesAuthor || matchesArabic;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        const aLikes = a.likes + (likedIds.includes(a.id) ? 1 : 0);
        const bLikes = b.likes + (likedIds.includes(b.id) ? 1 : 0);
        return bLikes - aLikes;
      }
      if (sortBy === 'short') {
        const aMin = parseInt(a.readTime, 10) || 5;
        const bMin = parseInt(b.readTime, 10) || 5;
        return aMin - bMin;
      }
      // Default: recent (newly added first)
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292524] selection:bg-[#C85A32]/20 selection:text-[#C85A32]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 bg-[#2C1810] text-white rounded-xl shadow-2xl border border-[#D4AF37]/40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalArticles={articles.length}
      />

      {/* Hero Section */}
      <Hero
        onOpenAddModal={handleOpenAddModal}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={CATEGORIES}
      />

      {/* Main Content Area */}
      <main id="articles-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Controls Bar: Section Title, Search, Category Selector, Add Article Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-moroccan text-lg font-bold text-[#C85A32]">مقالات</span>
              <span className="text-[#C85A32]">•</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1810]">
                Articles & Stories
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
              Showing {filteredArticles.length} of {articles.length} articles
              {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input for Mobile/Tablet */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#A89F91] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-white border border-[#E0D7C4] rounded-xl px-2.5 py-1.5 text-xs text-[#5C4D3C]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85A32]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-xs text-[#2C1810] font-medium cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Liked</option>
                <option value="short">Shortest Read</option>
              </select>
            </div>

            {/* Prominent Add Article Button in Section Header */}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#C85A32]/20 hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Article</span>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll / Filter Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#2C1810] text-white shadow-sm'
                : 'bg-white text-[#786C5E] hover:text-[#2C1810] border border-[#E6DEC8]'
            }`}
          >
            All Categories ({articles.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'bg-white text-[#786C5E] hover:text-[#2C1810] border border-[#E6DEC8]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={(art) => setReadingArticle(art)}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteArticle}
                onToggleLike={handleToggleLike}
                isLiked={likedIds.includes(article.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#E6DEC8] space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C85A32] border border-[#E6DEC8]">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-display text-[#2C1810]">No articles found</h3>
              <p className="text-xs sm:text-sm text-[#786C5E] max-w-md mx-auto">
                No stories match your current search "{searchTerm}" or selected category.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 text-xs font-medium text-[#786C5E] hover:text-[#2C1810] bg-[#FAF7F2] rounded-lg border border-[#E6DEC8]"
              >
                Clear Filters
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
              >
                + Add New Article
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAddModal={handleOpenAddModal}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      {/* Add / Edit Article Modal Dialog */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setArticleToEdit(null);
        }}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
        categories={CATEGORIES}
      />

      {/* Read Article Full View Modal */}
      <ArticleModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
        onEdit={handleOpenEditModal}
        onToggleLike={handleToggleLike}
        isLiked={readingArticle ? likedIds.includes(readingArticle.id) : false}
      />

      {/* Import / Paste Zip Code Modal */}
      <ImportCodeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        articles={articles}
        onImportArticles={handleImportArticles}
      />
    </div>
  );
}
