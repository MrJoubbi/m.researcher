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
import { Plus, Search, Filter, SlidersHorizontal, BookOpen, Sparkles, CheckCircle2, GraduationCap, Briefcase, Mail, ArrowRight } from 'lucide-react';

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
const ADMIN_KEY = 'moroccan_website_admin_v1';

export function getArticleSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'formations' | 'services' | 'contact'>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/blog')) return 'blog';
    if (path.includes('/formation')) return 'formations';
    if (path.includes('/services') || path.includes('/nos')) return 'services';
    if (path.includes('/contact')) return 'contact';
    return 'home';
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

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.setItem(ADMIN_KEY, 'false');
      showToast('Admin mode locked. Website is secure.');
    } else {
      const pwd = window.prompt('Enter admin password to unlock authoring (hint: admin):');
      if (pwd === 'admin' || pwd === 'morocco2026') {
        setIsAdmin(true);
        localStorage.setItem(ADMIN_KEY, 'true');
        showToast('Admin mode unlocked successfully!');
      } else if (pwd !== null) {
        showToast('Incorrect password.');
      }
    }
  };

  const navigateTo = (view: 'home' | 'blog' | 'formations' | 'services' | 'contact', path: string) => {
    setCurrentView(view);
    setReadingArticle(null);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch articles from API server on mount, sync with localStorage
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        }
      })
      .catch((err) => console.log('Using local/initial articles storage', err));
  }, []);

  // Handle URL route (pathname or hash) on load and popstate/hashchange
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const lowerPath = path.toLowerCase();
      const hash = window.location.hash;

      let slug = '';
      if (lowerPath.startsWith('/blog/')) {
        slug = path.replace(/^\/blog\//i, '').replace(/^\//, '');
      } else if (hash.startsWith('#article/')) {
        slug = hash.replace('#article/', '');
      } else if (hash.startsWith('#blog/')) {
        slug = hash.replace('#blog/', '');
      }

      if (slug) {
        const found = articles.find((a) => getArticleSlug(a.title) === slug || a.id === slug);
        if (found) {
          setReadingArticle(found);
          setCurrentView('blog');
          return;
        }
      }

      if (lowerPath === '/blog' || hash === '#blog') {
        setCurrentView('blog');
      } else if (lowerPath.includes('/formation')) {
        setCurrentView('formations');
      } else if (lowerPath.includes('/services') || lowerPath.includes('/nos')) {
        setCurrentView('services');
      } else if (lowerPath.includes('/contact')) {
        setCurrentView('contact');
      } else if (lowerPath === '/' || lowerPath === '') {
        setCurrentView('home');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, [articles]);

  // Sync readingArticle selection with clean URL path (/blog/slug)
  useEffect(() => {
    if (readingArticle) {
      const slug = getArticleSlug(readingArticle.title);
      const newPath = `/blog/${slug}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    } else {
      if (window.location.pathname.startsWith('/blog/') && currentView === 'blog') {
        window.history.pushState({}, '', '/blog');
      }
    }
  }, [readingArticle, currentView]);

  // Sync articles to localStorage and backend API server
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articles),
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save articles', e);
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
    if (!isAdmin) {
      showToast('Admin access required to publish articles. Please log in via Admin Login.');
      return;
    }
    setArticleToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    if (!isAdmin) {
      showToast('Admin access required to edit articles.');
      return;
    }
    setArticleToEdit(article);
    if (readingArticle) {
      setReadingArticle(null);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveArticle = (savedArticle: Article) => {
    if (articleToEdit) {
      setArticles((prev) =>
        prev.map((item) => (item.id === savedArticle.id ? savedArticle : item))
      );
      showToast(`Article "${savedArticle.title}" updated successfully!`);
      if (readingArticle && readingArticle.id === savedArticle.id) {
        setReadingArticle(savedArticle);
      }
    } else {
      setSelectedCategory('all');
      setSearchTerm('');
      setArticles((prev) => [savedArticle, ...prev]);
      showToast(`New article "${savedArticle.title}" published & displayed on blog!`);
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (!isAdmin) {
      showToast('Admin access required to delete articles.');
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (readingArticle?.id === id) {
      setReadingArticle(null);
    }
    showToast(`Article deleted successfully.`);
  };

  const handleToggleLike = (id: string) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((item) => item !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
  };

  const handleImportArticles = (imported: Article[]) => {
    if (!isAdmin) {
      showToast('Admin access required for import.');
      return;
    }
    setArticles(imported);
    showToast(`Successfully imported ${imported.length} articles!`);
  };

  // Filter & Sort Articles
  const filteredArticles = articles
    .filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.tags.some((t) => t.toLowerCase().includes(term)) ||
        article.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return 0;
      } else if (sortBy === 'popular') {
        const likesA = a.likes + (likedIds.includes(a.id) ? 1 : 0);
        const likesB = b.likes + (likedIds.includes(b.id) ? 1 : 0);
        return likesB - likesA;
      } else if (sortBy === 'short') {
        const timeA = parseInt(a.readTime) || 5;
        const timeB = parseInt(b.readTime) || 5;
        return timeA - timeB;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810] flex flex-col font-sans selection:bg-[#C85A32]/20 selection:text-[#2C1810]">
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
        onOpenImportModal={() => {
          if (!isAdmin) {
            showToast('Admin access required.');
            return;
          }
          setIsImportModalOpen(true);
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalArticles={articles.length}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        currentView={currentView}
        onNavigate={navigateTo}
      />

      {/* ================= HOME VIEW ================= */}
      {currentView === 'home' && (
        <>
          <Hero
            onOpenAddModal={handleOpenAddModal}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo('blog', '/blog');
            }}
            categories={CATEGORIES}
          />

          {/* Quick Intro / Features Strip */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => navigateTo('blog', '/blog')}
                className="bg-white rounded-2xl p-6 border border-[#E6DEC8] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C85A32]/10 flex items-center justify-center text-[#C85A32] group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#2C1810]">Blog & Récits de Recherche</h3>
                <p className="text-xs sm:text-sm text-[#786C5E]">Découvrez nos articles sur l'artisanat, l'histoire, la gastronomie et le patrimoine du Maroc.</p>
                <div className="flex items-center text-xs font-semibold text-[#C85A32] space-x-1 pt-2">
                  <span>Explorer le blog</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => navigateTo('formations', '/Formations')}
                className="bg-white rounded-2xl p-6 border border-[#E6DEC8] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#2C1810]">Formations Académiques</h3>
                <p className="text-xs sm:text-sm text-[#786C5E]">Masterclasses en méthodologie, analyse statistique et rédaction d'articles Scopus.</p>
                <div className="flex items-center text-xs font-semibold text-[#C85A32] space-x-1 pt-2">
                  <span>Voir les formations</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => navigateTo('services', '/Nos Services')}
                className="bg-white rounded-2xl p-6 border border-[#E6DEC8] shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2C1810]/10 flex items-center justify-center text-[#2C1810] group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#2C1810]">Nos Services de Consulting</h3>
                <p className="text-xs sm:text-sm text-[#786C5E]">Accompagnement sur mesure, correction académique et aide à la publication.</p>
                <div className="flex items-center text-xs font-semibold text-[#C85A32] space-x-1 pt-2">
                  <span>Découvrir nos services</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Articles on Home */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC8]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1810]">
                  Derniers Articles & Récits
                </h2>
                <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
                  Sélection récente de nos publications de recherche
                </p>
              </div>
              <button
                onClick={() => navigateTo('blog', '/blog')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#2C1810] border border-[#E6DEC8] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <span>Voir tout le blog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {articles.slice(0, 3).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onRead={(art) => setReadingArticle(art)}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteArticle}
                  onToggleLike={handleToggleLike}
                  isLiked={likedIds.includes(article.id)}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </main>
        </>
      )}

      {/* ================= BLOG VIEW ================= */}
      {currentView === 'blog' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC8]">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1810]">
                  Blog & Récits de Recherche
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#786C5E] mt-0.5">
                Showing {filteredArticles.length} of {articles.length} articles
                {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
              </p>
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3">
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

              {isAdmin && (
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#C85A32]/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Article</span>
                </button>
              )}
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
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          ) : (
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
                {isAdmin && (
                  <button
                    onClick={handleOpenAddModal}
                    className="px-5 py-2 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    + Add New Article
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ================= FORMATIONS VIEW ================= */}
      {currentView === 'formations' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C85A32]/10 text-[#C85A32] rounded-full text-xs font-semibold tracking-wide uppercase border border-[#C85A32]/20">
              <GraduationCap className="w-4 h-4" />
              <span>Formations & Masterclasses Académiques</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#2C1810] tracking-tight">
              Programmes de Formation pour Chercheurs & Doctorants
            </h1>
            <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
              Développez vos compétences méthodologiques, maîtrisez les outils d'analyse de pointe et publiez dans les revues indexées internationales (Scopus, Web of Science).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {[
              {
                title: "Méthodologie de Recherche Avancée",
                desc: "Formulation de problématiques scientifiques robustes, élaboration de cadres conceptuels et méthodologies quantitatives et qualitatives.",
                duration: "4 semaines (12h)",
                level: "Doctorants & Masters",
                icon: "📚"
              },
              {
                title: "Rédaction & Publication d'Articles Scientifiques",
                desc: "Structure IMRAD, techniques de rédaction en anglais/français, choix des revues cibles et gestion des retours des rapporteurs (peer-review).",
                duration: "6 semaines (18h)",
                level: "Chercheurs & Enseignants",
                icon: "✍️"
              },
              {
                title: "Analyse Statistique avec SPSS, R & Python",
                desc: "Traitement des données d'enquêtes, statistiques descriptives et inférentielles, modélisation économétrique et tests d'hypothèses.",
                duration: "5 semaines (15h)",
                level: "Tous Niveaux",
                icon: "📊"
              },
              {
                title: "Gestion de Thèse & Veille Bibliographique",
                desc: "Maîtrise des logiciels de gestion bibliographique (Zotero, Mendeley), revue systématique de littérature et structuration du manuscrit de thèse.",
                duration: "3 semaines (9h)",
                level: "Doctorants",
                icon: "🎓"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#E6DEC8] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-3xl">{f.icon}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#C85A32] border border-[#E6DEC8]">{f.level}</span>
                    <span className="text-xs text-[#786C5E] font-medium">{f.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-[#2C1810]">{f.title}</h3>
                  <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">{f.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#F2EDE2] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#D4AF37]">Certificat de participation inclus</span>
                  <button
                    onClick={() => {
                      showToast(`Demande d'inscription enregistrée pour: ${f.title}`);
                    }}
                    className="px-4 py-2 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================= NOS SERVICES VIEW ================= */}
      {currentView === 'services' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C85A32]/10 text-[#C85A32] rounded-full text-xs font-semibold tracking-wide uppercase border border-[#C85A32]/20">
              <Briefcase className="w-4 h-4" />
              <span>Nos Services Académiques & de Consulting</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#2C1810] tracking-tight">
              Accompagnement Sur Mesure pour vos Projets de Recherche
            </h1>
            <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
              Bénéficiez de l'expertise de chercheurs seniors pour garantir l'excellence et l'impact de vos publications et travaux scientifiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            {[
              {
                title: "Consulting & Cadrage de Recherche",
                desc: "Validation de problématiques, orientation théorique et accompagnement stratégique pour thèses, mémoires et projets de recherche.",
                icon: "💡"
              },
              {
                title: "Correction & Traduction Académique",
                desc: "Révision approfondie en français, anglais et arabe scientifique (orthographe, syntaxe, style académique et normes APA/IEEE).",
                icon: "✒️"
              },
              {
                title: "Analyse Statistique & Économétrique",
                desc: "Traitement de données quantitatives et qualitatives complexes, analyses factorielles, régressions et interprétation des résultats.",
                icon: "📈"
              },
              {
                title: "Accompagnement à la Publication",
                desc: "Sélection rigoureuse des revues indexées (Scopus, Web of Science, Q1-Q4), préparation des lettres de soumission et relecture critique.",
                icon: "🎯"
              },
              {
                title: "Revue de Littérature Systématique",
                desc: "Recherche documentaire approfondie, analyse critique des sources et synthèse bibliographique avec méthodologie PRISMA.",
                icon: "🔎"
              },
              {
                title: "Ateliers & Formations Intra-Universitaires",
                desc: "Organisation de séminaires et masterclasses sur mesure pour universités, laboratoires et centres de recherche au Maroc et à l'international.",
                icon: "🏛️"
              }
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E6DEC8] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-3xl">{s.icon}</div>
                  <h3 className="text-lg font-bold font-display text-[#2C1810]">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-[#786C5E] leading-relaxed">{s.desc}</p>
                </div>
                <div className="pt-4 border-t border-[#F2EDE2]">
                  <button
                    onClick={() => {
                      showToast(`Demande de devis envoyée pour: ${s.title}`);
                    }}
                    className="w-full py-2 bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#2C1810] border border-[#E6DEC8] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Demander un devis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ================= CONTACT VIEW ================= */}
      {currentView === 'contact' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C85A32]/10 text-[#C85A32] rounded-full text-xs font-semibold tracking-wide uppercase border border-[#C85A32]/20">
              <Mail className="w-4 h-4" />
              <span>Contactez l'Équipe</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#2C1810] tracking-tight">
              Parlons de Votre Projet de Recherche
            </h1>
            <p className="text-sm sm:text-base text-[#786C5E] leading-relaxed">
              Une question, une proposition de collaboration ou besoin d'un accompagnement personnalisé ? Écrivez-nous.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6">
            <div className="bg-white rounded-2xl p-8 border border-[#E6DEC8] shadow-sm space-y-6">
              <h3 className="text-xl font-bold font-display text-[#2C1810]">Envoyez-nous un message</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Message envoyé avec succès ! Notre équipe vous répondra sous 24h.');
                  (e.target as HTMLFormElement).reset();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[#5C4D3C] mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Prénom & Nom"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C4D3C] mb-1">Email professionnel</label>
                  <input
                    type="email"
                    required
                    placeholder="chercheur@universite.ma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C4D3C] mb-1">Sujet</label>
                  <select
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
                  >
                    <option>Demande de formation / masterclass</option>
                    <option>Service d'accompagnement ou de consulting</option>
                    <option>Proposition d'article / contribution au blog</option>
                    <option>Autre demande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5C4D3C] mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Décrivez votre besoin en détail..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E6DEC8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="bg-white rounded-2xl p-8 border border-[#E6DEC8] shadow-sm space-y-6">
                <h3 className="text-xl font-bold font-display text-[#2C1810]">Coordonnées & Bureaux</h3>
                <div className="space-y-4 text-xs sm:text-sm text-[#786C5E]">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <strong className="text-[#2C1810] block">Siège Principal - Rabat</strong>
                      Avenue Mohammed V, Centre-Ville, Rabat, Maroc
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">🏢</span>
                    <div>
                      <strong className="text-[#2C1810] block">Antenne - Marrakech</strong>
                      Avenue Mohammed VI, Guéliz, Marrakech, Maroc
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">✉️</span>
                    <div>
                      <strong className="text-[#2C1810] block">Email Officiel</strong>
                      contact@moroccanresearcher.com
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">📞</span>
                    <div>
                      <strong className="text-[#2C1810] block">Téléphone / WhatsApp</strong>
                      +212 5 37 00 00 00 / +212 6 00 00 00 00
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#2C1810] to-[#3D251A] text-white rounded-2xl p-8 shadow-md space-y-3">
                <h4 className="text-base font-bold font-display text-[#D4AF37]">Horaires d'Ouverture</h4>
                <p className="text-xs text-[#E6DEC8] leading-relaxed">
                  Lundi au Vendredi : 09:00 - 18:00 (GMT+1)<br />
                  Samedi : 09:00 - 13:00 (Sur rendez-vous)
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAddModal={handleOpenAddModal}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
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
        isAdmin={isAdmin}
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
