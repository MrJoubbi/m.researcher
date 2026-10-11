import React from 'react';
import { Plus, BookOpen, Sparkles, Compass, Feather } from 'lucide-react';
import { ArticleCategory } from '../types/article';

interface HeroProps {
  onOpenAddModal: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: ArticleCategory[];
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAddModal,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#2C1810] via-[#3A2218] to-[#2C1810] text-[#FAF7F2] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C85A32]/30">
      {/* Decorative Moroccan Arabesque Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
      />
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#C85A32]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Moroccan Cultural Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#C85A32]/25 border border-[#C85A32]/50 text-[#EFC488] text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>L'Âme et les Trésors du Royaume du Maroc</span>
          <span className="text-[#C85A32]">•</span>
          <span className="font-serif-moroccan text-sm font-bold">المملكة المغربية</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
          Moroccan Chronicles & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EFC488] via-[#F4A261] to-[#C85A32]">
            Artisanal Stories
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#D6CAB8] font-normal leading-relaxed">
          From the ancient cobalt alleys of Fez to the starlit sands of Merzouga, explore and publish stories celebrating authentic Moroccan gastronomy, craftsmanship, and riad escapes.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2.5 px-6 py-3.5 bg-gradient-to-r from-[#C85A32] to-[#B3451F] hover:from-[#B3451F] hover:to-[#963515] text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-[#C85A32]/30 hover:shadow-xl hover:shadow-[#C85A32]/45 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Publish New Article</span>
          </button>

          <a
            href="#articles-section"
            className="inline-flex items-center space-x-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-[#E6DEC8] hover:text-white text-sm sm:text-base font-medium rounded-xl border border-white/20 backdrop-blur-sm transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Browse All Articles</span>
          </a>
        </div>

        {/* Category Pills */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#C85A32] text-white shadow-sm'
                : 'bg-white/5 text-[#D6CAB8] hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            All Stories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'bg-white/5 text-[#D6CAB8] hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
