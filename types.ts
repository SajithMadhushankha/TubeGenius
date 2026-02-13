export enum InputMode {
  SCRIPT = 'SCRIPT',
  TRANSCRIPT = 'TRANSCRIPT',
  IDEA = 'IDEA'
}

export interface SeoStrategy {
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  hooks: string[];
  entities: string[];
}

export interface SeoResult {
  titles: string[];
  descriptions: string[];
  tags: string[];
  hashtags: string[];
  thumbnailPrompt: string;
  strategy?: SeoStrategy;
}

export interface ThumbnailConfig {
  template: 'minimal' | 'loud' | 'modern';
  text: string;
  image?: File | null;
  color: string;
}

export interface TranscriptItem {
  text: string;
  start: number;
  duration: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
