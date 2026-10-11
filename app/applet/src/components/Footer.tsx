import React from 'react';
import { Heart, Compass, BookOpen, Plus, Globe, Lock, Unlock } from 'lucide-react';

interface FooterProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAddModal, onOpenImportModal, isAdmin, onToggleAdmin }) => {
  return (
    <footer className="bg-[#2C1810] text-[#D6CAB8] border-t border-[#3D251A] mt-20">
      {/* Moroccan Decorative border top */}
      <div className="h-1.5 bg-gradient-to-r from-[#C85A32] via-[#D4AF37] to-[#1F3A8A]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Story */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#993D1B] flex items-center justify-center text-white font-serif-moroccan text-2xl font-bold shadow-md">
                م
              </div>
              <span className="font-display text-xl font-bold tracking-wider text-white">
                MOROCCO MAG
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A89A89] leading-relaxed max-w-md">
              A digital tribute to the Kingdom of Morocco’s living heritage, artisanal legacies, culinary wisdom, and majestic landscapes. Preserving tradition, inspiring discovery.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-[#D4AF37]">
              <span>فاس</span>
              <span>•</span>
              <span>مراكش</span>
              <span>•</span>
              <span>طنجة</span>
              <span>•</span>
              <span>شفشاون</span>
              <span>•</span>
              <span>الرباط</span>
              <span>•</span>
              <span>الصويرة</span>
            </div>
          </div>

          {/* Quick links & categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Heritage Topics
            </h4>
            <ul className="space-y-2 text-xs text-[#A89A89]">
              <li className="hover:text-white transition-colors cursor-pointer">Artisanat & Zellige Craft</li>
              <li className="hover:text-white transition-colors cursor-pointer">Moroccan Culinary Secrets</li>
              <li className="hover:text-white transition-colors cursor-pointer">Historic Riads & Palaces</li>
              <li className="hover:text-white transition-colors cursor-pointer">Atlas Mountains & Sahara</li>
              <li className="hover:text-white transition-colors cursor-pointer">Andalusian Music & Malhun</li>
            </ul>
          </div>

          {/* Publishing actions & Security Admin login */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Publish & Contribute
            </h4>
            <p className="text-xs text-[#A89A89] leading-relaxed">
              Secure portal for Moroccan cultural contributors and historians.
            </p>
            <div className="pt-1 flex flex-col space-y-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Article</span>
                  </button>
                  <button
                    onClick={onOpenImportModal}
                    className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#D6CAB8] rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Import from Zip / Code</span>
                  </button>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[11px] text-[#A89A89]">Website is secure. Authoring requires admin mode.</p>
                  <button
                    onClick={onToggleAdmin}
                    className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#C85A32]/20 hover:bg-[#C85A32]/30 text-xs font-semibold text-[#EFC488] rounded-lg transition-colors border border-[#C85A32]/30 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-[#3D251A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#786C5E] gap-3">
          <p>© {new Date().getFullYear()} Moroccan Heritage Hub. Crafted with pride for Morocco.</p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onToggleAdmin} 
              className="text-[11px] text-[#A89A89] hover:text-[#D4AF37] underline transition-colors"
            >
              {isAdmin ? '🔒 Lock Admin Session' : '🔓 Admin Login'}
            </button>
            <p className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#C85A32] fill-current" />
              <span>for Moroccan Culture & Arts</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
