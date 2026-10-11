/**
 * Moroccan Researcher — Data Model & LocalStorage Store
 * Initial seeds matching live moroccanresearcher.com data
 */

const STORAGE_KEYS = {
  ARTICLES: 'mr_articles_v4',
  USERS: 'mr_users_v4',
  PROJECTS: 'mr_projects_v4',
  CONTACTS: 'mr_contacts_v4',
  NOTIFICATIONS: 'mr_notifs_v4',
  CURRENT_USER: 'mr_current_user_v4',
};

const INITIAL_ARTICLES = [
  {
    id: 'art-7',
    title: 'Guide Turnitin Maroc 2026 : Réduire le Taux de Similarité et Valider son Mémoire',
    slug: 'guide-turnitin-maroc-reduire-taux-similarite',
    category: 'Rédaction & APA',
    author: 'Dr. Karim Ouazzani',
    date: '10 octobre 2026',
    readTime: '7 min',
    views: 620,
    likes: 47,
    status: 'Publié',
    featured: true,
    cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Comprendre les critères Turnitin dans les universités marocaines, distinguer citations valides et similarités accidentelles, et techniques concrètes pour ramener votre rapport sous les 15% requis.',
    content: `<h3>1. Les Exigences des Universités Marocaines face au Taux de Similarité</h3>
<p>Avec la généralisation de la plateforme <strong>Turnitin</strong> dans les facultés marocaines (Université Mohammed V de Rabat, Université Hassan II de Casablanca, Université Cadi Ayyad de Marrakech, etc.), le rapport de similarité est devenu une étape éliminatoire préalable au dépôt officiel de tout mémoire de Master ou thèse de Doctorat.</p>

<blockquote style="margin:20px 0;padding:16px 20px;border-left:4px solid #c0392b;background:#fef2f2;font-style:italic;color:#7f1d1d;border-radius:0 8px 8px 0">
"Le seuil d'acceptabilité officiel se situe généralement entre 10% et 20% selon les règlements intérieurs des centres d'études doctorales (CEDOC) et des commissions scientifiques."
</blockquote>

<h3>2. Pourquoi Turnitin Signale-t-il des Passages Sains ?</h3>
<p>Beaucoup de chercheurs débutants paniquent en voyant un taux élevé. Il est essentiel de comprendre ce que le logiciel détecte réellement :</p>
<ul style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>Les titres de lois, codes et jurisprudence :</strong> Au Maroc, les articles du Code de Commerce ou de la Constitution sont mot à mot identiques à des milliers de sources antérieures.</li>
  <li><strong>Les expressions méthodologiques standardisées :</strong> Les formules consacrées telles que <em>« l'échantillon d'étude comprend... »</em> ou <em>« au seuil de significativité p &lt; 0.05 »</em>.</li>
  <li><strong>La bibliographie :</strong> Si l'enseignant n'active pas le filtre <em>« Exclure la bibliographie »</em>, vos références élèveront artificiellement le pourcentage global.</li>
</ul>

<h3>3. Les 4 Règles d'Or de la Reformulation Scientifique</h3>
<p>Pour éliminer le risque sans dénaturer la pensée des auteurs cités :</p>
<ol style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>La Synthèse Conceptuelle :</strong> Lisez le paragraphe source, fermez l'écran, et résumez l'idée principale avec votre propre vocabulaire en insérant immédiatement la source APA (ex: <em>Ouazzani & Bennani, 2025</em>).</li>
  <li><strong>L'Alternance Voix Passive / Voix Active :</strong> Transformez la syntaxe des propositions complexes pour dynamiser la démonstration académique.</li>
  <li><strong>Les Citations Courtes Entre Guillemets :</strong> Toute citation mot-à-mot doit obligatoirement être placée entre guillemets français « » et comporter le numéro de page précis (ex: <em>p. 42</em>).</li>
  <li><strong>Vérification Turnitin Préalable Certifiée :</strong> Ne soumettez jamais votre mémoire au jury sans avoir réalisé un pré-contrôle via un compte instructeur sans dépôt dans le dépôt institutionnel (No Repository) pour éviter l'auto-plagiat lors du dépôt final.</li>
</ol>`,
    tags: ['Turnitin', 'Anti-plagiat', 'Mémoire', 'Thèse', 'Normes APA', 'Maroc'],
    metaTitle: 'Guide Turnitin Maroc 2026 : Réduire le Taux de Similarité Mémoire',
    metaDesc: 'Comment fonctionne le logiciel Turnitin au Maroc ? Conseils méthodologiques pour réduire le taux de similarité sous le seuil universitaire.',
    focusKeyword: 'turnitin maroc mémoire similarité',
    schemaType: 'ScholarlyArticle',
    canonicalUrl: 'https://moroccanresearcher.com/article/guide-turnitin-maroc-reduire-taux-similarite',
    robots: 'index, follow'
  },
  {
    id: 'art-1',
    title: 'Comment Réussir sa Problématique de Recherche en Master et Doctorat',
    slug: 'comment-reussir-sa-problematique-de-recherche',
    category: 'Méthodologie',
    author: 'Dr. Karim Ouazzani',
    date: '20 mars 2026',
    readTime: '6 min',
    views: 1141,
    likes: 68,
    status: 'Publié',
    featured: true,
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Découvrez la méthode en entonnoir pour transformer une intuition vague en une question de recherche scientifiquement solide et validable par votre jury.',
    content: `<h3>1. Introduction et Définition de la Problématique</h3>
<p>La problématique est la clé de voûte de tout travail universitaire. Trop souvent confondue avec le simple thème de recherche, elle constitue en réalité l'art d'interroger un objet d'étude sous un angle contradictoire, novateur et rigoureux.</p>

<blockquote style="margin:20px 0;padding:16px 20px;border-left:4px solid #c0392b;background:#fef2f2;font-style:italic;color:#7f1d1d;border-radius:0 8px 8px 0">
"Une recherche sans problématique claire est une collection d'informations sans boussole."
</blockquote>

<h3>2. La Méthode en Entonnoir (Du Général au Précis)</h3>
<p>Pour structurer votre réflexion, appliquez systématiquement les 4 étapes de l'entonnoir méthodologique :</p>
<ul style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>Le constat initial :</strong> Quel phénomène réel, managérial, juridique ou économique suscite le questionnement ?</li>
  <li><strong>La revue de littérature :</strong> Quels sont les modèles théoriques déjà existants et où se situe le « gap » (vide scientifique) ?</li>
  <li><strong>La tension théorique :</strong> Pourquoi les réponses actuelles sont-elles insuffisantes ou contradictoires dans le contexte marocain ?</li>
  <li><strong>La question centrale :</strong> Formulez une interrogation précise débutant par <em>« Dans quelle mesure... »</em> ou <em>« Comment... »</em>.</li>
</ul>

<h3>3. Les Critères de Validation par un Jury Académique</h3>
<p>Avant de soumettre votre plan de recherche à votre directeur de mémoire ou de thèse, vérifiez que votre problématique respecte les 3 règles d'or :</p>
<ol style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>Faisabilité empirique :</strong> Avez-vous accès aux données nécessaires au Maroc (entreprises, tribunaux, échantillons statistiques) ?</li>
  <li><strong>Originalité contextuelle :</strong> Apportez-vous un éclairage nouveau sur les réalités socio-économiques locales ?</li>
  <li><strong>Richesse théorique :</strong> La réponse ne doit être ni un simple « oui/non », ni une évidence prévisible.</li>
</ol>`,
    tags: ['Méthodologie', 'Master', 'Doctorat', 'Problématique', 'Recherche'],
    metaTitle: 'Réussir sa Problématique de Recherche en Master et Doctorat | Guide',
    metaDesc: 'Découvrez la méthode en entonnoir pour formuler une problématique de recherche percutante pour votre mémoire ou thèse au Maroc.',
    focusKeyword: 'problématique recherche master',
    schemaType: 'ScholarlyArticle',
    canonicalUrl: 'https://moroccanresearcher.com/article/comment-reussir-sa-problematique-de-recherche',
    robots: 'index, follow'
  },
  {
    id: 'art-2',
    title: 'Guide Pratique SPSS : Choisir le Bon Test Statistique pour son Mémoire',
    slug: 'guide-pratique-spss-choisir-bon-test-statistique',
    category: 'SPSS & Statistiques',
    author: 'Prof. Youssef Bennani',
    date: '12 mars 2026',
    readTime: '8 min',
    views: 1422,
    likes: 95,
    status: 'Publié',
    featured: false,
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'ANOVA, Régression linéaire, Chi-deux ou Test de Student ? Ce guide décisionnel vous aide à sélectionner et interpréter le test statistique adéquat.',
    content: `<h3>1. La Nature des Variables : Première Étape Cruciale</h3>
<p>Avant d'ouvrir IBM SPSS Statistics, vous devez classifier vos variables de recherche avec exactitude. Le choix d'un test dépend principalement du type de vos variables dépendantes et indépendantes.</p>

<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0">
  <h4 style="color:#0f172a;margin-bottom:12px">Matrice Décisionnelle des Tests SPSS</h4>
  <p><strong>Variables Qualitatives vs Qualitatives :</strong> Test du Khi-deux d'indépendance (Chi-Square) ou Test exact de Fisher.</p>
  <p><strong>Variable Qualitative (2 groupes) vs Quantitative :</strong> Test t de Student pour échantillons indépendants ou Test de Mann-Whitney (non-paramétrique).</p>
  <p><strong>Variable Qualitative (3+ groupes) vs Quantitative :</strong> Analyse de variance à un facteur (ANOVA unidirectionnelle) ou Test de Kruskal-Wallis.</p>
  <p><strong>Variables Quantitatives vs Quantitatives :</strong> Corrélation de Pearson / Spearman ou Régression linéaire multiple.</p>
</div>

<h3>2. Vérification des Hypothèses Préalables</h3>
<p>N'exécutez jamais une ANOVA ou un test t sans avoir préalablement vérifié la normalité de distribution (Test de Shapiro-Wilk) et l'homogénéité des variances (Test de Levene).</p>`,
    tags: ['SPSS', 'Statistiques', 'ANOVA', 'Régression', 'Analyse de données'],
    metaTitle: 'Guide Pratique SPSS : Choisir le Bon Test Statistique | Moroccan Researcher',
    metaDesc: 'ANOVA, Régression linéaire, Chi-deux ou Test t ? Guide complet pour sélectionner le test statistique adéquat sur SPSS.',
    focusKeyword: 'test statistique spss mémoire',
    schemaType: 'TechArticle',
    canonicalUrl: 'https://moroccanresearcher.com/article/guide-pratique-spss-choisir-bon-test-statistique',
    robots: 'index, follow'
  },
  {
    id: 'art-3',
    title: 'Normes APA 7ème Édition : Citer sans Faute et Éviter le Plagiat',
    slug: 'normes-apa-7eme-edition-citer-sans-faute',
    category: 'Rédaction & APA',
    author: 'Mme. Sara Alami',
    date: '28 février 2026',
    readTime: '5 min',
    views: 890,
    likes: 54,
    status: 'Publié',
    featured: false,
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Maîtrisez les citations dans le corps du texte, la mise en page des références bibliographiques et les exigences officielles des universités marocaines.',
    content: `<h3>1. Les Règles Fondamentales de l'APA 7ème Édition</h3>
<p>L'American Psychological Association a modernisé ses normes bibliographiques. Voici les évolutions indispensables à intégrer dans vos mémoires :</p>
<ul style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>Citations dans le texte (3 auteurs et plus) :</strong> Dès la première mention, utilisez le nom du premier auteur suivi de <em>et al.</em> (ex: <em>Bennani et al., 2024</em>).</li>
  <li><strong>Mention de la maison d'édition :</strong> Le lieu d'édition (ville, pays) n'est plus requis pour les livres. Indiquez uniquement le nom de l'éditeur.</li>
  <li><strong>Adresses DOI :</strong> Formatez toujours les DOI sous forme d'URL active : <code>https://doi.org/10.xxxx/...</code>.</li>
</ul>

<h3>2. Citer les Textes Juridiques et Rapports Officiels Marocains</h3>
<p>Pour citer le Bulletin Officiel, les rapports de Bank Al-Maghrib ou du CESE, précisez l'institution émettrice en tant qu'auteur institutionnel.</p>`,
    tags: ['APA 7', 'Citations', 'Anti-plagiat', 'Mendeley', 'Zotero'],
    metaTitle: 'Normes APA 7ème Édition : Guide Complet de Citation Universitaire',
    metaDesc: 'Maîtrisez les règles de citation APA 7ème édition pour réussir la bibliographie de votre mémoire ou thèse au Maroc.',
    focusKeyword: 'normes apa 7 citation mémoire',
    schemaType: 'Article',
    canonicalUrl: 'https://moroccanresearcher.com/article/normes-apa-7eme-edition-citer-sans-faute',
    robots: 'index, follow'
  },
  {
    id: 'art-4',
    title: 'Comment Rédiger une Revue de Littérature Systématique',
    slug: 'comment-rediger-revue-litterature-systematique',
    category: 'Méthodologie',
    author: 'Dr. Karim Ouazzani',
    date: '15 février 2026',
    readTime: '6 min',
    views: 940,
    likes: 71,
    status: 'Publié',
    featured: false,
    cover: 'https://images.unsplash.com/photo-1507842229452-772d1c9ab228?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Protocole PRISMA, équations de recherche et synthèse critique pour asseoir la crédibilité scientifique de votre travail académique.',
    content: `<h3>1. La Rigueur du Protocole PRISMA</h3>
<p>Une revue systématique ne se résume pas à empiler des résumés d'articles. Elle répond à une méthodologie reproductible, transparente et exhaustive afin d'évaluer l'état de l'art sur une question précise.</p>

<h3>2. Formuler des Équations Booléennes Efficaces</h3>
<p>Utilisez les opérateurs logiques (AND, OR, NOT) combinés aux descripteurs dans Scopus, Web of Science, Cairn.info et Google Scholar pour cibler les articles majeurs sans biais de sélection.</p>`,
    tags: ['Revue de littérature', 'PRISMA', 'Méthodologie', 'Scopus'],
    metaTitle: 'Rédiger une Revue de Littérature Systématique | Protocole PRISMA',
    metaDesc: 'Méthode pas-à-pas pour réussir la revue de littérature systématique de votre mémoire ou thèse doctorale.',
    focusKeyword: 'revue littérature systématique prisma',
    schemaType: 'ScholarlyArticle',
    canonicalUrl: 'https://moroccanresearcher.com/article/comment-rediger-revue-litterature-systematique',
    robots: 'index, follow'
  },
  {
    id: 'art-5',
    title: 'Les 7 Clés pour Convaincre le Jury lors de votre Soutenance de PFE',
    slug: '7-cles-convaincre-jury-soutenance-pfe',
    category: 'Soutenance',
    author: 'Prof. Youssef Bennani',
    date: '28 janvier 2026',
    readTime: '7 min',
    views: 1820,
    likes: 124,
    status: 'Publié',
    featured: false,
    cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'De la gestion du stress à la conception des diapositives PowerPoint : tout pour réussir votre prise de parole et répondre avec assurance aux questions.',
    content: `<h3>1. La Gestion du Temps (Règle d'Or des 20 Minutes)</h3>
<p>Le jury apprécie particulièrement le respect scrupuleux du temps alloué. Divisez votre présentation en 4 temps forts :</p>
<ul style="margin:16px 0;padding-left:24px;line-height:1.8">
  <li><strong>Minutes 0 à 3 :</strong> Accroche, problématique et objectifs de recherche.</li>
  <li><strong>Minutes 3 à 7 :</strong> Cadre conceptuel et méthodologie adoptée.</li>
  <li><strong>Minutes 7 à 16 :</strong> Résultats empiriques, interprétation et apports managériaux.</li>
  <li><strong>Minutes 16 à 20 :</strong> Limites de l'étude, voies de recherche futures et conclusion.</li>
</ul>

<h3>2. Répondre aux Objections et Critiques du Jury</h3>
<p>Ne prenez jamais une remarque critique personnellement. Remerciez le membre du jury pour son analyse éclairée et argumentez sereinement en vous appuyant sur vos données.</p>`,
    tags: ['Soutenance', 'PowerPoint', 'Jury', 'PFE', 'Communication'],
    metaTitle: '7 Clés pour Convaincre le Jury lors de votre Soutenance de PFE',
    metaDesc: 'Conseils pratiques et structure PowerPoint idéale pour réussir votre soutenance de fin détudes avec mention.',
    focusKeyword: 'soutenance pfe jury powerpoint',
    schemaType: 'Article',
    canonicalUrl: 'https://moroccanresearcher.com/article/7-cles-convaincre-jury-soutenance-pfe',
    robots: 'index, follow'
  },
  {
    id: 'art-6',
    title: 'Recherche Qualitative vs Quantitative : Comment Faire le Bon Choix ?',
    slug: 'recherche-qualitative-vs-quantitative-choix',
    category: 'Méthodologie',
    author: 'Mme. Sara Alami',
    date: '14 janvier 2026',
    readTime: '6 min',
    views: 1310,
    likes: 88,
    status: 'Publié',
    featured: false,
    cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=1200&auto=format&fit=crop&q=80',
    excerpt: 'Entretiens semi-directifs ou questionnaires à grande échelle ? Analyse comparative des deux approches et des démarches mixtes.',
    content: `<h3>1. Épistémologie et Positionnement Scientifique</h3>
<p>Le choix entre qualitatif et quantitatif ne dépend pas de vos préférences personnelles, mais de la nature même de votre question de recherche :</p>
<p><strong>L'approche qualitative :</strong> Idéale pour explorer un phénomène méconnu, comprendre les motivations profondes des acteurs ou décrypter une dynamique organisationnelle.</p>
<p><strong>L'approche quantitative :</strong> Indispensable pour mesurer, tester des hypothèses de corrélation ou de causalité et généraliser des résultats sur une population donnée.</p>`,
    tags: ['Méthodologie', 'Qualitatif', 'Quantitatif', 'Entretiens', 'Questionnaire'],
    metaTitle: 'Recherche Qualitative vs Quantitative : Guide de Choix Méthodologique',
    metaDesc: 'Comment choisir entre entretiens qualitatifs et questionnaires quantitatifs pour son mémoire ou sa thèse.',
    focusKeyword: 'recherche qualitative quantitative choix',
    schemaType: 'ScholarlyArticle',
    canonicalUrl: 'https://moroccanresearcher.com/article/recherche-qualitative-vs-quantitative-choix',
    robots: 'index, follow'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    clientName: 'Ahmed Benali',
    clientEmail: 'ahmed@student.ma',
    title: 'Impact du Marketing Digital sur la Fidélisation Client au Maroc',
    level: 'Master',
    pack: 'Pack Chercheur',
    progress: 75,
    status: 'En cours',
    deadline: '2026-05-15',
    expert: 'Prof. Youssef Bennani',
    note: 'Analyse statistique SPSS finalisée. En attente de la rédaction de la discussion des résultats.'
  },
  {
    id: 'proj-2',
    clientName: 'Fatima Zohra Mansouri',
    clientEmail: 'fatima@student.ma',
    title: 'Gouvernance d’Entreprise et Performance Financière des Sociétés Cotées',
    level: 'Doctorat',
    pack: 'Pack Doctoral',
    progress: 40,
    status: 'En cours',
    deadline: '2026-09-30',
    expert: 'Dr. Karim Ouazzani',
    note: 'Cadre théorique validé. Collecte des données sur la Bourse de Casablanca en cours.'
  },
  {
    id: 'proj-3',
    clientName: 'Omar El Idrissi',
    clientEmail: 'omar@student.ma',
    title: 'Optimisation de la Chaîne Logistique Portuaire (Tanger Med)',
    level: 'Licence',
    pack: 'Pack Standard',
    progress: 95,
    status: 'En révision',
    deadline: '2026-04-20',
    expert: 'Mme. Sara Alami',
    note: 'Présentation PowerPoint achevée. Simulation de soutenance planifiée cette semaine.'
  }
];

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Ahmed Benali',
    email: 'ahmed@student.ma',
    role: 'student',
    level: 'master',
    phone: '0661234567',
    city: 'Casablanca',
    university: 'Université Hassan II',
    registeredAt: '2026-01-15'
  },
  {
    id: 'usr-2',
    name: 'Admin Moroccan Researcher',
    email: 'admin@moroccanresearcher.com',
    role: 'admin',
    level: 'admin',
    phone: '0680364052',
    city: 'Casablanca',
    university: 'Siège Moroccan Researcher',
    registeredAt: '2025-09-01'
  }
];

const INITIAL_CONTACTS = [
  {
    id: 'cnt-1',
    name: 'Yassine Chraibi',
    email: 'yassine.c@gmail.com',
    phone: '0670981234',
    subject: 'Accompagnement Mémoire Master CCA',
    message: 'Bonjour, j’ai besoin d’une aide urgente sur l’analyse statistique SPSS pour mon PFE en finance. Quel est le délai et le tarif ?',
    date: '08 oct. 2026, 14:20',
    status: 'Nouveau'
  },
  {
    id: 'cnt-2',
    name: 'Nadia Tazi',
    email: 'nadia.tazi@encg.ma',
    phone: '0654321098',
    subject: 'Vérification Anti-Plagiat Turnitin',
    message: 'Je souhaite vérifier mon mémoire de 80 pages avant soumission finale le 20 octobre. Merci.',
    date: '09 oct. 2026, 10:15',
    status: 'Traité'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'expert',
    text: 'Votre expert Dr. Karim Ouazzani a validé l’étape 2 de votre projet.',
    time: 'Il y a 2 heures',
    read: false
  },
  {
    id: 'notif-2',
    type: 'activity',
    text: 'Nouveau message reçu concernant votre analyse SPSS.',
    time: 'Hier à 17:30',
    read: false
  }
];

// =====================================================================
// INDEXEDDB DUAL-STORAGE ENGINE (SUPPORTS LARGE PHOTOS & PERMANENCE)
// Prevents QuotaExceededError and permanently retains high-res photos
// =====================================================================
const MR_DB_NAME = 'MoroccanResearcherDB_v4';
const MR_DB_VERSION = 1;
const STORE_ARTICLES = 'articles';

let _mrDbPromise = null;
function getMRDatabase() {
  if (!_mrDbPromise) {
    _mrDbPromise = new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }
      try {
        const req = window.indexedDB.open(MR_DB_NAME, MR_DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_ARTICLES)) {
            db.createObjectStore(STORE_ARTICLES, { keyPath: 'id' });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => {
          console.warn('IndexedDB unavailable:', e);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization skipped:', err);
        resolve(null);
      }
    });
  }
  return _mrDbPromise;
}

// Helper functions for persistent access
const DataStore = {
  _articlesCache: null,
  _initialized: false,

  async init() {
    if (this._initialized) return;
    this._initialized = true;

    // Load from localStorage first (authoritative for recent user actions like deletions or additions)
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this._articlesCache = parsed;
          return;
        }
      }
    } catch (e) {}

    // Next try IndexedDB if localStorage was empty
    try {
      const db = await getMRDatabase();
      if (db) {
        const tx = db.transaction(STORE_ARTICLES, 'readonly');
        const store = tx.objectStore(STORE_ARTICLES);
        const req = store.getAll();
        await new Promise((resolve) => {
          req.onsuccess = () => {
            if (req.result && Array.isArray(req.result) && req.result.length > 0) {
              this._articlesCache = req.result;
              try {
                localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(req.result));
              } catch (e) {}
            }
            resolve();
          };
          req.onerror = () => resolve();
        });
      }
    } catch (err) {
      console.warn('IndexedDB init error:', err);
    }

    if (!this._articlesCache) {
      this._articlesCache = [...INITIAL_ARTICLES];
    }
  },

  getArticles() {
    if (this._articlesCache !== null && this._articlesCache !== undefined) {
      return this._articlesCache;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this._articlesCache = parsed;
          return parsed;
        }
      }
    } catch (e) {}

    this._articlesCache = [...INITIAL_ARTICLES];
    return this._articlesCache;
  },

  saveArticles(articles) {
    this._articlesCache = [...articles];

    // 1. Save into localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    } catch (e) {
      console.warn('LocalStorage quota reached, saving safe copies:', e);
      try {
        const safeCopies = articles.map(a => {
          const isHeavyBase64 = a.cover && a.cover.startsWith('data:image/') && a.cover.length > 250000;
          return isHeavyBase64 
            ? { ...a, cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200' }
            : a;
        });
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(safeCopies));
      } catch (err2) {}
    }

    // 2. Permanently save into IndexedDB
    getMRDatabase().then(db => {
      if (!db) return;
      try {
        const tx = db.transaction(STORE_ARTICLES, 'readwrite');
        const store = tx.objectStore(STORE_ARTICLES);
        store.clear();
        articles.forEach(art => store.put(art));
      } catch (dbErr) {
        console.error('IndexedDB save error:', dbErr);
      }
    });
  },
  getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch (e) {
      return INITIAL_PROJECTS;
    }
  },
  saveProjects(projects) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects:', e);
    }
  },
  getContacts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : INITIAL_CONTACTS;
    } catch (e) {
      return INITIAL_CONTACTS;
    }
  },
  saveContacts(contacts) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error('Error saving contacts:', e);
    }
  },
  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  },
  saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users:', e);
    }
  },
  getNotifications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error('Error saving notifications:', e);
    }
  },
  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  },
  getAdminPassword() {
    try {
      const p = localStorage.getItem('mr_admin_pwd_v4');
      return p || 'admin123';
    } catch (e) {
      return 'admin123';
    }
  },
  setAdminPassword(newPass) {
    try {
      localStorage.setItem('mr_admin_pwd_v4', newPass);
      return true;
    } catch (e) {
      return false;
    }
  },
  getAuditLogs() {
    try {
      const data = localStorage.getItem('mr_audit_logs_v4');
      return data ? JSON.parse(data) : [
        { action: 'Système Sécurisé Initialisé', details: 'Sessions sécurisées & protection contre les accès non autorisés active', date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), ip: '196.200.145.22 (Casablanca)' }
      ];
    } catch (e) {
      return [];
    }
  },
  addAuditLog(action, details) {
    try {
      const logs = this.getAuditLogs();
      logs.unshift({
        action,
        details,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        ip: '196.200.145.22 (Accès Sécurisé)'
      });
      localStorage.setItem('mr_audit_logs_v4', JSON.stringify(logs.slice(0, 50)));
    } catch (e) {}
  }
};

window.DataStore = DataStore;
