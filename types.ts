
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
  role: MessageRole;
  text: string;
  chartData?: ChartData;
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
}