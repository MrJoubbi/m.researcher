import { Article, ImagePreset } from '../types/article';

export const IMAGE_PRESETS: ImagePreset[] = [
  {
    label: 'Marrakech Medina & Spices',
    url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vibrant spices and atmospheric alleyways of Marrakech'
  },
  {
    label: 'Chefchaouen Blue Pearl',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1200&q=80',
    caption: 'Iconic cobalt blue stairways of Chefchaouen'
  },
  {
    label: 'Moroccan Zellige & Riad Fountain',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intricate geometric tilework and tranquil riad courtyard'
  },
  {
    label: 'Authentic Moroccan Tagine',
    url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80',
    caption: 'Slow-cooked lamb tagine with preserved lemons and saffron'
  },
  {
    label: 'Sahara Desert Merzouga Dunes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Golden shifting sands under sunset in Erg Chebbi'
  },
  {
    label: 'Fez Chouara Tannery',
    url: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ancient natural dye vats in the heart of Fez el-Bali'
  },
  {
    label: 'Moroccan Mint Tea Ceremony',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pouring Atay Naânaâ high into decorated tea glasses'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'The Living Geometry of Moroccan Zellige: A Thousand-Year Art Form',
    arabicTitle: 'فن الزليج المغربي الأصيل',
    category: 'Artisanat & Crafts',
    excerpt: 'Deep in the labyrinthine quarters of Fez, master maâlems still hand-chisel every terracotta tile according to sacred Islamic geometry and centuries of unbroken lineage.',
    content: `Moroccan Zellige is far more than decorative tiling—it is a philosophical manifestation of infinite repetition, harmony, and sublime patience. Emerging into prominence during the 10th and 11th centuries and refined under the Marinid dynasty, this art form transforms humble clay from the hills of Fez into dazzling celestial mosaics.

### The Sacred Process of the Maâlem
Every square meter of Zellige demands painstaking human effort. The clay is first soaked in open cisterns, shaped by hand, baked in olive-pit fired kilns, and coated in rich enamel pigments—cobalt for Fez blue, antimony for saffron yellow, copper for Atlas green, and manganese for deep charcoal.

Once glazed and fired a second time, master artisans known as *Kassas* sit cross-legged on sheepskin mats with a heavy, razor-edged hammer called a *manqash*. With unmatched muscle memory, they cut each geometric chip (*chqaf*) with millimeter precision without a single measuring tape.

> "A true maâlem does not draw the mosaic on the wall; he sees the geometry in his mind and arranges the pieces upside down on the plaster floor."

### Where to Experience Authentic Zellige
- **Medersa Bou Inania (Fez)**: Completed in 1356, showcasing the zenith of Marinid symmetry.
- **Ben Youssef Medersa (Marrakech)**: Monumental cedar carvings paired with emerald and amber starburst patterns.
- **Dar Si Said (Marrakech)**: Morocco's national museum of weaving and wooden craft.`,
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Youssef El Mansouri',
      role: 'Cultural Historian, Fez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'October 8, 2026',
    readTime: '6 min read',
    tags: ['Zellige', 'Artisanat', 'Fez', 'Architecture', 'Handmade'],
    likes: 142,
    featured: true
  },
  {
    id: 'art-2',
    title: 'The Ritual of Atay Naânaâ: Why Moroccan Mint Tea Is Hospitality in a Glass',
    arabicTitle: 'طقوس الشاي المغربي بالنعناع',
    category: 'Gastronomy & Cuisine',
    excerpt: 'In Morocco, pouring tea is an art of patience, respect, and celebration. Learn how gunpowder green tea, fresh spearmint, and amber sugar cones unite in a fragrant stream.',
    content: `To step across any threshold in Morocco—whether a humble carpet stall in the souks of Essaouira or an ornate riad in Rabat—is to be greeted with the ceremonial aroma of fresh spearmint and boiling water.

Moroccan tea, affectionately called *Atay* or *Berber Whiskey*, is rarely prepared in haste. It is brewed in an ornate silver or nickel-plated teapot (*berrad*), balanced on a brass tray (*siniya*), and served in jewel-toned painted glasses.

### The Golden Pour (*Rgha*)
The most theatrical moment occurs when the host lifts the teapot high above the glass—sometimes three feet into the air—without spilling a solitary drop. This technique aerates the tea, releases volatile aromatic oils, and creates the coveted layer of delicate froth called the *regga* or crown.

### Traditional Ingredients
1. **Chinese Gunpowder Green Tea**: The smoky foundation imported along trans-Saharan trade corridors since the 18th century.
2. **Fresh Spearmint (*Naânaâ*)**: Hand-picked daily, bruised gently between the fingers before entering the pot.
3. **Absinthe & Wild Herbs (*Chiba* or *Fliou*)**: Added during cool winter evenings in the High Atlas.
4. **Sugar Loaf (*Soukar Qaleb*)**: Crushed with a brass hammer to achieve Morocco's legendary sweet finish.`,
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Fatima-Zahra Bennani',
      role: 'Gastronomy Author, Casablanca',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'October 5, 2026',
    readTime: '4 min read',
    tags: ['Tea', 'Gastronomy', 'Culture', 'Hospitality', 'Traditions'],
    likes: 98,
    featured: false
  },
  {
    id: 'art-3',
    title: 'Beyond the Blue Pearl: Exploring Chefchaouen’s Hidden Rif Mountain Trails',
    arabicTitle: 'شفشاون وجبال الريف الساحرة',
    category: 'Riads & Travel',
    excerpt: 'Wander beyond the turquoise alleys of Chefchaouen into the mist-veiled cedar forests of Talassemtane National Park and the cascades of Akchour.',
    content: `Perched beneath the jagged horn-shaped peaks of Mount Kelaa and Mount Meggou, the mountain citadel of Chefchaouen captivates millions with its cascading washes of indigo, sky blue, and cobalt. Yet just thirty minutes outside the medina gate, the wild Rif mountains reveal dramatic gorges, secret waterfalls, and centuries-old Andalusian mountain villages.

### The Magic of Akchour Waterfalls
The hike toward the Grand Cascade of Akchour follows a crystal-clear turquoise river bordered by lush oleanders and fig trees. Along the trail, rustic open-air cafes immerse wooden tables directly into the mountain stream, letting travelers dip their feet in mountain waters while sipping freshly squeezed orange juice.

### Hiking the God’s Bridge (*Pont de Dieu*)
A breathtaking natural rock arch suspended over 25 meters above the Oued Farda canyon, the God's Bridge offers panoramic views across limestone cliffs and pine forests. For adventurous travelers, local guides lead journeys into the Talassemtane biosphere, home to endangered Moroccan firs and Barbary macaques.`,
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Karim Tazi',
      role: 'Adventure Guide & Photographer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'September 28, 2026',
    readTime: '5 min read',
    tags: ['Chefchaouen', 'Hiking', 'Rif', 'Travel', 'Nature'],
    likes: 187,
    featured: true
  },
  {
    id: 'art-4',
    title: 'Secrets of the Clay Tagine: Slow Cooking with Clay, Cumin, and Saffron',
    arabicTitle: 'أسرار الطاجين المغربي التقليدي',
    category: 'Gastronomy & Cuisine',
    excerpt: 'Why the conical lid of the Moroccan earthenware tagine produces the most succulent meats and deeply caramelized vegetables in North Africa.',
    content: `The word *tagine* describes both the iconic conical earthenware cooking vessel and the slow-simmered stew that emerges from its depths. Unlike modern pressure cookers, an authentic unglazed clay tagine cooks with gentle radiant heat and continuous natural condensation.

### The Physics of the Conical Lid
As steam rises from the bubbling spices—ginger, turmeric, ras el hanout, and Taliouine saffron—it hits the cooler upper walls of the cone. The vapor condenses and trickles down in rhythmic drops, continuously basting the tender lamb, beef, or poultry without requiring excessive added water.

### Essential Rules of Tagine Cooking
- **Gentle Charcoal Ember (*Majmar*)**: A true tagine is never rushed over blazing flames. Cook slowly over glowing wood charcoals.
- **The Bed of Onions**: Sliced white onions form an insulating protective bed at the base, caramelizing into sweet jammy *daghmira*.
- **Contrasting Flavors**: Morocco’s legendary marriage of savory spices with sweet notes—like lamb paired with dried prunes, toasted almonds, and hard-boiled eggs.`,
    coverImage: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Chef Amina Chraibi',
      role: 'Traditional Culinary Master, Marrakech',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'September 22, 2026',
    readTime: '5 min read',
    tags: ['Tagine', 'Gastronomy', 'MoroccanFood', 'Spices', 'Recipes'],
    likes: 114,
    featured: false
  },
  {
    id: 'art-5',
    title: 'Starlight over Erg Chebbi: A Journey into Morocco’s Golden Dunes',
    arabicTitle: 'ليالي صحراء مرزوكة الذهبية',
    category: 'Riads & Travel',
    excerpt: 'Cross the High Atlas passes of Tizi n’Tichka into the timeless silence of the Sahara desert, where camel caravans meet ancient Berber nomad campfires.',
    content: `As the last rays of the North African sun kiss the crests of Erg Chebbi, the apricot dunes blush deep crimson. The only sound is the rhythmic footsteps of dromedaries plodding through cool evening sand and the wind softly whispering across sea-like sand ridges that rise up to 150 meters high.

### Sleeping Under Saharan Constellations
Far from artificial city lighting, the night sky over Merzouga explodes into billions of crystalline stars. Travelers gather around crackling acacia wood fires as Tuareg and Berber musicians play hypnotic rhythms on the *darbouka* drum and electric *guembri*, sharing tales of desert caravans that once traversed from Timbuktu to Marrakech.

### What to Pack for the Desert
- Breathable linen shirts for midday sun and warm woolen djellabas for crisp desert nights.
- Traditional indigo *cheche* (turban) to protect against desert breezes.
- Wide-angle lens and tripod for astrophotography of the Milky Way.`,
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Hassan Ait Oumghar',
      role: 'Sahara Expedition Guide',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'September 15, 2026',
    readTime: '7 min read',
    tags: ['Sahara', 'Merzouga', 'Desert', 'Nomads', 'Travel'],
    likes: 215,
    featured: false
  },
  {
    id: 'art-6',
    title: 'The Alchemist Tanners of Fez: Inside the Ancient Chouara Vats',
    arabicTitle: 'دباغة فاس التقليدية في شوارة',
    category: 'Artisanat & Crafts',
    excerpt: 'Operating without interruption since the 11th century, Chouara tannery is a living medieval marvel producing butter-soft Moroccan leather.',
    content: `Climb onto the panoramic terrace of any leather cooperative in the heart of Fez el-Bali, and a surreal honeycomb of stone dyeing vats unfolds below. Men stand waist-deep in circular pits filled with natural liquids, kneading cow, sheep, and goat hides under the Mediterranean sun.

### Organic Dyes from Mother Nature
Unlike modern industrial chemical tanneries, Chouara adheres strictly to organic centuries-old formulas:
- **Pigeon Droppings & Quicklime**: Natural ammonia breaks down harsh fibers to make the leather supple.
- **Poppy Flower (*Fekka*)**: Imparts brilliant Moroccan crimson red.
- **Saffron & Turmeric**: Yields radiant sunshine yellows for traditional leather babouche slippers.
- **Cedar Wood Oil**: Softens and perfumes the tanned hides.`,
    coverImage: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Youssef El Mansouri',
      role: 'Cultural Historian, Fez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: 'September 10, 2026',
    readTime: '6 min read',
    tags: ['Fez', 'Tannery', 'Leather', 'Artisanat', 'History'],
    likes: 164,
    featured: false
  }
];
