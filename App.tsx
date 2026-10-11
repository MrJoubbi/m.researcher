import React, { useState, useEffect, useMemo } from 'react';
import { Article } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BlogSection } from './components/BlogSection';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ContactSection } from './components/ContactSection';
import { EditorialBoardSection } from './components/EditorialBoardSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { SubmissionGuideSection } from './components/SubmissionGuideSection';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { AdminAuthModal } from './components/dashboard/AdminAuthModal';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('journal');
  const [articles, setArticles] = useState<Article[]>(() => StorageService.getArticles());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => StorageService.getBookmarks());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Admin Portal state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => StorageService.isLoggedIn());
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  
  // Bookmarks Drawer state
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Synchronize data helper
  const reloadData = () => {
    setArticles(StorageService.getArticles());
    setBookmarks(StorageService.getBookmarks());
    setIsAdminLoggedIn(StorageService.isLoggedIn());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Lead featured article
  const featuredArticle = useMemo(() => {
    return articles.find(a => a.featured && a.status === 'published') || 
      articles.find(a => a.status === 'published');
  }, [articles]);

  // Bookmarked articles list
  const bookmarkedArticles = useMemo(() => {
    return articles.filter(a => bookmarks.includes(a.id));
  }, [articles, bookmarks]);

  // Article count by category
  const articlesCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach(a => {
      if (a.status === 'published') {
        counts[a.category] = (counts[a.category] || 0) + 1;
      }
    });
    return counts;
  }, [articles]);

  // Handlers
  const handleToggleBookmark = (id: string) => {
    StorageService.toggleBookmark(id);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleOpenAdmin = () => {
    if (StorageService.isLoggedIn()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    StorageService.logout();
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveTab('journal');
    // Scroll to blog section smoothly
    const elem = document.getElementById('journal-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Strict Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarksCount={bookmarks.length}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Page Routing / Sections */}
      <main className="flex-1">
        {activeTab === 'journal' && (
          <>
            <Hero
              featuredArticle={featuredArticle}
              onReadArticle={(art) => setSelectedArticle(art)}
              onBrowseCategory={handleSelectCategory}
              totalArticles={articles.filter(a => a.status === 'published').length}
            />

            <BlogSection
              articles={articles}
              onReadArticle={(art) => setSelectedArticle(art)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            <DisciplinesSection
              onSelectCategory={handleSelectCategory}
              articlesCountByCategory={articlesCountByCategory}
            />

            <EditorialBoardSection />

            <ContactSection />
          </>
        )}

        {activeTab === 'disciplines' && (
          <div className="py-6">
            <DisciplinesSection
              onSelectCategory={handleSelectCategory}
              articlesCountByCategory={articlesCountByCategory}
            />
            <BlogSection
              articles={articles}
              onReadArticle={(art) => setSelectedArticle(art)}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </div>
        )}

        {activeTab === 'editorial' && (
          <div className="py-6">
            <EditorialBoardSection />
            <ContactSection />
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="py-6">
            <SubmissionGuideSection
              onGoToContact={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <ContactSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="py-6">
            <ContactSection />
          </div>
        )}
      </main>

      {/* Scholarly Institutional Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* --- MODAL: LONG FORM ARTICLE DETAIL VIEW --- */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          onArticleUpdated={(updated) => {
            setSelectedArticle(updated);
            reloadData();
          }}
        />
      )}

      {/* --- DRAWER: SAVED BOOKMARKS --- */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedArticles={bookmarkedArticles}
        onReadArticle={(art) => setSelectedArticle(art)}
        onRemoveBookmark={handleToggleBookmark}
      />

      {/* --- MODAL: ADMIN LOGIN AUTH --- */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* --- FULLSCREEN: ADMIN DASHBOARD SUITE --- */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onClose={() => setIsAdminDashboardOpen(false)}
          onLogout={handleAdminLogout}
          onPreviewArticle={(art) => {
            setSelectedArticle(art);
            setIsAdminDashboardOpen(false);
          }}
          onRefreshData={reloadData}
        />
      )}

    </div>
  );
}
