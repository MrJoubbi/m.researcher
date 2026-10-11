import React, { useState } from 'react';
import { X, Code, FileText, Download, Upload, Check, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Article } from '../types/article';

interface ImportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onImportArticles: (imported: Article[]) => void;
}

export const ImportCodeModal: React.FC<ImportCodeModalProps> = ({
  isOpen,
  onClose,
  articles,
  onImportArticles,
}) => {
  const [tab, setTab] = useState<'info' | 'paste' | 'export'>('info');
  const [inputCode, setInputCode] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleImportJSON = () => {
    setStatusMessage(null);
    try {
      const parsed = JSON.parse(inputCode.trim());
      if (Array.isArray(parsed)) {
        // Validate each
        const validArticles: Article[] = parsed.map((item, index) => ({
          id: item.id || `imported-${Date.now()}-${index}`,
          title: item.title || `Imported Article ${index + 1}`,
          arabicTitle: item.arabicTitle,
          category: item.category || 'Culture & Traditions',
          excerpt: item.excerpt || (item.content ? item.content.slice(0, 150) + '...' : 'Imported article content'),
          content: item.content || item.excerpt || 'No content provided',
          coverImage: item.coverImage || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
          author: item.author || {
            name: 'Contributor',
            role: 'Writer',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          },
          publishedAt: item.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: item.readTime || '5 min read',
          tags: Array.isArray(item.tags) ? item.tags : ['Morocco'],
          likes: item.likes || 0,
          featured: Boolean(item.featured),
        }));

        onImportArticles(validArticles);
        setStatusMessage({ type: 'success', text: `Successfully imported ${validArticles.length} articles into the website!` });
        setInputCode('');
      } else if (typeof parsed === 'object' && parsed.title) {
        // Single article
        const singleArticle: Article = {
          id: parsed.id || `imported-${Date.now()}`,
          title: parsed.title,
          arabicTitle: parsed.arabicTitle,
          category: parsed.category || 'Culture & Traditions',
          excerpt: parsed.excerpt || (parsed.content ? parsed.content.slice(0, 150) + '...' : ''),
          content: parsed.content || parsed.excerpt || '',
          coverImage: parsed.coverImage || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
          author: parsed.author || {
            name: 'Contributor',
            role: 'Writer',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          },
          publishedAt: parsed.publishedAt || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: parsed.readTime || '5 min read',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['Morocco'],
          likes: parsed.likes || 0,
          featured: false,
        };
        onImportArticles([singleArticle]);
        setStatusMessage({ type: 'success', text: `Successfully imported article "${singleArticle.title}"!` });
        setInputCode('');
      } else {
        throw new Error('JSON format should be an array of articles or a single article object.');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Error parsing JSON: ${err.message || 'Invalid JSON format'}` });
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(articles, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moroccan-website-articles.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E6DEC8] w-full max-w-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6DEC8] bg-[#FAF7F2]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C1810] flex items-center justify-center text-[#E6DEC8]">
              <Code className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-[#2C1810]">
                Website Files & Code Integration
              </h2>
              <p className="text-xs text-[#786C5E]">
                Bring in content or code from your local files & zip archive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#786C5E] hover:text-[#2C1810] hover:bg-[#EFE8DC] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#E6DEC8] px-6 bg-[#FAF7F2]/60">
          <button
            onClick={() => setTab('info')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'info'
                ? 'border-[#C85A32] text-[#C85A32]'
                : 'border-transparent text-[#786C5E] hover:text-[#2C1810]'
            }`}
          >
            Zip File Info & Help
          </button>
          <button
            onClick={() => setTab('paste')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'paste'
                ? 'border-[#C85A32] text-[#C85A32]'
                : 'border-transparent text-[#786C5E] hover:text-[#2C1810]'
            }`}
          >
            Paste Articles / Code
          </button>
          <button
            onClick={() => setTab('export')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              tab === 'export'
                ? 'border-[#C85A32] text-[#C85A32]'
                : 'border-transparent text-[#786C5E] hover:text-[#2C1810]'
            }`}
          >
            Export Backup
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {tab === 'info' && (
            <div className="space-y-4 text-sm text-[#4A3E31]">
              <div className="p-4 rounded-xl bg-[#F4EDE0] border border-[#E0D7C4] space-y-2">
                <div className="flex items-center space-x-2 text-[#C85A32] font-semibold text-sm">
                  <Info className="w-4 h-4" />
                  <span>Why can't .zip files be automatically extracted here?</span>
                </div>
                <p className="text-xs text-[#5C4D3C] leading-relaxed">
                  In Google AI Studio Build, the chat input box cannot extract or unpack compressed <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px]">.zip</code> files into the server container.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#2C1810] text-sm">How to bring your custom website content here:</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-[#5C4D3C] leading-relaxed pl-1">
                  <li>
                    <strong className="text-[#2C1810]">Click "Add New Article"</strong> right here in this website to create stories with photos, title, Arabic/French text, and categories.
                  </li>
                  <li>
                    <strong className="text-[#2C1810]">Paste your HTML or Code in chat</strong>: You can open your files locally in a text editor (Notepad, VS Code) and copy-paste any specific HTML, CSS, or JS into our conversation.
                  </li>
                  <li>
                    <strong className="text-[#2C1810]">Import JSON in the "Paste Articles" tab</strong>: You can paste articles in JSON format and they will immediately appear on the site!
                  </li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setTab('paste')}
                  className="w-full py-2.5 bg-[#C85A32] hover:bg-[#BA4820] text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer text-center"
                >
                  Go to Paste Articles / Code tab
                </button>
              </div>
            </div>
          )}

          {tab === 'paste' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#4A3E31] uppercase tracking-wider">
                  Paste JSON Array or Article Object
                </label>
                <p className="text-[11px] text-[#786C5E]">
                  Paste article JSON below. Format: <code className="bg-white px-1 py-0.5 rounded text-[10px]">[&#123; "title": "...", "content": "..." &#125;]</code>
                </p>
              </div>

              <textarea
                rows={8}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={`[
  {
    "title": "My Custom Moroccan Article",
    "category": "Artisanat & Crafts",
    "excerpt": "A short summary of this story...",
    "content": "Full article body here...",
    "coverImage": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70",
    "tags": ["Morocco", "Artisanat"]
  }
]`}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-white border border-[#E0D7C4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#2C1810]"
              />

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setInputCode('')}
                  className="px-4 py-2 text-xs font-medium text-[#786C5E] hover:text-[#2C1810]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleImportJSON}
                  disabled={!inputCode.trim()}
                  className="px-5 py-2 bg-[#C85A32] hover:bg-[#BA4820] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
                >
                  Import Articles Now
                </button>
              </div>
            </div>
          )}

          {tab === 'export' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EFE8DC] flex items-center justify-center text-[#C85A32]">
                <Download className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#2C1810]">Export All Current Articles ({articles.length})</h4>
                <p className="text-xs text-[#786C5E] max-w-sm mx-auto">
                  Download a JSON file containing all your articles, tags, authors, and images to keep a local backup.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#2C1810] hover:bg-[#3D251A] text-[#FAF7F2] text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Articles JSON</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
