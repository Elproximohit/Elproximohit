export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  FEATURES = 'features',
  GIVEAWAY = 'giveaway',
  DOWNLOAD = 'download',
}