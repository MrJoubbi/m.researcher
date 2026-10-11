export interface Article {
  id: string;
  title: string;
  arabicTitle?: string;
  category: ArticleCategory;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;
  featured?: boolean;
}

export type ArticleCategory =
  | 'Artisanat & Crafts'
  | 'Gastronomy & Cuisine'
  | 'Riads & Travel'
  | 'History & Heritage'
  | 'Culture & Traditions'
  | 'Architecture & Design';

export interface ImagePreset {
  label: string;
  url: string;
  caption: string;
}
