import React from 'react';
import { Plus, BookOpen, Compass, Code, Sparkles, Search, Lock, Unlock, Home, GraduationCap, Briefcase, Mail } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalArticles: number;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  currentView: 'home' | 'blog' | 'formations' | 'services' | 'contact';
  onNavigate: (view: 'home' | 'blog' | 'formations' | 'services' | 'contact', path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenImportModal,
  searchTerm,
  onSearchChange,
  totalArticles,
  isAdmin,
  onToggleAdmin,
  currentView,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC8]/80 transition-all shadow-sm">
      {/* Top micro-bar with Moroccan greeting */}
      <div className="bg-[#2C1810] text-[#E6DEC8] text-xs py-1.5 px-4 font-medium flex justify-between items-center border-b border-[#3D251A]">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C85A32] animate-pulse"></span>
          <span className="tracking-wide">مرحباً بكم • Moroccan Researcher & Heritage Hub</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px] text-[#D4AF37]">
          <span>{totalArticles} Curated Articles</span>
          <span>•</span>
          <span>Rabat • Marrakech • Fès</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('home', '/')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#993D1B] flex items-center justify-center text-white shadow-md shadow-[#C85A32]/25 group-hover:scale-105 transition-transform duration-200 border border-[#FAF7F2]/30">
              <span className="font-serif-moroccan text-2xl font-bold leading-none">م</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl font-bold tracking-wider text-[#2C1810]">
                  MOROCCO
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#C85A32]/10 text-[#C85A32] font-semibold uppercase tracking-widest border border-[#C85A32]/20">
                  Mag
                </span>
              </div>
              <p className="text-xs text-[#786C5E] font-medium tracking-tight">Research, Heritage & Culture</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('home', '/')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'bg-[#2C1810] text-white shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#2C1810] hover:bg-[#EFE8DC]'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => onNavigate('blog', '/blog')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'blog'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#2C1810] hover:bg-[#EFE8DC]'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => onNavigate('formations', '/Formations')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'formations'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#2C1810] hover:bg-[#EFE8DC]'
              }`}
            >
              Formations
            </button>
            <button
              onClick={() => onNavigate('services', '/Nos Services')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'services'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#2C1810] hover:bg-[#EFE8DC]'
              }`}
            >
              Nos Services
            </button>
            <button
              onClick={() => onNavigate('contact', '/Contact')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-[#5C4D3C] hover:text-[#2C1810] hover:bg-[#EFE8DC]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Quick search input in navbar for desktop */}
          <div className="hidden xl:flex items-center max-w-xs relative">
            <Search className="w-4 h-4 text-[#A89F91] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentView !== 'blog') onNavigate('blog', '/blog');
              }}
              placeholder="Search articles, tags, medina..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/80 border border-[#E6DEC8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] placeholder-[#A89F91] text-[#2C1810]"
            />
          </div>

          {/* Action buttons & Admin status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Admin toggle button */}
            <button
              onClick={onToggleAdmin}
              title={isAdmin ? "Admin mode active (Click to lock)" : "Click to log in as Admin"}
              className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors border ${
                isAdmin 
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm' 
                  : 'bg-[#EFE8DC]/80 hover:bg-[#E6DEC8] text-[#5C4D3C] border-[#DDD3C0]'
              }`}
            >
              {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAdmin ? 'Admin Mode' : 'Admin Login'}</span>
            </button>

            {/* Import Button (Admin Only) */}
            {isAdmin && (
              <button
                onClick={onOpenImportModal}
                title="Paste or import website code & articles"
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#5C4D3C] hover:text-[#2C1810] bg-[#EFE8DC]/80 hover:bg-[#E6DEC8] rounded-lg transition-colors border border-[#DDD3C0]"
              >
                <Code className="w-4 h-4 text-[#C85A32]" />
                <span className="hidden sm:inline">Import</span>
              </button>
            )}

            {/* The primary "Add New Article" button (Admin Only) */}
            {isAdmin && (
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center space-x-2 px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#C85A32] to-[#BA4820] hover:from-[#BA4820] hover:to-[#A33814] text-white text-xs font-semibold rounded-lg shadow-md shadow-[#C85A32]/25 hover:shadow-lg active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Article</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar row */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-[#E6DEC8]/60 text-xs font-medium">
          <button
            onClick={() => onNavigate('home', '/')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${currentView === 'home' ? 'text-[#C85A32] font-bold bg-[#C85A32]/10' : 'text-[#5C4D3C]'}`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </button>
          <button
            onClick={() => onNavigate('blog', '/blog')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${currentView === 'blog' ? 'text-[#C85A32] font-bold bg-[#C85A32]/10' : 'text-[#5C4D3C]'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blog</span>
          </button>
          <button
            onClick={() => onNavigate('formations', '/Formations')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${currentView === 'formations' ? 'text-[#C85A32] font-bold bg-[#C85A32]/10' : 'text-[#5C4D3C]'}`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Formations</span>
          </button>
          <button
            onClick={() => onNavigate('services', '/Nos Services')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${currentView === 'services' ? 'text-[#C85A32] font-bold bg-[#C85A32]/10' : 'text-[#5C4D3C]'}`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Services</span>
          </button>
          <button
            onClick={() => onNavigate('contact', '/Contact')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md ${currentView === 'contact' ? 'text-[#C85A32] font-bold bg-[#C85A32]/10' : 'text-[#5C4D3C]'}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
};
