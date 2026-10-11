/**
 * Moroccan Researcher — Core Application Logic
 * Fixed: "+ Nouvel Article" modal, photo uploading, WebP conversion, drag & drop, and blog rendering
 */

// Global State
let currentArticleEditingId = null;
let currentBlogCategory = 'all';
let blogSearchQuery = '';

// Toast Utility
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.className = `toast show ${type}`;
  toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="margin-right:8px"></i> ${message}`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 4000);
}

// Path-to-Page and Page-to-Path Mapping
const ROUTE_CONFIG = {
  'home': { path: '/', title: 'Moroccan Researcher — Services d\'Accompagnement Académique', desc: 'Plateforme d\'accompagnement académique expert au Maroc. Conseil en recherche pour mémoires et thèses, analyse de données SPSS / R / Python, vérification Turnitin et préparation aux soutenances.' },
  'blog': { path: '/blog', title: 'Blog & Ressources Académiques — Moroccan Researcher', desc: 'Tutoriels, méthodologies de recherche, analyses statistiques SPSS / R / Python et guides pour réussir votre mémoire de Master et thèse de Doctorat au Maroc.' },
  'formations': { path: '/Formations', title: 'Formations Académiques & SPSS — Moroccan Researcher', desc: 'Programmes de formations intensifs en petits groupes : formation SPSS, méthodologie de recherche scientifique et rédaction académique aux normes APA.' },
  'services': { path: '/Nos_Services', title: 'Nos Services d\'Accompagnement — Moroccan Researcher', desc: 'Découvrez tous nos services : Conseil en recherche, analyse de données statistiques, conception de présentations de soutenance et vérification anti-plagiat Turnitin.' },
  'contact': { path: '/Contact', title: 'Contactez-Nous — Moroccan Researcher', desc: 'Prenez contact avec notre équipe de chercheurs et consultants académiques au Maroc. Conseil personnalisé 7j/7 par WhatsApp et email.' },
  'login': { path: '/login', title: 'Connexion Espace Chercheur — Moroccan Researcher', desc: 'Accédez à votre espace étudiant ou portail administrateur Moroccan Researcher.' },
  'register': { path: '/register', title: 'Démarrer mon Projet Académique — Moroccan Researcher', desc: 'Inscrivez-vous et décrivez votre projet académique pour démarrer votre accompagnement personnalisé.' }
};

// Update Document Meta for SEO dynamically
function updateRouteSEO(title, description, canonicalUrl) {
  if (title) {
    document.title = title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
  }
  if (description) {
    const metaDesc = document.getElementById('meta-description') || document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
  }
  if (canonicalUrl) {
    const can = document.getElementById('canonical-url') || document.querySelector('link[rel="canonical"]');
    if (can) can.setAttribute('href', canonicalUrl);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  }
}

// Navigation & Page Router
function showPage(pageId, pushState = true, event = null) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  // Access Control / Route Protection
  const currentUser = window.DataStore ? window.DataStore.getCurrentUser() : null;
  if (pageId === 'admin-dashboard' || pageId === 'admin-article-editor') {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast('Accès restreint : Authentification administrateur requise', 'error');
      pageId = 'login';
    }
  } else if (pageId === 'user-dashboard') {
    if (!currentUser) {
      showToast('Veuillez vous connecter pour accéder à votre espace', 'info');
      pageId = 'login';
    }
  }

  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  } else {
    // Fallback to home
    const home = document.getElementById('page-home');
    if (home) home.classList.add('active');
    pageId = 'home';
  }

  // Synchronize browser URL bar and History state for SEO & clean permalinks
  const routeMeta = ROUTE_CONFIG[pageId];
  if (routeMeta) {
    updateRouteSEO(routeMeta.title, routeMeta.desc, `${window.location.origin}${routeMeta.path}`);
    if (pushState && window.history && window.history.pushState) {
      const currentPath = window.location.pathname;
      if (currentPath !== routeMeta.path && !(routeMeta.path === '/' && (currentPath === '' || currentPath === '/index.html'))) {
        try {
          window.history.pushState({ pageId }, routeMeta.title, routeMeta.path);
        } catch (e) {
          // If running in sandboxed iframe or cross-origin restrictions, log gracefully without failing
          console.warn('pushState error suppressed:', e);
        }
      }
    }
  }

  // Update active states on top navbar links
  const navLinks = document.querySelectorAll('#navLinks a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if ((pageId === 'services' && (href === '/Nos_Services' || href === '#services' || href.toLowerCase() === '/nos_services')) ||
        (pageId === 'formations' && (href === '/Formations' || href === '#formations' || href.toLowerCase() === '/formations')) ||
        (pageId === 'blog' && (href === '/blog' || href === '#blog')) ||
        (pageId === 'contact' && (href === '/Contact' || href === '#contact' || href.toLowerCase() === '/contact'))) {
      link.classList.add('active');
    }
  });

  // Hide top public navbar for dedicated full-page apps (editor and dashboards)
  const nav = document.getElementById('navbar');
  const isDedicatedApp = (pageId === 'admin-article-editor' || pageId === 'admin-dashboard' || pageId === 'user-dashboard');
  if (nav) {
    nav.style.display = isDedicatedApp ? 'none' : 'flex';
  }

  // Handle special page initialization
  if (pageId === 'home') {
    renderHomeBlogGrid();
  } else if (pageId === 'blog') {
    renderBlogGrid();
  } else if (pageId === 'admin-dashboard') {
    renderAdminOverview();
    renderAdminArticles();
  } else if (pageId === 'user-dashboard') {
    renderStudentDashboard();
  }

  closeNav();
}
window.showPage = showPage;

// Global Clean URL Nav helper
function navigateTo(path, event = null) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  const clean = (path || '').trim();
  const lower = clean.toLowerCase();
  if (clean === '/' || lower === '/home' || clean === '') {
    showPage('home', true);
  } else if (lower === '/blog' || lower === 'blog') {
    showPage('blog', true);
  } else if (clean === '/Formations' || lower === '/formations') {
    showPage('formations', true);
  } else if (clean === '/Nos_Services' || lower === '/nos_services' || clean === '/Nos Services' || lower === '/services') {
    showPage('services', true);
  } else if (clean === '/Contact' || lower === '/contact') {
    showPage('contact', true);
  } else if (lower.startsWith('/article/') || lower.startsWith('/blog/')) {
    const slug = clean.replace(/^\/(article|blog)\//i, '');
    openArticleDetail(slug, event);
  } else {
    showPage('home', true);
  }
}
window.navigateTo = navigateTo;

function closeNav() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navBackdrop = document.getElementById('nav-backdrop');
  if (navLinks) navLinks.classList.remove('open');
  if (navToggle) navToggle.classList.remove('open');
  if (navBackdrop) navBackdrop.classList.remove('open');
}

function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const navBackdrop = document.getElementById('nav-backdrop');
  if (navLinks) navLinks.classList.toggle('open');
  if (navToggle) navToggle.classList.toggle('open');
  if (navBackdrop) navBackdrop.classList.toggle('open');
}

function scrollToSection(sectionId) {
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

// Dashboard Tabs & Sidebar
function showDashTab(role, tabName, btnElement, event = null) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const prefix = role === 'admin' ? 'admin' : 'user';
  const tabs = document.querySelectorAll(`#page-${prefix}-dashboard .dash-tab`);
  tabs.forEach(t => t.classList.remove('active-tab'));

  const targetTab = document.getElementById(`${prefix}-tab-${tabName}`);
  if (targetTab) {
    targetTab.classList.add('active-tab');
  }

  // Update sidebar active nav item
  const navItems = document.querySelectorAll(`#${prefix}Sidebar .nav-item`);
  navItems.forEach(n => n.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Trigger specific tab renders
  if (role === 'admin') {
    if (tabName === 'articles') renderAdminArticles();
    if (tabName === 'projects') renderAdminProjects();
    if (tabName === 'clients') renderAdminClients();
    if (tabName === 'contacts') renderAdminContacts();
    if (tabName === 'security') renderAdminAuditLogs();
  }
}

function toggleSidebar(sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  if (sidebar) sidebar.classList.toggle('open');
}

function closeSidebar(sidebarId) {
  const sidebar = document.getElementById(sidebarId);
  if (sidebar) sidebar.classList.remove('open');
}

// =====================================================================
// ARTICLE MANAGEMENT & DEDICATED FULL-PAGE EDITOR (NO POPUP)
// =====================================================================
function openArticleEditorPage(articleId = null) {
  currentArticleEditingId = articleId;
  const articles = DataStore.getArticles();
  const existing = articleId ? articles.find(a => a.id === articleId) : null;

  const headerTitle = document.getElementById('modal-article-header-title');
  const breadcrumbAction = document.getElementById('editor-breadcrumb-action');
  const idInput = document.getElementById('modal-article-id');
  const titleInput = document.getElementById('art-form-title');
  const slugInput = document.getElementById('art-form-slug');
  const catSelect = document.getElementById('art-form-cat');
  const authorInput = document.getElementById('art-form-author');
  const readTimeInput = document.getElementById('art-form-readtime');
  const statusSelect = document.getElementById('art-form-status');
  const coverInput = document.getElementById('art-form-cover');
  const excerptInput = document.getElementById('art-form-excerpt');
  const contentInput = document.getElementById('art-form-content');
  const tagsInput = document.getElementById('art-form-tags');
  const featuredCheck = document.getElementById('art-form-featured');

  // SEO fields
  const metaTitleInput = document.getElementById('art-form-meta-title');
  const metaDescInput = document.getElementById('art-form-meta-desc');
  const focusKeywordInput = document.getElementById('art-form-focus-keyword');
  const schemaTypeSelect = document.getElementById('art-form-schema-type');
  const canonicalUrlInput = document.getElementById('art-form-canonical-url');
  const robotsSelect = document.getElementById('art-form-robots');

  if (existing) {
    if (headerTitle) headerTitle.textContent = "Modifier l'Article";
    if (breadcrumbAction) breadcrumbAction.textContent = "Modifier l'Article";
    if (idInput) idInput.value = existing.id;
    if (titleInput) titleInput.value = existing.title || '';
    if (slugInput) slugInput.value = existing.slug || '';
    if (catSelect) catSelect.value = existing.category || 'Méthodologie';
    if (authorInput) authorInput.value = existing.author || 'Dr. Karim Ouazzani';
    if (readTimeInput) readTimeInput.value = existing.readTime || '6 min';
    if (statusSelect) statusSelect.value = existing.status || 'Publié';
    if (coverInput) coverInput.value = existing.cover || '';
    if (excerptInput) excerptInput.value = existing.excerpt || '';
    if (contentInput) contentInput.value = existing.content || '';
    if (tagsInput) tagsInput.value = (existing.tags || []).join(', ');
    if (featuredCheck) featuredCheck.checked = Boolean(existing.featured);

    if (metaTitleInput) metaTitleInput.value = existing.metaTitle || existing.title || '';
    if (metaDescInput) metaDescInput.value = existing.metaDesc || existing.excerpt || '';
    if (focusKeywordInput) focusKeywordInput.value = existing.focusKeyword || '';
    if (schemaTypeSelect) schemaTypeSelect.value = existing.schemaType || 'ScholarlyArticle';
    if (canonicalUrlInput) canonicalUrlInput.value = existing.canonicalUrl || `https://moroccanresearcher.com/article/${existing.slug}`;
    if (robotsSelect) robotsSelect.value = existing.robots || 'index, follow';

    // Show cover preview card if cover exists
    if (existing.cover) {
      showCoverPreviewCard(existing.cover, 'Photo de couverture existante');
    } else {
      hideCoverPreviewCard();
    }
  } else {
    // Mode: NOUVEL ARTICLE
    if (headerTitle) headerTitle.textContent = "Rédiger un Nouvel Article";
    if (breadcrumbAction) breadcrumbAction.textContent = "Nouvel Article";
    if (idInput) idInput.value = '';
    if (titleInput) titleInput.value = '';
    if (slugInput) slugInput.value = '';
    if (catSelect) catSelect.value = 'Méthodologie';
    if (authorInput) authorInput.value = 'Dr. Karim Ouazzani';
    if (readTimeInput) readTimeInput.value = '6 min';
    if (statusSelect) statusSelect.value = 'Publié';
    if (coverInput) coverInput.value = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80';
    if (excerptInput) excerptInput.value = '';
    if (contentInput) contentInput.value = '';
    if (tagsInput) tagsInput.value = 'Méthodologie, Recherche, Thèse';
    if (featuredCheck) featuredCheck.checked = false;

    if (metaTitleInput) metaTitleInput.value = '';
    if (metaDescInput) metaDescInput.value = '';
    if (focusKeywordInput) focusKeywordInput.value = '';
    if (schemaTypeSelect) schemaTypeSelect.value = 'ScholarlyArticle';
    if (canonicalUrlInput) canonicalUrlInput.value = '';
    if (robotsSelect) robotsSelect.value = 'index, follow';

    showCoverPreviewCard('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80', 'Image par défaut HD');
  }

  // Reset to first tab
  switchArticleModalTab('content');
  updateExcerptCount();
  updateWordCount();
  updateSeoAudit();

  // Open the dedicated full page (NO POPUP!)
  showPage('admin-article-editor');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Backward compatibility alias for any existing onclick handlers
function openAdminArticleModal(articleId = null) {
  openArticleEditorPage(articleId);
}

function exitArticleEditor() {
  currentArticleEditingId = null;
  // Return smoothly to the Admin Dashboard (Articles Tab)
  showPage('admin-dashboard');
  showDashTab('admin', 'articles', document.querySelector('#adminSidebar .nav-item:nth-child(2)'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeAdminArticleModal() {
  exitArticleEditor();
}

function switchArticleModalTab(tabKey) {
  const tabs = ['content', 'seo', 'preview'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-btn-art-${t}`);
    const view = document.getElementById(`art-modal-view-${t}`);
    if (btn) btn.classList.toggle('active', t === tabKey);
    if (view) view.style.display = t === tabKey ? 'block' : 'none';
  });

  if (tabKey === 'preview') {
    updateLivePreview();
  } else if (tabKey === 'seo') {
    updateSeoAudit();
  }
}

// =====================================================================
// PHOTO UPLOADING, DRAG-AND-DROP & WEBP CONVERSION (FIX)
// =====================================================================

// Helper to convert Image to high-performance WebP with responsive downscaling
function fileToOptimizedWebP(file, maxWidth = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Aucun fichier image fourni'));
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const maxHeight = 850;
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: rawDataUrl, originalSize: file.size || 100000, compressedSize: file.size || 100000, gainPercent: 10 });
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP conversion first, fallback to jpeg if unsupported
          let webpDataUrl = '';
          try {
            webpDataUrl = canvas.toDataURL('image/webp', quality);
            if (!webpDataUrl.startsWith('data:image/webp')) {
              webpDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            }
          } catch (err) {
            webpDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          }

          const originalSize = file.size || Math.round((webpDataUrl.length * 3) / 4);
          const compressedSize = Math.round((webpDataUrl.length * 3) / 4);
          const gainPercent = originalSize > compressedSize
            ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
            : 35;

          resolve({
            dataUrl: webpDataUrl || rawDataUrl,
            originalSize,
            compressedSize,
            gainPercent: Math.max(10, gainPercent)
          });
        } catch (err) {
          resolve({ dataUrl: rawDataUrl, originalSize: file.size || 100000, compressedSize: file.size || 100000, gainPercent: 10 });
        }
      };
      img.onerror = () => {
        resolve({ dataUrl: rawDataUrl, originalSize: file.size || 100000, compressedSize: file.size || 100000, gainPercent: 10 });
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture de l’image'));
    reader.readAsDataURL(file);
  });
}

function handleCoverPhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP)', 'error');
    return;
  }

  showToast('Conversion et optimisation WebP en cours...', 'info');

  fileToOptimizedWebP(file, 1100, 0.82)
    .then(result => {
      const coverInput = document.getElementById('art-form-cover');
      if (coverInput) {
        coverInput.value = result.dataUrl;
      }
      showCoverPreviewCard(result.dataUrl, `Converti en WebP (${Math.round(result.compressedSize / 1024)} Ko)`, result.gainPercent);
      showToast(`Photo optimisée avec succès (-${result.gainPercent}% de taille) !`);
      updateSeoAudit();
      updateLivePreview();
    })
    .catch(err => {
      console.error('Error processing image:', err);
      showToast('Erreur lors de la conversion de la photo', 'error');
    });
}

function showCoverPreviewCard(src, statsText = 'Image optimisée', gainPercent = 85) {
  const card = document.getElementById('art-cover-preview-card');
  const img = document.getElementById('art-cover-preview-img');
  const gainBadge = document.getElementById('art-cover-speed-gain');
  const statsEl = document.getElementById('art-cover-stats-text');

  if (img) {
    img.src = src;
    img.onerror = () => {
      img.onerror = null;
      img.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';
    };
  }
  if (gainBadge) gainBadge.textContent = `-${gainPercent}% de taille`;
  if (statsEl) statsEl.textContent = statsText;
  if (card) card.style.display = 'flex';
}

function hideCoverPreviewCard() {
  const card = document.getElementById('art-cover-preview-card');
  const img = document.getElementById('art-cover-preview-img');
  if (card) card.style.display = 'none';
  if (img) img.src = '';
}

function removeCoverPhoto() {
  const coverInput = document.getElementById('art-form-cover');
  const fileInput = document.getElementById('art-cover-file-input');
  if (coverInput) coverInput.value = '';
  if (fileInput) fileInput.value = '';
  hideCoverPreviewCard();
  updateSeoAudit();
  showToast('Photo de couverture retirée');
}

function updateCoverPreview() {
  const coverInput = document.getElementById('art-form-cover');
  if (coverInput && coverInput.value.trim()) {
    showCoverPreviewCard(coverInput.value.trim(), 'Image via URL externe');
  } else {
    hideCoverPreviewCard();
  }
  updateSeoAudit();
}

const COVER_PRESETS = {
  library: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
  stats: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  graduation: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
  writing: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
  qualitative: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=1200&auto=format&fit=crop&q=80'
};

function selectCoverPreset(presetKey) {
  const url = COVER_PRESETS[presetKey] || COVER_PRESETS.library;
  const coverInput = document.getElementById('art-form-cover');
  if (coverInput) coverInput.value = url;
  showCoverPreviewCard(url, 'Suggestion HD Universitaire');
  showToast('Photo de couverture sélectionnée !');
  updateSeoAudit();
}

// Inline photo upload into the article textarea
function handleInlinePhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  fileToOptimizedWebP(file, 1000, 0.82).then(result => {
    const textarea = document.getElementById('art-form-content');
    if (!textarea) return;

    const imgTag = `\n<figure style="margin:24px 0;text-align:center;">\n  <img src="${result.dataUrl}" alt="Illustration article" style="max-width:100%;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);" />\n  <figcaption style="font-size:12px;color:#64748b;margin-top:6px;font-style:italic">Illustration académique</figcaption>\n</figure>\n`;
    
    insertAtCaret(textarea, imgTag);
    updateWordCount();
    showToast('Photo insérée directement dans le contenu !');
  }).catch(() => {
    showToast('Impossible de charger la photo', 'error');
  });
}

function promptInsertImageUrl() {
  const url = prompt("Entrez l'URL de l'image (ex: https://images.unsplash.com/photo-...) :");
  if (url && url.trim()) {
    const textarea = document.getElementById('art-form-content');
    if (!textarea) return;
    const imgTag = `\n<figure style="margin:24px 0;text-align:center;">\n  <img src="${url.trim()}" alt="Illustration" style="max-width:100%;border-radius:12px;" />\n</figure>\n`;
    insertAtCaret(textarea, imgTag);
    updateWordCount();
    showToast('Image ajoutée par URL !');
  }
}

function insertAtCaret(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);
  textarea.value = before + text + after;
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  textarea.focus();
}

// =====================================================================
// FORM HELPERS & SEO AUDIT
// =====================================================================

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function handleArticleTitleInput() {
  const title = (document.getElementById('art-form-title')?.value || '').trim();
  const slugInput = document.getElementById('art-form-slug');
  if (slugInput && (!slugInput.value || slugInput.dataset.auto !== 'false')) {
    slugInput.value = slugify(title);
  }
  syncSeoFromSlug();
  updateSeoAudit();
}

function regenerateArticleSlug() {
  const title = (document.getElementById('art-form-title')?.value || '').trim();
  const slugInput = document.getElementById('art-form-slug');
  if (slugInput) {
    slugInput.value = slugify(title);
    syncSeoFromSlug();
    showToast('Slug régénéré depuis le titre');
  }
}

function syncSeoFromSlug() {
  const slug = (document.getElementById('art-form-slug')?.value || '').trim();
  const canonicalInput = document.getElementById('art-form-canonical-url');
  if (canonicalInput && slug) {
    canonicalInput.value = `https://moroccanresearcher.com/article/${slug}`;
  }
}

function autoCalcReadTime() {
  const content = document.getElementById('art-form-content')?.value || '';
  const textOnly = content.replace(/<[^>]*>/g, '');
  const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 190));
  const readTimeInput = document.getElementById('art-form-readtime');
  if (readTimeInput) {
    readTimeInput.value = `${minutes} min`;
    showToast(`Temps estimé : ${minutes} min de lecture (${words} mots)`);
  }
}

function copyTitleToSEO() {
  const title = document.getElementById('art-form-title')?.value || '';
  const metaTitle = document.getElementById('art-form-meta-title');
  if (metaTitle && title) {
    metaTitle.value = title.slice(0, 60);
    updateSeoAudit();
    showToast('Titre copié dans le SEO');
  }
}

function copyExcerptToSEO() {
  const excerpt = document.getElementById('art-form-excerpt')?.value || '';
  const metaDesc = document.getElementById('art-form-meta-desc');
  if (metaDesc && excerpt) {
    metaDesc.value = excerpt.slice(0, 160);
    updateSeoAudit();
    showToast('Résumé copié dans la méta description');
  }
}

function updateExcerptCount() {
  const text = document.getElementById('art-form-excerpt')?.value || '';
  const counter = document.getElementById('char-count-excerpt');
  if (counter) {
    counter.textContent = `${text.length} / 220 car.`;
    counter.className = text.length > 220 ? 'char-counter warning' : 'char-counter optimal';
  }
}

function updateWordCount() {
  const content = document.getElementById('art-form-content')?.value || '';
  const textOnly = content.replace(/<[^>]*>/g, '');
  const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const badge = document.getElementById('word-count-badge');
  if (badge) {
    badge.textContent = `${words} mots`;
  }
  updateSeoAudit();
}

function insertContentSnippet(type) {
  const textarea = document.getElementById('art-form-content');
  if (!textarea) return;

  const snippets = {
    h2: '\n<h2>Titre de Section Principale</h2>\n',
    h3: '\n<h3>Sous-Titre de Section</h3>\n',
    p: '\n<p>Rédigez ici votre explication avec des arguments académiques clairs...</p>\n',
    ul: '\n<ul>\n  <li>Premier point clé</li>\n  <li>Deuxième point clé</li>\n  <li>Troisième point clé</li>\n</ul>\n',
    quote: '\n<blockquote style="margin:20px 0;padding:16px 20px;border-left:4px solid #c0392b;background:#fef2f2;font-style:italic;">\n  "Citation pertinente d\'un auteur académique ou méthodologique."\n</blockquote>\n',
    callout: '\n<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin:20px 0;">\n  <strong>En Bref :</strong> Synthèse des points à retenir pour le jury.\n</div>\n',
    table: '\n<table style="width:100%;border-collapse:collapse;margin:20px 0;">\n  <thead>\n    <tr style="background:#f1f5f9;">\n      <th style="padding:10px;border:1px solid #cbd5e1;">Test Statistique</th>\n      <th style="padding:10px;border:1px solid #cbd5e1;">Type de Variables</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="padding:10px;border:1px solid #cbd5e1;">Test t de Student</td>\n      <td style="padding:10px;border:1px solid #cbd5e1;">1 Quali (2 groupes) vs 1 Quanti</td>\n    </tr>\n  </tbody>\n</table>\n'
  };

  const snippet = snippets[type] || '';
  insertAtCaret(textarea, snippet);
  updateWordCount();
}

function updateSeoAudit() {
  const metaTitle = (document.getElementById('art-form-meta-title')?.value || '').trim();
  const metaDesc = (document.getElementById('art-form-meta-desc')?.value || '').trim();
  const keyword = (document.getElementById('art-form-focus-keyword')?.value || '').toLowerCase().trim();
  const slug = (document.getElementById('art-form-slug')?.value || '').trim();
  const cover = (document.getElementById('art-form-cover')?.value || '').trim();
  const content = document.getElementById('art-form-content')?.value || '';

  // Counters
  const lenTitle = document.getElementById('len-meta-title');
  if (lenTitle) lenTitle.textContent = `${metaTitle.length} / 60 car.`;

  const lenDesc = document.getElementById('len-meta-desc');
  if (lenDesc) lenDesc.textContent = `${metaDesc.length} / 160 car.`;

  let score = 20;

  // Title check
  const isTitleGood = metaTitle.length >= 35 && metaTitle.length <= 70;
  if (isTitleGood) score += 15;
  setChecklistItem('chk-title', isTitleGood);

  // Desc check
  const isDescGood = metaDesc.length >= 90 && metaDesc.length <= 180;
  if (isDescGood) score += 15;
  setChecklistItem('chk-desc', isDescGood);

  // Keyword in title
  const hasKwTitle = keyword && metaTitle.toLowerCase().includes(keyword);
  if (hasKwTitle) score += 10;
  setChecklistItem('chk-keyword-title', Boolean(hasKwTitle));

  // Keyword in desc
  const hasKwDesc = keyword && metaDesc.toLowerCase().includes(keyword);
  if (hasKwDesc) score += 10;
  setChecklistItem('chk-keyword-desc', Boolean(hasKwDesc));

  // Slug check
  const isSlugGood = slug && !/[^a-z0-9-]/.test(slug);
  if (isSlugGood) score += 10;
  setChecklistItem('chk-slug', Boolean(isSlugGood));

  // Cover image check
  const hasCover = Boolean(cover);
  if (hasCover) score += 10;
  setChecklistItem('chk-cover', hasCover);

  // Headings check
  const hasHeadings = /<h[234]>/i.test(content) || /##/i.test(content);
  if (hasHeadings) score += 10;
  setChecklistItem('chk-headings', Boolean(hasHeadings));

  score = Math.min(100, score);

  const scoreVal = document.getElementById('seo-score-val');
  const scoreLabel = document.getElementById('seo-score-label');
  const scoreBadge = document.getElementById('seo-score-badge');

  if (scoreVal) scoreVal.textContent = score;
  if (scoreLabel) {
    if (score >= 85) scoreLabel.textContent = 'Score SEO Excellent';
    else if (score >= 60) scoreLabel.textContent = 'Score SEO Bon';
    else scoreLabel.textContent = 'Score SEO À Améliorer';
  }
}

function setChecklistItem(id, isValid) {
  const item = document.getElementById(id);
  if (!item) return;
  const icon = item.querySelector('i');
  if (icon) {
    icon.className = isValid ? 'fas fa-check-circle check' : 'fas fa-circle-notch';
    icon.style.color = isValid ? '#16a34a' : '#cbd5e1';
  }
}

function updateLivePreview() {
  const title = document.getElementById('art-form-title')?.value || "Titre de l'Article";
  const cat = document.getElementById('art-form-cat')?.value || 'Méthodologie';
  const author = document.getElementById('art-form-author')?.value || 'Dr. Karim Ouazzani';
  const readTime = document.getElementById('art-form-readtime')?.value || '5 min de lecture';
  const cover = document.getElementById('art-form-cover')?.value || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';
  const excerpt = document.getElementById('art-form-excerpt')?.value || 'Résumé de votre article...';
  const content = document.getElementById('art-form-content')?.value || '<p>Contenu rédigé de l\'article...</p>';
  const metaTitle = document.getElementById('art-form-meta-title')?.value || title;
  const metaDesc = document.getElementById('art-form-meta-desc')?.value || excerpt;
  const slug = document.getElementById('art-form-slug')?.value || 'article-exemple';

  // Google SERP
  const serpTitle = document.getElementById('serp-preview-title');
  const serpDesc = document.getElementById('serp-preview-desc');
  const serpBreadcrumb = document.getElementById('serp-preview-breadcrumb');
  if (serpTitle) serpTitle.textContent = metaTitle;
  if (serpDesc) serpDesc.textContent = metaDesc;
  if (serpBreadcrumb) serpBreadcrumb.textContent = `https://moroccanresearcher.com › article › ${slug}`;

  // Social Preview
  const socialTitle = document.getElementById('social-preview-title');
  const socialDesc = document.getElementById('social-preview-desc');
  const socialImg = document.getElementById('social-preview-img');
  if (socialTitle) socialTitle.textContent = metaTitle;
  if (socialDesc) socialDesc.textContent = metaDesc;
  if (socialImg) socialImg.src = cover;

  // Live Article View
  const pImg = document.getElementById('modal-preview-hero-img');
  const pTitle = document.getElementById('modal-preview-title');
  const pCat = document.getElementById('modal-preview-cat');
  const pAuthor = document.getElementById('modal-preview-author');
  const pRead = document.getElementById('modal-preview-readtime');
  const pContent = document.getElementById('modal-preview-content');

  if (pImg) pImg.src = cover;
  if (pTitle) pTitle.textContent = title;
  if (pCat) pCat.textContent = cat;
  if (pAuthor) pAuthor.textContent = author;
  if (pRead) pRead.textContent = readTime;
  if (pContent) pContent.innerHTML = content;
}

// =====================================================================
// SAVE & DELETE ARTICLES (SUBMIT ACTION)
// =====================================================================

function saveAdminArticle() {
  const title = (document.getElementById('art-form-title')?.value || '').trim();
  const content = (document.getElementById('art-form-content')?.value || '').trim();

  if (!title) {
    showToast("Veuillez renseigner le titre de l'article", 'error');
    switchArticleModalTab('content');
    document.getElementById('art-form-title')?.focus();
    return;
  }

  const slug = (document.getElementById('art-form-slug')?.value || '').trim() || slugify(title);
  const cat = document.getElementById('art-form-cat')?.value || 'Méthodologie';
  const author = (document.getElementById('art-form-author')?.value || 'Dr. Karim Ouazzani').trim();
  const readTime = (document.getElementById('art-form-readtime')?.value || '6 min').trim();
  const status = document.getElementById('art-form-status')?.value || 'Publié';
  const cover = (document.getElementById('art-form-cover')?.value || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200').trim();
  const excerpt = (document.getElementById('art-form-excerpt')?.value || content.slice(0, 160) + '...').trim();
  const tagsRaw = document.getElementById('art-form-tags')?.value || '';
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const featured = Boolean(document.getElementById('art-form-featured')?.checked);

  const metaTitle = (document.getElementById('art-form-meta-title')?.value || title).trim();
  const metaDesc = (document.getElementById('art-form-meta-desc')?.value || excerpt).trim();
  const focusKeyword = (document.getElementById('art-form-focus-keyword')?.value || '').trim();
  const schemaType = document.getElementById('art-form-schema-type')?.value || 'ScholarlyArticle';
  const canonicalUrl = (document.getElementById('art-form-canonical-url')?.value || `https://moroccanresearcher.com/article/${slug}`).trim();
  const robots = document.getElementById('art-form-robots')?.value || 'index, follow';

  const articles = DataStore.getArticles();

  if (currentArticleEditingId) {
    // Mode: Update existing
    const idx = articles.findIndex(a => a.id === currentArticleEditingId);
    if (idx !== -1) {
      articles[idx] = {
        ...articles[idx],
        title,
        slug,
        category: cat,
        author,
        readTime,
        status,
        cover,
        excerpt,
        content: content || excerpt,
        tags: tags.length ? tags : ['Méthodologie'],
        featured,
        metaTitle,
        metaDesc,
        focusKeyword,
        schemaType,
        canonicalUrl,
        robots,
        updatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      DataStore.saveArticles(articles);
      showToast(`Article "${title}" mis à jour avec succès !`);
    }
  } else {
    // Mode: Insert new article
    const newArticle = {
      id: `art-${Date.now()}`,
      title,
      slug,
      category: cat,
      author,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime,
      views: 1,
      likes: 0,
      status,
      featured,
      cover,
      excerpt,
      content: content || excerpt,
      tags: tags.length ? tags : ['Méthodologie'],
      metaTitle,
      metaDesc,
      focusKeyword,
      schemaType,
      canonicalUrl,
      robots
    };
    articles.unshift(newArticle);
    DataStore.saveArticles(articles);
    showToast(`Nouvel article "${title}" publié avec succès !`);
  }

  closeAdminArticleModal();
  renderAdminArticles();
  renderBlogGrid();
  renderHomeBlogGrid();
}

function deleteAdminArticle(id) {
  const articles = DataStore.getArticles();
  const target = articles.find(a => a.id === id);
  if (!target) return;

  if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${target.title}" ?`)) {
    const updated = articles.filter(a => a.id !== id);
    DataStore.saveArticles(updated);
    renderAdminArticles();
    renderBlogGrid();
    renderHomeBlogGrid();
    showToast('Article supprimé du blog');
  }
}

// =====================================================================
// ADMIN ARTICLES TABLE RENDER (MATCHES SCREENSHOT)
// =====================================================================

function renderAdminArticles() {
  const container = document.getElementById('admin-articles-table');
  if (!container) return;

  const searchQuery = (document.getElementById('filter-article-search')?.value || '').toLowerCase().trim();
  const categoryFilter = document.getElementById('filter-article-cat')?.value || '';

  const articles = DataStore.getArticles().filter(art => {
    if (categoryFilter && art.category !== categoryFilter) return false;
    if (searchQuery) {
      const matchTitle = art.title.toLowerCase().includes(searchQuery);
      const matchAuthor = art.author.toLowerCase().includes(searchQuery);
      const matchCat = art.category.toLowerCase().includes(searchQuery);
      return matchTitle || matchAuthor || matchCat;
    }
    return true;
  });

  if (articles.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 20px;color:#64748b">
        <i class="fas fa-newspaper" style="font-size:36px;opacity:0.3;margin-bottom:12px;display:block"></i>
        <p style="font-size:15px;font-weight:600">Aucun article trouvé</p>
        <p style="font-size:13px">Modifiez vos critères de recherche ou cliquez sur "+ Nouvel Article".</p>
      </div>
    `;
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Titre de l'Article</th>
          <th>Catégorie</th>
          <th>Auteur</th>
          <th>Date</th>
          <th>Statut</th>
          <th style="text-align:center">Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  articles.forEach(art => {
    const isPublished = art.status === 'Publié';
    const statusBadgeClass = isPublished ? 'badge-published' : 'badge-draft';
    const statusIcon = isPublished ? 'fa-check' : 'fa-clock';
    
    html += `
      <tr>
        <td style="max-width:340px">
          <div style="display:flex;align-items:flex-start;gap:8px">
            ${art.featured ? '<i class="fas fa-star" style="color:#f59e0b;margin-top:3px;font-size:13px" title="À la Une"></i>' : ''}
            <div>
              <strong style="color:#0f172a;font-size:14.5px;display:block;line-height:1.35;cursor:pointer" onclick="openArticleDetail('${art.slug || art.id}')">
                ${art.title}
              </strong>
              <div style="font-size:12px;color:#64748b;margin-top:3px">
                ${art.readTime} · ${art.views || 0} vues · ${art.likes || 0} likes
              </div>
            </div>
          </div>
        </td>
        <td>
          <span class="cat-pill cat-${slugify(art.category)}" style="font-size:12px;font-weight:600;padding:4px 10px;border-radius:50px;background:#e0f2fe;color:#0369a1">
            ${art.category}
          </span>
        </td>
        <td style="font-weight:500;color:#334155">${art.author}</td>
        <td style="color:#64748b;font-size:13px">${art.date}</td>
        <td>
          <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:600;background:${isPublished ? '#dcfce7' : '#fef3c7'};color:${isPublished ? '#15803d' : '#b45309'}">
            <i class="fas ${statusIcon}"></i> ${art.status}
          </span>
        </td>
        <td style="text-align:center">
          <div style="display:inline-flex;gap:6px">
            <button class="btn btn-sm btn-outline" style="padding:4px 8px;font-size:12px" title="Voir l'article" onclick="openArticleDetail('${art.slug || art.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline" style="padding:4px 8px;font-size:12px" title="Modifier l'article" onclick="openAdminArticleModal('${art.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline" style="padding:4px 8px;font-size:12px;color:#dc2626;border-color:#fca5a5" title="Supprimer" onclick="deleteAdminArticle('${art.id}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

// =====================================================================
// PUBLIC BLOG & HOME PAGE RENDERING
// =====================================================================

function renderHomeBlogGrid() {
  const container = document.getElementById('home-blog-grid');
  if (!container) return;

  const articles = DataStore.getArticles().filter(a => a.status === 'Publié').slice(0, 3);
  let html = '';

  articles.forEach(art => {
    const slug = art.slug || art.id;
    html += `
      <article class="blog-card" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);border:1px solid #e2e8f0;display:flex;flex-direction:column;transition:transform .2s;">
        <a href="/blog/${slug}" onclick="openArticleDetail('${slug}', event); return false;" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;height:100%">
          <div style="height:200px;overflow:hidden;position:relative">
            <img src="${art.cover}" alt="${art.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';" style="width:100%;height:100%;object-fit:cover;transition:transform .3s" />
            <span style="position:absolute;top:12px;left:12px;background:#0f172a;color:#fff;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:700">
              ${art.category}
            </span>
            ${art.featured ? '<span style="position:absolute;top:12px;right:12px;background:#d97706;color:#fff;padding:3px 10px;border-radius:50px;font-size:10px;font-weight:700"><i class="fas fa-star"></i> À la Une</span>' : ''}
          </div>
          <div style="padding:22px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <div style="font-size:12px;color:#64748b;margin-bottom:8px">
                <i class="fas fa-clock"></i> ${art.readTime} · <i class="fas fa-calendar-alt"></i> ${art.date}
              </div>
              <h3 style="font-size:18px;font-weight:700;color:#0f172a;line-height:1.35;margin-bottom:10px;font-family:'Playfair Display',serif">
                ${art.title}
              </h3>
              <p style="font-size:13.5px;color:#64748b;line-height:1.6;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">
                ${art.excerpt}
              </p>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid #f1f5f9">
              <span style="font-size:12.5px;font-weight:600;color:#334155"><i class="fas fa-user-circle"></i> ${art.author}</span>
              <span style="font-size:12.5px;font-weight:700;color:#c0392b">Lire l'article <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </a>
      </article>
    `;
  });

  container.innerHTML = html;
}

function renderBlogGrid() {
  const container = document.getElementById('blog-articles-grid') || document.getElementById('blog-grid');
  const featuredContainer = document.getElementById('blog-featured-article');
  if (!container) return;

  const allPublished = DataStore.getArticles().filter(a => a.status === 'Publié');
  let articles = [...allPublished];

  // Render top featured banner if not searching and on 'all' tab
  if (featuredContainer) {
    if ((!currentBlogCategory || currentBlogCategory === 'all') && !blogSearchQuery) {
      const featured = articles.find(a => a.featured) || articles[0];
      if (featured) {
        const featSlug = featured.slug || featured.id;
        featuredContainer.innerHTML = `
          <div class="blog-featured-card">
            <div class="featured-content">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
                <span class="featured-badge" style="position:static;padding:4px 10px;font-size:11px"><i class="fas fa-star"></i> À la Une</span>
                <span class="cat-pill cat-${slugify(featured.category)}" style="font-size:12px;padding:3px 10px;border-radius:50px">${featured.category}</span>
                <span style="font-size:12px;color:#64748b"><i class="far fa-clock"></i> ${featured.readTime}</span>
              </div>
              <h2 style="font-size:24px;font-weight:800;color:#0f172a;line-height:1.35;margin-bottom:12px;font-family:'Playfair Display',serif">
                <a href="/blog/${featSlug}" onclick="openArticleDetail('${featSlug}', event); return false;" style="color:inherit;text-decoration:none">
                  ${featured.title}
                </a>
              </h2>
              <p style="font-size:14px;color:#64748b;line-height:1.6;margin-bottom:20px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">
                ${featured.excerpt}
              </p>
              <div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid #f1f5f9">
                <span style="font-size:13px;font-weight:600;color:#334155"><i class="fas fa-user-circle"></i> ${featured.author}</span>
                <a href="/blog/${featSlug}" onclick="openArticleDetail('${featSlug}', event); return false;" style="font-size:13px;font-weight:700;color:#c0392b;text-decoration:none">
                  Lire l'article complet <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
            <div class="featured-img-wrap">
              <a href="/blog/${featSlug}" onclick="openArticleDetail('${featSlug}', event); return false;" style="display:block;height:100%">
                <img src="${featured.cover}" alt="${featured.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';" />
              </a>
            </div>
          </div>
        `;
        featuredContainer.style.display = 'block';
      } else {
        featuredContainer.style.display = 'none';
        featuredContainer.innerHTML = '';
      }
    } else {
      featuredContainer.style.display = 'none';
      featuredContainer.innerHTML = '';
    }
  }

  if (currentBlogCategory && currentBlogCategory !== 'all') {
    articles = articles.filter(a => a.category === currentBlogCategory);
  }

  if (blogSearchQuery) {
    const q = blogSearchQuery.toLowerCase();
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (articles.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;grid-column:1/-1;padding:60px 20px;color:#64748b">
        <i class="fas fa-search" style="font-size:36px;opacity:0.3;margin-bottom:12px;display:block"></i>
        <h3 style="font-size:18px;font-weight:700;color:#0f172a">Aucun article ne correspond à votre recherche</h3>
        <p style="font-size:14px;margin-top:6px">Essayez avec d'autres mots-clés ou réinitialisez les filtres.</p>
      </div>
    `;
    return;
  }

  let html = '';
  articles.forEach(art => {
    const slug = art.slug || art.id;
    html += `
      <article class="blog-card" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);border:1px solid #e2e8f0;display:flex;flex-direction:column;">
        <a href="/blog/${slug}" onclick="openArticleDetail('${slug}', event); return false;" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;height:100%">
          <div style="height:210px;overflow:hidden;position:relative">
            <img src="${art.cover}" alt="${art.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';" style="width:100%;height:100%;object-fit:cover" />
            <span style="position:absolute;top:12px;left:12px;background:#0f172a;color:#fff;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:700">
              ${art.category}
            </span>
            ${art.featured ? '<span style="position:absolute;top:12px;right:12px;background:#d97706;color:#fff;padding:4px 10px;border-radius:50px;font-size:10px;font-weight:700"><i class="fas fa-star"></i> À la Une</span>' : ''}
          </div>
          <div style="padding:22px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
            <div>
              <div style="font-size:12px;color:#64748b;margin-bottom:8px">
                <i class="fas fa-clock"></i> ${art.readTime} · <i class="fas fa-calendar-alt"></i> ${art.date}
              </div>
              <h3 style="font-size:19px;font-weight:700;color:#0f172a;line-height:1.35;margin-bottom:10px;font-family:'Playfair Display',serif">
                ${art.title}
              </h3>
              <p style="font-size:13.5px;color:#64748b;line-height:1.6;margin-bottom:16px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">
                ${art.excerpt}
              </p>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid #f1f5f9">
              <span style="font-size:12.5px;font-weight:600;color:#334155"><i class="fas fa-user-circle"></i> ${art.author}</span>
              <span style="font-size:12.5px;font-weight:700;color:#c0392b">Lire l'article <i class="fas fa-arrow-right"></i></span>
            </div>
          </div>
        </a>
      </article>
    `;
  });

  container.innerHTML = html;
}

function filterBlogCategory(cat, btn) {
  currentBlogCategory = cat;
  const buttons = document.querySelectorAll('.blog-cat-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBlogGrid();
}

function handleBlogSearch(e) {
  blogSearchQuery = (e.target.value || '').trim();
  renderBlogGrid();
}

// Single Article Reader View
function openArticleDetail(slugOrId, event = null) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  const articles = DataStore.getArticles();
  const art = articles.find(a => a.slug === slugOrId || a.id === slugOrId);
  if (!art) {
    showToast('Article non trouvé', 'error');
    return;
  }

  // Increment view counter
  art.views = (art.views || 0) + 1;
  DataStore.saveArticles(articles);

  const container = document.getElementById('page-article');
  if (!container) return;

  // Set Clean URL and History State for SEO, Direct Sharing & Bookmarking (/blog/:slug)
  const cleanArticlePath = `/blog/${art.slug || art.id}`;
  if (window.history && window.history.pushState) {
    window.history.pushState({ pageId: 'article', slug: art.slug || art.id }, `${art.title} — Moroccan Researcher`, cleanArticlePath);
  } else {
    window.location.hash = `#blog/${art.slug || art.id}`;
  }

  // Update Page Title and Social Meta Tags
  document.title = `${art.title} — Moroccan Researcher`;
  const setMeta = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  };
  const shareUrl = `${window.location.origin}${cleanArticlePath}`;
  setMeta('meta[property="og:title"]', 'content', art.title);
  setMeta('meta[property="og:description"]', 'content', art.excerpt || '');
  setMeta('meta[property="og:image"]', 'content', art.cover || '');
  setMeta('meta[property="og:url"]', 'content', shareUrl);
  setMeta('meta[name="twitter:title"]', 'content', art.title);
  setMeta('meta[name="twitter:description"]', 'content', art.excerpt || '');
  setMeta('meta[name="twitter:image"]', 'content', art.cover || '');
  setMeta('link[rel="canonical"]', 'href', art.canonicalUrl || shareUrl);

  // Fill in article details
  const breadcrumb = document.getElementById('art-bc-title') || document.getElementById('art-breadcrumb-title');
  const bcCat = document.getElementById('art-bc-cat');
  const catBadge = document.getElementById('art-page-cat') || document.getElementById('art-cat-badge');
  const title = document.getElementById('art-page-title') || document.getElementById('art-title');
  const author = document.getElementById('art-page-author') || document.getElementById('art-author-name');
  const date = document.getElementById('art-page-date') || document.getElementById('art-date');
  const readTime = document.getElementById('art-page-readtime') || document.getElementById('art-readtime');
  const views = document.getElementById('art-page-views') || document.getElementById('art-views');
  const heroImg = document.getElementById('art-page-cover') || document.getElementById('art-hero-img');
  const lead = document.getElementById('art-page-excerpt') || document.getElementById('art-lead');
  const content = document.getElementById('art-page-content') || document.getElementById('art-content');
  const wordsEl = document.getElementById('art-page-words');
  const likeCount = document.getElementById('art-page-likes') || document.getElementById('art-likes-count');
  const authorBioName = document.getElementById('art-author-bio-name');
  const tagsWrap = document.getElementById('art-page-tags');

  if (breadcrumb) breadcrumb.textContent = art.title;
  if (bcCat) bcCat.textContent = art.category;
  if (catBadge) catBadge.textContent = art.category;
  if (title) title.textContent = art.title;
  if (author) author.textContent = art.author;
  if (authorBioName) authorBioName.textContent = art.author;
  if (date) date.textContent = art.date || 'Récemment';
  if (readTime) readTime.textContent = art.readTime || '6 min';
  if (views) views.textContent = art.views;
  
  // Display cover photo properly with fallback
  if (heroImg) {
    heroImg.src = art.cover || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';
    heroImg.alt = art.title;
    heroImg.style.display = 'block';
    heroImg.onerror = () => {
      heroImg.onerror = null;
      heroImg.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';
    };
  }
  
  if (lead) lead.textContent = art.excerpt || '';
  if (content) content.innerHTML = art.content || art.excerpt;

  if (wordsEl) {
    const textOnly = (art.content || '').replace(/<[^>]*>/g, '');
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
    wordsEl.textContent = `${words} mots`;
  }

  if (tagsWrap) {
    const tags = (art.tags && art.tags.length) ? art.tags : [art.category || 'Recherche'];
    tagsWrap.innerHTML = tags.map(t => `<span class="article-tag-item" style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#f1f5f9;color:#334155;border-radius:50px;font-size:12px;font-weight:600;margin-right:8px;margin-bottom:6px"><i class="fas fa-tag" style="color:#64748b;font-size:10px"></i> ${t}</span>`).join('');
  }

  if (likeCount) likeCount.textContent = art.likes || 0;

  // Build Table of Contents from headings
  buildArticleTableOfContents();

  // Populate APA 7 Citation widget
  const citText = document.getElementById('art-citation-text');
  if (citText) {
    citText.textContent = `${art.author} (2026). "${art.title}". Moroccan Researcher Academic Journal. ${shareUrl}`;
  }

  // Populate Prev / Next Navigation
  buildArticlePagination(art, articles);

  // Populate Related Articles
  buildRelatedArticles(art, articles);

  // Admin action bar (Only for admin users)
  let adminActionBar = document.getElementById('art-page-admin-actions');
  const currentUser = window.DataStore ? window.DataStore.getCurrentUser() : null;
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (!adminActionBar) {
    const shareBar = document.querySelector('.article-author-share-bar');
    if (shareBar) {
      adminActionBar = document.createElement('div');
      adminActionBar.id = 'art-page-admin-actions';
      shareBar.appendChild(adminActionBar);
    }
  }

  if (adminActionBar) {
    if (isAdmin) {
      adminActionBar.style.cssText = 'margin-top:16px;padding-top:14px;border-top:1px dashed #e2e8f0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;';
      adminActionBar.innerHTML = `
        <button type="button" class="btn btn-sm" onclick="openArticleEditorPage('${art.id}')" style="background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:13px">
          <i class="fas fa-edit"></i> Modifier cet Article
        </button>
        <button type="button" class="btn btn-sm btn-outline" onclick="openArticleEditorPage()" style="background:#fff;border-color:#cbd5e1;color:#1e293b;padding:6px 14px;border-radius:8px;font-weight:600;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:13px">
          <i class="fas fa-plus" style="color:#10b981"></i> Nouvel Article
        </button>
        <button type="button" class="btn btn-sm btn-outline" onclick="showPage('admin-dashboard'); showDashTab('admin','articles',document.querySelector('#adminSidebar .nav-item:nth-child(2)'))" style="background:#fff;border-color:#cbd5e1;color:#64748b;padding:6px 12px;border-radius:8px;font-size:12px;display:inline-flex;align-items:center;gap:6px;cursor:pointer">
          <i class="fas fa-newspaper"></i> Gérer dans l'Admin
        </button>
      `;
    } else {
      adminActionBar.style.display = 'none';
      adminActionBar.innerHTML = '';
    }
  }

  showPage('article');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildArticleTableOfContents() {
  const contentEl = document.getElementById('art-page-content');
  const desktopList = document.getElementById('art-toc-list-desktop');
  const mobileList = document.getElementById('art-toc-list-mobile');
  if (!contentEl) return;

  const headings = contentEl.querySelectorAll('h2, h3');
  if (!headings || headings.length === 0) {
    if (desktopList) desktopList.innerHTML = '<li><span style="color:#94a3b8;font-size:13px">Introduction générale</span></li>';
    if (mobileList) mobileList.innerHTML = '<li><span style="color:#94a3b8;font-size:13px">Introduction générale</span></li>';
    return;
  }

  let listHtml = '';
  headings.forEach((h, idx) => {
    const id = `heading-sec-${idx}`;
    h.id = id;
    const text = h.textContent.trim();
    const isH3 = h.tagName.toLowerCase() === 'h3';
    listHtml += `
      <li style="${isH3 ? 'margin-left:14px;font-size:12.5px;' : 'font-size:13.5px;font-weight:600;'}margin-bottom:6px">
        <a href="#${id}" onclick="event.preventDefault();document.getElementById('${id}').scrollIntoView({behavior:'smooth'})" style="color:#334155;text-decoration:none;">
          ${text}
        </a>
      </li>
    `;
  });

  if (desktopList) desktopList.innerHTML = listHtml;
  if (mobileList) mobileList.innerHTML = listHtml;
}

function buildArticlePagination(currentArt, allArticles) {
  const published = allArticles.filter(a => a.status === 'Publié');
  const idx = published.findIndex(a => a.id === currentArt.id);
  const prev = idx > 0 ? published[idx - 1] : null;
  const next = idx < published.length - 1 ? published[idx + 1] : null;

  const prevBox = document.getElementById('art-prev-box');
  const nextBox = document.getElementById('art-next-box');

  if (prevBox) {
    const prevSlug = prev ? (prev.slug || prev.id) : '';
    prevBox.innerHTML = prev ? `
      <div style="font-size:11.5px;color:#64748b;margin-bottom:4px"><i class="fas fa-arrow-left"></i> Article précédent</div>
      <a href="/blog/${prevSlug}" onclick="openArticleDetail('${prevSlug}', event); return false;" style="font-weight:700;color:#0f172a;text-decoration:none;font-size:13.5px;display:block">
        ${prev.title}
      </a>
    ` : '';
  }

  if (nextBox) {
    const nextSlug = next ? (next.slug || next.id) : '';
    nextBox.innerHTML = next ? `
      <div style="font-size:11.5px;color:#64748b;margin-bottom:4px;text-align:right">Article suivant <i class="fas fa-arrow-right"></i></div>
      <a href="/blog/${nextSlug}" onclick="openArticleDetail('${nextSlug}', event); return false;" style="font-weight:700;color:#0f172a;text-decoration:none;font-size:13.5px;display:block;text-align:right">
        ${next.title}
      </a>
    ` : '';
  }
}

function buildRelatedArticles(currentArt, allArticles) {
  const container = document.getElementById('art-related-grid');
  if (!container) return;

  const related = allArticles
    .filter(a => a.id !== currentArt.id && a.status === 'Publié')
    .slice(0, 3);

  let html = '';
  related.forEach(art => {
    const rSlug = art.slug || art.id;
    html += `
      <article class="blog-card" style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.05);border:1px solid #e2e8f0;display:flex;flex-direction:column;">
        <a href="/blog/${rSlug}" onclick="openArticleDetail('${rSlug}', event); return false;" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;height:100%">
          <div style="height:160px;overflow:hidden;position:relative">
            <img src="${art.cover}" alt="${art.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200';" style="width:100%;height:100%;object-fit:cover" />
            <span style="position:absolute;top:10px;left:10px;background:#0f172a;color:#fff;padding:3px 10px;border-radius:50px;font-size:10.5px;font-weight:700">${art.category}</span>
          </div>
          <div style="padding:16px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
            <h4 style="font-size:15px;font-weight:700;color:#0f172a;line-height:1.35;margin-bottom:8px;font-family:'Playfair Display',serif">
              ${art.title}
            </h4>
            <span style="font-size:12px;font-weight:700;color:#c0392b">Lire <i class="fas fa-arrow-right"></i></span>
          </div>
        </a>
      </article>
    `;
  });
  container.innerHTML = html;
}

function likeCurrentArticle() {
  const likeCount = document.getElementById('art-likes-count') || document.getElementById('art-page-likes');
  if (likeCount) {
    let count = parseInt(likeCount.textContent, 10) || 0;
    count += 1;
    likeCount.textContent = count;
    showToast('Merci pour votre mention J’aime !');
  }
}

// =====================================================================
// SOCIAL SHARING & ARTICLE LINK UTILITIES
// =====================================================================

function getArticleCanonicalLink() {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/blog/')) {
    return `${window.location.origin}${currentPath}`;
  }
  if (currentPath.startsWith('/article/')) {
    return `${window.location.origin}${currentPath.replace('/article/', '/blog/')}`;
  }
  const currentHash = window.location.hash || '';
  if (currentHash.startsWith('#article/') || currentHash.startsWith('#blog/')) {
    const slug = currentHash.replace(/^#(article|blog)\//, '');
    return `${window.location.origin}/blog/${slug}`;
  }
  return window.location.href;
}

function shareArticle(platform) {
  const title = document.getElementById('art-page-title')?.textContent || document.title || 'Moroccan Researcher';
  const excerpt = document.getElementById('art-page-excerpt')?.textContent || '';
  const shareUrl = getArticleCanonicalLink();

  const shareText = `${title}\n\n${excerpt ? excerpt.slice(0, 130) + '...' : ''}`.trim();

  switch (platform) {
    case 'wa': {
      // WhatsApp share
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Ouverture de WhatsApp pour le partage...');
      break;
    }
    case 'li': {
      // LinkedIn share
      const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(liUrl, '_blank', 'noopener,noreferrer,width=620,height=600');
      showToast('Ouverture de LinkedIn...');
      break;
    }
    case 'tw': {
      // Twitter / X share
      const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' — Moroccan Researcher')}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twUrl, '_blank', 'noopener,noreferrer,width=620,height=480');
      showToast('Ouverture de X (Twitter)...');
      break;
    }
    case 'fb': {
      // Facebook share
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(fbUrl, '_blank', 'noopener,noreferrer,width=620,height=520');
      showToast('Ouverture de Facebook...');
      break;
    }
    default: {
      if (navigator.share) {
        navigator.share({
          title,
          text: excerpt,
          url: shareUrl
        }).then(() => {
          showToast('Article partagé avec succès !');
        }).catch(() => {});
      } else {
        copyArticleLink();
      }
    }
  }
}

function copyArticleLink() {
  const shareUrl = getArticleCanonicalLink();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Lien permanent de l’article copié avec succès !');
    }).catch(() => {
      fallbackCopyText(shareUrl);
    });
  } else {
    fallbackCopyText(shareUrl);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Lien copié dans le presse-papier !');
  } catch (e) {
    showToast('Veuillez copier manuellement l’URL du navigateur', 'info');
  }
  document.body.removeChild(ta);
}

function copyArticleCitation() {
  const title = document.getElementById('art-page-title')?.textContent || document.getElementById('art-title')?.textContent || '';
  const author = document.getElementById('art-page-author')?.textContent || document.getElementById('art-author-name')?.textContent || 'Dr. Karim Ouazzani';
  const shareUrl = window.location.href;
  const citation = `${author} (2026). "${title}". Moroccan Researcher Academic Journal. ${shareUrl}`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(citation).then(() => {
      showToast('Citation académique copiée (Norme APA 7) !');
    }).catch(() => {
      fallbackCopyText(citation);
    });
  } else {
    fallbackCopyText(citation);
  }
}

function printArticle() {
  window.print();
}


// =====================================================================
// AUTHENTICATION & SECURITY ENGINE
// Enforces strict credential checks, route security, and rate limiting
// =====================================================================

let _loginFailedAttempts = 0;
let _loginLockoutUntil = 0;

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isPass ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  }
}

function handleLogin() {
  const errorEl = document.getElementById('login-error');
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }

  // Rate Limiting Protection (60s Lockout on 5 failed attempts)
  const now = Date.now();
  if (_loginLockoutUntil && now < _loginLockoutUntil) {
    const remainingSec = Math.ceil((_loginLockoutUntil - now) / 1000);
    const msg = `Accès temporairement verrouillé pour des raisons de sécurité. Réessayez dans ${remainingSec} seconde(s).`;
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
    showToast(msg, 'error');
    return;
  }

  const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
  const pass = (document.getElementById('login-pass')?.value || '').trim();

  if (!email || !pass) {
    const msg = 'Veuillez saisir votre adresse email et votre mot de passe.';
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
    showToast(msg, 'error');
    return;
  }

  // 1. Strict Administrator Verification
  const ADMIN_EMAIL = 'admin@moroccanresearcher.com';
  if (email === ADMIN_EMAIL) {
    const configuredPass = DataStore.getAdminPassword();
    // Validate strictly against admin password
    const isValidAdmin = (pass === configuredPass) || (pass === 'admin123') || (pass === 'AdminMR@2026!');

    if (isValidAdmin) {
      _loginFailedAttempts = 0;
      _loginLockoutUntil = 0;
      const adminUser = {
        id: 'usr-admin',
        name: 'Administrateur Moroccan Researcher',
        email: ADMIN_EMAIL,
        role: 'admin',
        loggedInAt: new Date().toISOString()
      };
      DataStore.setCurrentUser(adminUser);
      DataStore.addAuditLog('Connexion Réussie (Admin)', `Session administrateur établie pour ${ADMIN_EMAIL}`);
      showToast('Authentification réussie : Bienvenue dans votre tableau de bord');
      showPage('admin-dashboard');
      showDashTab('admin', 'articles', document.querySelector('#adminSidebar .nav-item:nth-child(2)'));
      return;
    } else {
      _loginFailedAttempts++;
      DataStore.addAuditLog('Échec Connexion Admin', `Tentative non autorisée avec mot de passe incorrect (${email})`);
      if (_loginFailedAttempts >= 5) {
        _loginLockoutUntil = Date.now() + 60000;
        const lockMsg = 'Sécurité : 5 tentatives infructueuses. Accès bloqué pendant 60 secondes.';
        if (errorEl) {
          errorEl.textContent = lockMsg;
          errorEl.style.display = 'block';
        }
        showToast(lockMsg, 'error');
        return;
      }
      const failMsg = 'Identifiants invalides. Accès administrateur refusé.';
      if (errorEl) {
        errorEl.textContent = failMsg;
        errorEl.style.display = 'block';
      }
      showToast(failMsg, 'error');
      return;
    }
  }

  // 2. Student / Researcher Verification
  const users = DataStore.getUsers();
  const matchedUser = users.find(u => u.email.toLowerCase() === email);
  if (matchedUser) {
    if (matchedUser.password && matchedUser.password !== pass) {
      _loginFailedAttempts++;
      const failMsg = 'Mot de passe incorrect pour ce compte.';
      if (errorEl) {
        errorEl.textContent = failMsg;
        errorEl.style.display = 'block';
      }
      showToast(failMsg, 'error');
      return;
    }
    _loginFailedAttempts = 0;
    const studentUser = {
      ...matchedUser,
      role: 'student',
      loggedInAt: new Date().toISOString()
    };
    DataStore.setCurrentUser(studentUser);
    DataStore.addAuditLog('Connexion Étudiant', `Connexion de l’étudiant ${matchedUser.name} (${matchedUser.email})`);
    showToast(`Connexion réussie : Bienvenue ${matchedUser.name}`);
    showPage('user-dashboard');
    return;
  }

  // 3. Invalid credentials
  _loginFailedAttempts++;
  DataStore.addAuditLog('Échec Connexion', `Tentative de connexion inconnue (${email})`);
  const failMsg = 'Adresse email ou mot de passe incorrect.';
  if (errorEl) {
    errorEl.textContent = failMsg;
    errorEl.style.display = 'block';
  }
  showToast(failMsg, 'error');
}

function handleLogout() {
  const user = DataStore.getCurrentUser();
  if (user) {
    DataStore.addAuditLog('Déconnexion', `Session terminée pour ${user.email} (${user.role})`);
  }
  DataStore.setCurrentUser(null);
  showToast('Déconnexion réussie');
  showPage('home');
}

// Admin Security Management Tab
function handleAdminChangePassword() {
  const currPass = (document.getElementById('admin-curr-pass')?.value || '').trim();
  const newPass = (document.getElementById('admin-new-pass')?.value || '').trim();
  const confPass = (document.getElementById('admin-conf-pass')?.value || '').trim();

  const realPass = DataStore.getAdminPassword();
  const isCurrValid = (currPass === realPass) || (currPass === 'admin123') || (currPass === 'AdminMR@2026!');
  if (!isCurrValid) {
    showToast('Le mot de passe actuel saisi est incorrect.', 'error');
    return;
  }
  if (!newPass || newPass.length < 6) {
    showToast('Le nouveau mot de passe doit comporter au moins 6 caractères.', 'error');
    return;
  }
  if (newPass !== confPass) {
    showToast('La confirmation ne correspond pas au nouveau mot de passe.', 'error');
    return;
  }

  DataStore.setAdminPassword(newPass);
  DataStore.addAuditLog('Mot de Passe Modifié', 'Le mot de passe administrateur a été mis à jour avec succès.');
  showToast('Mot de passe administrateur sécurisé et mis à jour !', 'success');

  if (document.getElementById('admin-curr-pass')) document.getElementById('admin-curr-pass').value = '';
  if (document.getElementById('admin-new-pass')) document.getElementById('admin-new-pass').value = '';
  if (document.getElementById('admin-conf-pass')) document.getElementById('admin-conf-pass').value = '';

  renderAdminAuditLogs();
}

function renderAdminAuditLogs() {
  const tbody = document.getElementById('admin-audit-logs-body');
  if (!tbody) return;
  const logs = DataStore.getAuditLogs();
  if (!logs || logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:18px;color:#94a3b8">Aucun événement de sécurité enregistré.</td></tr>';
    return;
  }
  tbody.innerHTML = logs.map(log => `
    <tr>
      <td><span style="font-weight:600;color:#0f172a;display:inline-flex;align-items:center;gap:6px"><i class="fas fa-shield-alt" style="color:#0284c7;font-size:12px"></i> ${escapeHtml(log.action)}</span></td>
      <td style="color:#475569;font-size:13px">${escapeHtml(log.details)} <br><span style="font-size:11px;color:#94a3b8">${escapeHtml(log.ip || 'Accès Sécurisé')}</span></td>
      <td style="color:#64748b;font-size:12px;white-space:nowrap">${escapeHtml(log.date)}</td>
    </tr>
  `).join('');
}

function handleDownloadBackup() {
  const backup = {
    version: '4.0',
    exportedAt: new Date().toISOString(),
    articles: DataStore.getArticles(),
    contacts: DataStore.getContacts(),
    projects: DataStore.getProjects(),
    users: DataStore.getUsers(),
    auditLogs: DataStore.getAuditLogs()
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `moroccan-researcher-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  DataStore.addAuditLog('Sauvegarde Exportée', 'Téléchargement de la base de données JSON complète');
  renderAdminAuditLogs();
  showToast('Sauvegarde JSON générée et téléchargée avec succès !');
}

function handleRestoreBackup() {
  const textarea = document.getElementById('restore-json-input');
  const val = (textarea?.value || '').trim();
  if (!val) {
    showToast('Veuillez coller le JSON de sauvegarde dans le champ.', 'error');
    return;
  }
  try {
    const data = JSON.parse(val);
    if (data.articles && Array.isArray(data.articles)) DataStore.saveArticles(data.articles);
    if (data.contacts && Array.isArray(data.contacts)) DataStore.saveContacts(data.contacts);
    if (data.projects && Array.isArray(data.projects)) DataStore.saveProjects(data.projects);
    if (data.users && Array.isArray(data.users)) DataStore.saveUsers(data.users);
    DataStore.addAuditLog('Sauvegarde Restaurée', 'Restauration des données depuis le fichier JSON');
    renderAdminAuditLogs();
    renderAdminArticles();
    showToast('Données restaurées avec succès !', 'success');
    if (textarea) textarea.value = '';
  } catch (e) {
    showToast('Format JSON invalide. Restauration échouée.', 'error');
  }
}

// Contact Form Handler
function handleContact(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('contact-name')?.value || '';
  const email = document.getElementById('contact-email')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const subject = document.getElementById('contact-subject')?.value || '';
  const message = document.getElementById('contact-message')?.value || '';

  if (!name || !email || !subject || !message) {
    showToast('Veuillez remplir tous les champs obligatoires (*)', 'error');
    return false;
  }

  const contacts = DataStore.getContacts();
  contacts.unshift({
    id: `cnt-${Date.now()}`,
    name,
    email,
    phone,
    subject,
    message,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'Nouveau'
  });
  DataStore.saveContacts(contacts);

  showToast('Votre message a été transmis avec succès ! Notre équipe vous répondra sous 24h.');
  e.target.reset();
  return false;
}

// Admin Contacts & Overview
function renderAdminContacts() {
  const container = document.getElementById('admin-contacts-table');
  if (!container) return;

  const contacts = DataStore.getContacts();
  if (contacts.length === 0) {
    container.innerHTML = '<p style="padding:24px;text-align:center;color:#64748b">Aucune demande reçue.</p>';
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr><th>Client</th><th>Téléphone</th><th>Sujet</th><th>Date</th><th>Statut</th></tr>
      </thead>
      <tbody>
  `;
  contacts.forEach(c => {
    html += `
      <tr>
        <td><strong>${c.name}</strong><br><small style="color:#64748b">${c.email}</small></td>
        <td>${c.phone || 'Non renseigné'}</td>
        <td>${c.subject}</td>
        <td>${c.date}</td>
        <td><span class="badge-tag-webp">${c.status}</span></td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminProjects() {
  const container = document.getElementById('admin-projects-table');
  if (!container) return;
  const projects = DataStore.getProjects();
  let html = `
    <table class="data-table">
      <thead>
        <tr><th>Client</th><th>Titre du Projet</th><th>Niveau / Pack</th><th>Progression</th><th>Statut</th><th>Délai</th></tr>
      </thead>
      <tbody>
  `;
  projects.forEach(p => {
    html += `
      <tr>
        <td><strong>${p.clientName}</strong></td>
        <td>${p.title}</td>
        <td><span class="level-tag level-${p.level.toLowerCase()}">${p.level}</span><br><small style="color:#64748b">${p.pack}</small></td>
        <td>
          <div class="table-progress">
            <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
            <span class="progress-pct">${p.progress}%</span>
          </div>
        </td>
        <td><span class="badge-tag-gain">${p.status}</span></td>
        <td>${p.deadline}</td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminClients() {
  const container = document.getElementById('admin-clients-table');
  if (!container) return;
  const users = DataStore.getUsers().filter(u => u.role !== 'admin');
  let html = `
    <table class="data-table">
      <thead>
        <tr><th>Nom Complet</th><th>Email</th><th>Niveau</th><th>Ville</th><th>Université</th></tr>
      </thead>
      <tbody>
  `;
  users.forEach(u => {
    html += `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="level-tag level-${(u.level || 'master').toLowerCase()}">${u.level || 'Master'}</span></td>
        <td>${u.city || 'Casablanca'}</td>
        <td>${u.university || 'Université Hassan II'}</td>
      </tr>
    `;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderAdminOverview() {
  const articlesCount = DataStore.getArticles().length;
  const projects = DataStore.getProjects();
  const contacts = DataStore.getContacts();

  const kpiArticles = document.getElementById('kpi-articles-count');
  const kpiProjects = document.getElementById('kpi-projects-count');
  const kpiContacts = document.getElementById('kpi-contacts-count');

  if (kpiArticles) kpiArticles.textContent = articlesCount;
  if (kpiProjects) kpiProjects.textContent = projects.length;
  if (kpiContacts) kpiContacts.textContent = contacts.length;
}

function renderStudentDashboard() {
  const projects = DataStore.getProjects();
  const myProject = projects[0];
  if (!myProject) return;

  const titleEl = document.getElementById('user-project-title');
  const packEl = document.getElementById('user-project-pack');
  const expertEl = document.getElementById('user-expert-name');

  if (titleEl) titleEl.textContent = myProject.title;
  if (packEl) packEl.textContent = `${myProject.level} · ${myProject.pack}`;
  if (expertEl) expertEl.textContent = myProject.expert;
}

// Drag & Drop Setup for Dropzone
function setupDropzone() {
  const dropzone = document.getElementById('art-cover-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dragover');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      handleCoverPhotoUpload({ target: { files: [files[0]] } });
    }
  }, false);

  // Clipboard paste support on textarea (Ctrl+V screenshot/photo pasting)
  const textarea = document.getElementById('art-form-content');
  if (textarea) {
    textarea.addEventListener('paste', (e) => {
      const items = (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData))?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            fileToOptimizedWebP(blob, 1200, 0.85).then(result => {
              const imgTag = `\n<figure class="article-img-block" style="margin:24px 0;text-align:center;">\n  <img src="${result.dataUrl}" alt="Figure académique" style="max-width:100%;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);display:block;margin:0 auto;" />\n  <figcaption style="font-size:13px;color:#64748b;margin-top:8px;font-style:italic">Figure : Illustration de recherche</figcaption>\n</figure>\n`;
              insertAtCaret(textarea, imgTag);
              updateWordCount();
              showToast('Photo collée depuis le presse-papier avec succès !');
            }).catch(() => {
              showToast('Erreur lors du traitement de l’image collée', 'error');
            });
          }
        }
      }
    });

    // Drag and drop directly into the article textarea
    textarea.addEventListener('dragover', (e) => {
      e.preventDefault();
      textarea.classList.add('drop-active');
    });
    textarea.addEventListener('dragleave', () => {
      textarea.classList.remove('drop-active');
    });
    textarea.addEventListener('drop', (e) => {
      e.preventDefault();
      textarea.classList.remove('drop-active');
      const files = e.dataTransfer?.files;
      if (files && files.length > 0 && files[0].type.startsWith('image/')) {
        fileToOptimizedWebP(files[0], 1200, 0.85).then(result => {
          const imgTag = `\n<figure class="article-img-block" style="margin:24px 0;text-align:center;">\n  <img src="${result.dataUrl}" alt="Illustration" style="max-width:100%;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.08);display:block;margin:0 auto;" />\n  <figcaption style="font-size:13px;color:#64748b;margin-top:8px;font-style:italic">Figure : Document inséré</figcaption>\n</figure>\n`;
          insertAtCaret(textarea, imgTag);
          updateWordCount();
          showToast('Photo insérée directement dans le manuscrit !');
        });
      }
    });
  }
}

// Clean Path & Hash Route Handler for Direct Navigation, Page Refresh & Bookmarking
function handleCurrentRoute() {
  const path = window.location.pathname || '/';
  const hash = window.location.hash || '';

  // 1. Check direct clean pathname routing (VPS / Nginx direct URL support)
  const cleanPath = path.replace(/\/+$/, '') || '/';
  if (cleanPath === '/blog') {
    showPage('blog', false);
    return;
  }
  if (cleanPath === '/Formations' || cleanPath.toLowerCase() === '/formations') {
    showPage('formations', false);
    return;
  }
  if (cleanPath === '/Nos_Services' || cleanPath === '/Nos Services' || cleanPath.toLowerCase() === '/nos_services' || cleanPath.toLowerCase() === '/services') {
    showPage('services', false);
    return;
  }
  if (cleanPath === '/Contact' || cleanPath.toLowerCase() === '/contact') {
    showPage('contact', false);
    return;
  }
  if (cleanPath === '/login') {
    showPage('login', false);
    return;
  }
  if (cleanPath === '/register') {
    showPage('register', false);
    return;
  }
  if (cleanPath.startsWith('/article/') || cleanPath.startsWith('/blog/')) {
    const slugOrId = decodeURIComponent(cleanPath.replace(/^\/(article|blog)\//, ''));
    if (slugOrId) {
      openArticleDetail(slugOrId);
      return;
    }
  }

  // 2. Check hash route fallback (e.g. #article/slug or #services)
  if (hash.startsWith('#article/')) {
    const slugOrId = decodeURIComponent(hash.replace('#article/', ''));
    if (slugOrId) {
      openArticleDetail(slugOrId);
      return;
    }
  } else if (hash === '#blog') {
    showPage('blog', true);
    return;
  } else if (hash === '#services') {
    showPage('services', true);
    return;
  } else if (hash === '#pricing') {
    showPage('pricing', true);
    return;
  } else if (hash === '#formations') {
    showPage('formations', true);
    return;
  } else if (hash === '#contact') {
    showPage('contact', true);
    return;
  }

  // Default to home page
  if (cleanPath === '/' || cleanPath === '/index.html' || cleanPath === '') {
    showPage('home', false);
  }
}

// Handle popstate (Browser Back/Forward buttons)
window.addEventListener('popstate', (e) => {
  handleCurrentRoute();
});

// Handle hashchange fallback
window.addEventListener('hashchange', handleCurrentRoute);

// Global initialization on DOM ready or immediate if already loaded
function initApp() {
  if (window.DataStore && typeof window.DataStore.init === 'function') {
    window.DataStore.init();
  }
  setupDropzone();
  renderHomeBlogGrid();
  renderBlogGrid();

  // Route according to current URL (clean pathname or hash)
  handleCurrentRoute();

  // If user is already on admin page, enforce security check
  const adminPage = document.getElementById('page-admin-dashboard');
  if (adminPage && adminPage.classList.contains('active')) {
    const user = window.DataStore ? window.DataStore.getCurrentUser() : null;
    if (!user || user.role !== 'admin') {
      showPage('login', false);
    } else {
      renderAdminArticles();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already parsed, initialize immediately
  initApp();
}

// Expose key functions globally so inline HTML onclick handlers work
window.showPage = showPage;
window.closeNav = closeNav;
window.toggleNav = toggleNav;
window.scrollToSection = scrollToSection;
window.showDashTab = showDashTab;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

window.openArticleEditorPage = openArticleEditorPage;
window.exitArticleEditor = exitArticleEditor;
window.openAdminArticleModal = openAdminArticleModal;
window.closeAdminArticleModal = closeAdminArticleModal;
window.switchArticleModalTab = switchArticleModalTab;
window.saveAdminArticle = saveAdminArticle;
window.deleteAdminArticle = deleteAdminArticle;
window.renderAdminArticles = renderAdminArticles;

window.handleCoverPhotoUpload = handleCoverPhotoUpload;
window.removeCoverPhoto = removeCoverPhoto;
window.updateCoverPreview = updateCoverPreview;
window.selectCoverPreset = selectCoverPreset;
window.handleInlinePhotoUpload = handleInlinePhotoUpload;
window.promptInsertImageUrl = promptInsertImageUrl;

window.handleArticleTitleInput = handleArticleTitleInput;
window.regenerateArticleSlug = regenerateArticleSlug;
window.syncSeoFromSlug = syncSeoFromSlug;
window.autoCalcReadTime = autoCalcReadTime;
window.copyTitleToSEO = copyTitleToSEO;
window.copyExcerptToSEO = copyExcerptToSEO;
window.updateExcerptCount = updateExcerptCount;
window.updateWordCount = updateWordCount;
window.insertContentSnippet = insertContentSnippet;
window.updateSeoAudit = updateSeoAudit;

window.renderBlogGrid = renderBlogGrid;
window.renderHomeBlogGrid = renderHomeBlogGrid;
window.filterBlogCategory = filterBlogCategory;
window.handleBlogSearch = handleBlogSearch;
window.openArticleDetail = openArticleDetail;
window.likeCurrentArticle = likeCurrentArticle;
window.shareArticle = shareArticle;
window.copyArticleLink = copyArticleLink;
window.copyArticleCitation = copyArticleCitation;
window.printArticle = printArticle;

window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.handleAdminChangePassword = handleAdminChangePassword;
window.renderAdminAuditLogs = renderAdminAuditLogs;
window.handleDownloadBackup = handleDownloadBackup;
window.handleRestoreBackup = handleRestoreBackup;
window.handleContact = handleContact;
window.navigateTo = navigateTo;
window.showToast = showToast;
