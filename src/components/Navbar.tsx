import React from 'react';
import { Plus, BookOpen, Compass, Code, Sparkles, Search } from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalArticles: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenImportModal,
  searchTerm,
  onSearchChange,
  totalArticles,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E6DEC8]/60 transition-all">
      {/* Top micro-bar with Moroccan greeting */}
      <div className="bg-[#2C1810] text-[#E6DEC8] text-xs py-1.5 px-4 font-medium flex justify-between items-center border-b border-[#3D251A]">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C85A32] animate-pulse"></span>
          <span className="tracking-wide">مرحباً بكم • Bienvenue au Maroc • Moroccan Heritage Hub</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px] text-[#D4AF37]">
          <span>{totalArticles} Curated Articles</span>
          <span>•</span>
          <span>Fez • Marrakech • Chefchaouen • Sahara</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
              <p className="text-xs text-[#786C5E] font-medium tracking-tight">Artisanat, Gastronomie & Récits</p>
            </div>
          </div>

          {/* Quick search input in navbar for desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative ml-4">
            <Search className="w-4 h-4 text-[#A89F91] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles, tags, medina..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white/70 border border-[#E6DEC8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 focus:border-[#C85A32] placeholder-[#A89F91] text-[#2C1810]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Import / Paste Zip Code Button */}
            <button
              onClick={onOpenImportModal}
              title="Paste or import website code & articles"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#5C4D3C] hover:text-[#2C1810] bg-[#EFE8DC]/80 hover:bg-[#E6DEC8] rounded-lg transition-colors border border-[#DDD3C0]"
            >
              <Code className="w-4 h-4 text-[#C85A32]" />
              <span className="hidden sm:inline">Import Files / Code</span>
              <span className="sm:hidden">Import</span>
            </button>

            {/* The primary "Add New Article" button - fully clickable and noticeable */}
            <button
              onClick={onOpenAddModal}
              id="add-article-btn"
              className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#C85A32] to-[#BA4820] hover:from-[#BA4820] hover:to-[#A33814] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-[#C85A32]/25 hover:shadow-lg hover:shadow-[#C85A32]/35 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Article</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
