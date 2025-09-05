
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChartData {
  chartType: 'bar' | 'line' | 'pie';
  data: any[];
  title?: string;
  dataKey: string;
  nameKey: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  chartData?: ChartData;
  attachment?: {
    url: string; // Data URL for display
    type: string; // MIME type
  };
}

export interface Notification {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface ModelConfig {
    temperature: number;
    topP: number;
    topK: number;
}

export interface AppSettings {
    theme: Theme;
    modelConfig: ModelConfig;
    microphoneLanguage: string;
    enableTTS: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface CustomModel {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  systemInstruction: string;
}

export type GalleryItemType = 'folder' | 'image' | 'video' | 'file';

export interface GalleryItem {
  id: string;
  type: GalleryItemType;
  name: string;
  date: string;
  src?: string; // For images and videos
  alt?: string; // For images
  prompt?: string; // For AI-generated images
  thumbnail?: string; // For videos
  fileType?: string; // e.g., 'PDF', 'DOCX'
  size?: string; // e.g., '1.2 MB'
}
