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

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  chartData?: ChartData;
  attachment?: {
    url: string; // Data URL for display
    type: string; // MIME type
    name: string;
    size: number;
  };
  groundingChunks?: GroundingChunk[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
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
    maxOutputTokens?: number;
    thinkingBudget?: number;
}

export interface SoundSettings {
    enableSound: boolean;
    masterVolume: number; // 0 to 1
    uiSounds: boolean;
    messageSent: boolean;
    messageReceived: boolean;
    notifications: boolean;
    voiceRecognition: boolean;
}

export interface PrivacySettings {
    autoClearOnLogout: boolean;
    sessionTimeoutMinutes: number; // 0 for never
}

export interface AppSettings {
    theme: Theme;
    modelConfig: ModelConfig;
    microphoneLanguage: string;
    enableTTS: boolean;
    fontSize: number; // as a percentage
    compactUI: boolean;
    animationsDisabled: boolean;
    sendOnEnter: boolean;
    autoScroll: boolean;
    exportFormat: 'markdown' | 'json' | 'text';
    systemInstruction?: string;
    soundSettings: SoundSettings;
    privacySettings: PrivacySettings;
    openLastUsedPanel: boolean;
    userBubbleAlignment: 'left' | 'right';
    showSuggestionChips: boolean;
    showTimestamps: boolean;
    webSearchDefault: boolean;
    notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    showStatusIndicator: boolean;
    showTokenCount: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string; // Data URL for the avatar image
}

export type AIProvider = 'SAR LEGACY' | 'OpenAI' | 'Anthropic' | 'Deepseek';

export interface ApiKey {
  id: string;
  provider: AIProvider;
  key: string;
  name: string;
  status: 'active' | 'inactive';
  requestCount: number;
  tokenUsage: number;
  lastUsed: string | null;
  createdAt: string;
  tokenLimit?: number;
  healthCheckStatus?: 'valid' | 'invalid' | 'checking' | null;
  healthCheckReport?: string;
  usageAnalysis?: string;
}

export interface CustomModel {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  systemInstruction: string;
  provider: AIProvider;
  modelId: string; // e.g., 'gemini-2.5-flash', 'gpt-4o'
  isEditable?: boolean; // To distinguish default models from user-created ones
}

export interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'Cloud Storage' | 'Productivity' | 'Communication';
}

export type GalleryItemType = 'folder' | 'image' | 'video' | 'file' | 'sar_project';

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
  children?: GalleryItem[];
  file?: File; // To hold the raw file for RAG in the current session
  projectPlan?: ProjectPlan;
  generatedFiles?: GeneratedFile[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string; // User name
  action: string;
  details?: Record<string, any>;
}

export interface ProjectPlan {
  projectName: string;
  technologyStack: string[];
  featureBreakdown:string[];
  fileList: string[];
}

export interface GeneratedFile {
  filePath: string;
  fileContent: string;
}

export interface AppData {
    users: User[];
    customModels: CustomModel[];
    apiKeys: ApiKey[];
    settings: AppSettings;
    galleryRoot: GalleryItem;
    connectedConnectorIds: string[];
    logs: LogEntry[];
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export type VideoEngine = 'google-veo' | 'sar-python';

export interface GeneratedImageData {
    base64: string;
    prompt: string;
    aspectRatio: AspectRatio;
}

export type FrameRate = 24 | 30;
export type MotionBlur = number; // Represents intensity from 0-10