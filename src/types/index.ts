export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown o HTML enriquecido
  coverImage: string;
  category: string;
  authorName: string;
  authorEmail: string;
  isTeamAuthor: boolean;
  publishedAt: string; // ISO string o formato legible
  readingTimeMinutes: number;
  likesCount: number;
  isPublished?: boolean;
  isFeatured?: boolean;
}

export type PostFilter = 'recent' | 'popular';
