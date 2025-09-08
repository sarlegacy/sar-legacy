import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
// Fix: Import Chat from the correct package @google/genai
import { Chat, GenerateContentResponse } from "@google/genai";
import { 
  SarLegacyLogo, GalleryIcon, GridIcon, SettingsIcon,
  BellIcon, SparkleIcon, MicrophoneIcon, MovieIcon, GenerateIcon, WriteIcon,
  DataAnalysisIcon, MoreIcon, ChevronRightIcon, CloseIcon,
  SendIcon, SarLogoIcon, AlertTriangleIcon, ChartBarIcon, PaperclipIcon,
  UsersIcon, LogoutIcon, FileTextIcon, CopyIcon, SpeakerOnIcon, DownloadIcon,
  SearchIcon, ChevronUpIcon, ChevronDownIcon, PlugIcon, CpuChipIcon, MenuIcon, TrashIcon
} from './components/admin/icons.tsx';
import { SuggestionChip } from './components/admin/SuggestionChip.tsx';
import { createChatSession, generateContentWithGoogleSearch, performApiKeyHealthCheck, getApiKeyUsageAnalysis, generateChartData } from './services/aiService.ts';
import * as fileService from './services/fileService.ts';
import * as galleryService from './services/galleryService.ts';
import * as driveService from './services/googleDriveService.ts';
import { ChatMessage, MessageRole, Notification, AppSettings, User, CustomModel, ApiKey, GalleryItem, Connector, AppData, LogEntry, GeneratedImageData, ProjectPlan, GeneratedFile, SoundSettings, PrivacySettings } from './types.ts';
import { ChatBubble } from './components/admin/ChatBubble.tsx';
import { NotificationPanel } from './components/admin/NotificationPanel.tsx';
import { LoginScreen } from './components/admin/LoginScreen.tsx';
import { mockUsers } from './data/mockUsers.ts';
import { defaultModel, mockModels as defaultModels } from './data/mockModels.ts';
import { rootFolder } from './data/mockGallery.ts';
import { mockConnectors } from './data/mockConnectors.ts';

// Statically imported components to resolve module loading errors.
import { SettingsPanel } from './components/admin/SettingsPanel.tsx';
import { AdminPanel } from './components/admin/AdminPanel.tsx';
import { ModelMarketplace } from './components/admin/ModelMarketplace.tsx';
import { Gallery } from './components/admin/Gallery.tsx';
import { CustomModelModal } from './components/admin/CustomModelModal.tsx';
import { ContextMenu } from './components/admin/ContextMenu.tsx';
import { ConnectorsPanel } from './components/admin/ConnectorsPanel.tsx';
import { StatusIndicator } from './components/admin/StatusIndicator.tsx';
import { SarStudio } from './components/admin/SarStudio.tsx';
import { SarProjectCanvas } from './components/admin/SarProjectCanvas.tsx';
import { ImageEditor } from './components/admin/ImageEditor.tsx';
import { ProfilePanel } from './components/admin/ProfilePanel.tsx';


// Add type definitions for the Web Speech API to fix TypeScript errors.
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onend: () => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// A simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const Clock: React.FC = memo(() => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const formattedTime = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedDate = date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="text-center font-medium">
            <span className="text-sm text-[var(--text-primary)]">{formattedTime}</span>
            <span className="text-xs text-[var(--text-muted)]"> | {formattedDate}</span>
        </div>
    );
});


const Sidebar: React.FC<{ 
  onSettingsClick: () => void; 
  onAdminClick: () => void;
  onPanelClick: (panel: 'gallery' | 'studio' | 'marketplace' | 'connectors') => void;
  settingsButtonRef: React.RefObject<HTMLButtonElement>;
  isAdmin: boolean;
}> = memo(({ onSettingsClick, onAdminClick, onPanelClick, settingsButtonRef, isAdmin }) => {
  const navItems = [
    { icon: <GalleryIcon />, label: 'Gallery', action: () => onPanelClick('gallery') },
    { icon: <GenerateIcon />, label: 'SAR Studio', action: () => onPanelClick('studio') },
    { icon: <GridIcon />, label: 'Apps', action: () => onPanelClick('marketplace') },
    { icon: <PlugIcon />, label: 'Connectors', action: () => onPanelClick('connectors') },
  ];
  return (
    <aside className="bg-[var(--bg-secondary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-[32px] flex flex-col items-center justify-between p-4 py-8 h-full">
      <div className="flex flex-col items-center gap-8">
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} aria-label="Homepage">
          <SarLegacyLogo className="w-12 h-12" />
        </a>
        <nav className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <button key={index} onClick={item.action} aria-label={item.label} className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)] transition-colors">
              {item.icon}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-6">
        {isAdmin && (
          <>
            <button onClick={onAdminClick} aria-label="Admin Panel" className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)] transition-colors">
                <UsersIcon />
            </button>
          </>
        )}
        <button ref={settingsButtonRef} onClick={onSettingsClick} aria-label="Settings" className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)] transition-colors">
            <SettingsIcon />
        </button>
      </div>
    </aside>
  );
});

const WelcomeScreen: React.FC = memo(() => {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning!";
        if (hour < 18) return "Good afternoon!";
        return "Good evening!";
    }, []);

  return (
    <>
      <section className="mt-16 flex-shrink-0">
        <p className="text-[var(--text-muted)]">{greeting}</p>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-[var(--text-primary)] !leading-[1.1] mt-1">You're on a wave of<br/>productivity!</h1>
      </section>
    </>
  );
});

const LoadingIndicator: React.FC<{ text?: string }> = ({ text = "Syncing with Google Drive..." }) => (
    <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-purple-400">
            <SarLogoIcon className="w-12 h-12 animate-pulse" />
            <p className="text-sm font-medium">{text}</p>
        </div>
    </div>
);

const initialNotifications: Notification[] = [
    { id: 1, icon: <BellIcon className="w-5 h-5 text-blue-400" />, title: "Project Sync-Up", description: "Your meeting with the design team starts in 15 minutes.", timestamp: "10m ago" },
    { id: 2, icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />, title: "System Maintenance", description: "Scheduled maintenance will occur tonight at 11 PM PST.", timestamp: "1h ago" },
    { id: 3, icon: <GenerateIcon className="w-5 h-5 text-purple-400" />, title: "Image Generation Complete", description: "Your requested image 'Cyberpunk City' is ready.", timestamp: "3h ago" }
];

const defaultSoundSettings: SoundSettings = {
    enableSound: true,
    masterVolume: 0.5,
    uiSounds: true,
    messageSent: true,
    messageReceived: true,
    notifications: true,
    voiceRecognition: true,
};

const defaultPrivacySettings: PrivacySettings = {
    autoClearOnLogout: false,
    sessionTimeoutMinutes: 30, // 0 for never
};

const defaultSettings: AppSettings = {
    theme: 'dark',
    modelConfig: { temperature: 0.7, topP: 0.95, topK: 40 },
    microphoneLanguage: 'en-US',
    enableTTS: true,
    fontSize: 100,
    compactUI: false,
    animationsDisabled: false,
    sendOnEnter: true,
    autoScroll: true,
    exportFormat: 'markdown',
    soundSettings: defaultSoundSettings,
    privacySettings: defaultPrivacySettings,
    openLastUsedPanel: true,
    systemInstruction: '',
    userBubbleAlignment: 'right',
    showSuggestionChips: true,
    showTimestamps: false,
    webSearchDefault: false,
    notificationPosition: 'top-right',
    showStatusIndicator: true,
    showTokenCount: true,
};

const formatFileSize = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

type MainView = 'chat' | 'gallery' | 'studio' | 'marketplace' | 'connectors';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [customModels, setCustomModels] = useState<CustomModel[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [galleryRoot, setGalleryRoot] = useState<GalleryItem>(rootFolder);
  const [connectedConnectorIds, setConnectedConnectorIds] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [isDriveSyncing, setIsDriveSyncing] = useState(true);
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [isDriveConnecting, setIsDriveConnecting] = useState(false);
  
  const [activeModel, setActiveModel] = useState<CustomModel>(defaultModel);
  const [activeView, setActiveView] = useState<MainView>('chat');
  
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<CustomModel | null>(null);
  const [projectToPreview, setProjectToPreview] = useState<GalleryItem | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryItem | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentlySpeakingMessageId, setCurrentlySpeakingMessageId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ file: File; url: string } | null>(null);
  const [activeDocument, setActiveDocument] = useState<GalleryItem | null>(null);
  const [sessionTokenCount, setSessionTokenCount] = useState({ prompt: 0, response: 0 });
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    message: ChatMessage | null;
  }>({ isOpen: false, position: { x: 0, y: 0 }, message: null });

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState<number | null>(null);
  
  const [modelStatus, setModelStatus] = useState<'online' | 'degraded' | 'offline' | 'checking'>('checking');
  const [modelStatusMessage, setModelStatusMessage] = useState<string>('');

  const chat = useRef<Chat | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isInitialLoad = useRef(true);
  const MAX_LOG_ENTRIES = 200;

  const addLogEntry = useCallback((action: string, details?: Record<string, any>) => {
    setLogs(prevLogs => {
      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser?.name || 'System',
        action,
        details,
      };
      const updatedLogs = [newLog, ...prevLogs];
      if (updatedLogs.length > MAX_LOG_ENTRIES) {
        return updatedLogs.slice(0, MAX_LOG_ENTRIES);
      }
      return updatedLogs;
    });
  }, [currentUser?.name]);

  const playSound = useCallback((type: 'messageReceived' | 'notification' | 'send' | 'ui' | 'micOn' | 'micOff') => {
    const { soundSettings } = settings;
    if (!soundSettings.enableSound) return;

    const soundToggles = {
        messageReceived: soundSettings.messageReceived,
        notification: soundSettings.notifications,
        send: soundSettings.messageSent,
        ui: soundSettings.uiSounds,
        micOn: soundSettings.voiceRecognition,
        micOff: soundSettings.voiceRecognition,
    };

    if (!soundToggles[type]) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContext) return;

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      oscillator.connect(gainNode);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      let freq = 440, duration = 0.2, attack = 0.05, baseVolume = 0.3, waveType: OscillatorType = 'sine';

      switch (type) {
        case 'messageReceived': freq = 261.63; duration = 0.2; attack = 0.05; baseVolume = 0.3; break; // C4
        case 'notification': freq = 523.25; duration = 0.4; attack = 0.05; baseVolume = 0.4; waveType = 'triangle'; break; // C5
        case 'send': freq = 440; duration = 0.1; attack = 0.02; baseVolume = 0.2; break; // A4
        case 'ui': freq = 600; duration = 0.05; attack = 0.01; baseVolume = 0.1; break;
        case 'micOn': freq = 300; duration = 0.1; attack = 0.02; baseVolume = 0.2; waveType = 'triangle'; break;
        case 'micOff': freq = 200; duration = 0.1; attack = 0.02; baseVolume = 0.2; waveType = 'triangle'; break;
      }

      const finalVolume = baseVolume * soundSettings.masterVolume;
      
      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(finalVolume > 0.0001 ? finalVolume : 0.0001, audioContext.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration + 0.1);

      oscillator.onended = () => {
        audioContext.close();
      };
    } catch (error) {
      console.warn("Could not play sound:", error);
    }
  }, [settings.soundSettings]);

  const loadStateFromLocalStorage = useCallback(() => {
    console.log("Loading state from Local Storage...");
    try {
        const storedUsers = localStorage.getItem('sarLegacyUsers');
        setUsers(storedUsers ? JSON.parse(storedUsers) : mockUsers);

        const storedModels = localStorage.getItem('customModels');
        setCustomModels(storedModels ? JSON.parse(storedModels) : []);

        const storedKeys = localStorage.getItem('apiKeys');
        setApiKeys(storedKeys ? JSON.parse(storedKeys).map((k: any) => ({ ...k, requestCount: k.requestCount ?? k.usageCount ?? 0, tokenUsage: k.tokenUsage ?? 0, })) : []);
        
        const storedGallery = localStorage.getItem('galleryRoot');
        setGalleryRoot(storedGallery ? JSON.parse(storedGallery) : rootFolder);

        const storedConnectors = localStorage.getItem('connectedConnectorIds');
        setConnectedConnectorIds(storedConnectors ? JSON.parse(storedConnectors) : []);

        const storedLogs = localStorage.getItem('activityLogs');
        setLogs(storedLogs ? JSON.parse(storedLogs) : []);

        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            parsedSettings.soundSettings = { ...defaultSoundSettings, ...(parsedSettings.soundSettings || {}) };
            parsedSettings.privacySettings = { ...defaultPrivacySettings, ...(parsedSettings.privacySettings || {}) };
            setSettings({ ...defaultSettings, ...parsedSettings });
        } else {
            setSettings(defaultSettings);
        }

    } catch (error) {
        console.error("Failed to parse state from localStorage", error);
        setUsers(mockUsers);
        setSettings(defaultSettings);
        setLogs([]);
    }
  }, []);

  const handleUpdateAuthStatus = useCallback(async (isSignedIn: boolean) => {
    setIsDriveConnected(isSignedIn);
    if (isSignedIn) {
        try {
            const data = await driveService.getAppData();
            if (data) {
                console.log("Loaded data from Google Drive:", data);
                setUsers(data.users || mockUsers);
                setCustomModels(data.customModels || []);
                setApiKeys(data.apiKeys || []);
                setSettings(data.settings ? { ...defaultSettings, ...data.settings } : defaultSettings);
                setGalleryRoot(data.galleryRoot || rootFolder);
                setConnectedConnectorIds(data.connectedConnectorIds || []);
                setLogs(data.logs || []);
            } else {
                 // First time connecting, save current (local or default) state to Drive
                console.log("No data found on Drive, performing initial save.");
                loadStateFromLocalStorage();
            }
        } catch (error) {
            console.error("Failed to load data from Drive, falling back to local storage.", error);
            loadStateFromLocalStorage();
        }
    } else {
        loadStateFromLocalStorage();
    }
    setIsDriveSyncing(false);
    isInitialLoad.current = false;
  }, [loadStateFromLocalStorage]);

  useEffect(() => {
    driveService.initClient(handleUpdateAuthStatus).catch(error => {
        console.error("Google Drive client initialization failed:", error);
        loadStateFromLocalStorage();
        setIsDriveSyncing(false);
        isInitialLoad.current = false;
    });
  }, [handleUpdateAuthStatus, loadStateFromLocalStorage]);
  
  // Debounce the entire app data for saving
  const appDataToSave = useMemo<AppData>(() => ({
      users, customModels, apiKeys, settings, galleryRoot, connectedConnectorIds, logs
  }), [users, customModels, apiKeys, settings, galleryRoot, connectedConnectorIds, logs]);

  const debouncedAppData = useDebounce(appDataToSave, 1500);

  useEffect(() => {
      // Don't save on initial load until syncing is complete
      if (isInitialLoad.current || isDriveSyncing) return;
      
      if (isDriveConnected) {
          console.log("Saving state to Google Drive...");
          driveService.saveAppData(debouncedAppData).catch(err => console.error("Failed to save to Drive", err));
      } else {
          console.log("Saving state to Local Storage...");
          try {
              localStorage.setItem('sarLegacyUsers', JSON.stringify(debouncedAppData.users));
              localStorage.setItem('customModels', JSON.stringify(debouncedAppData.customModels));
              localStorage.setItem('apiKeys', JSON.stringify(debouncedAppData.apiKeys));
              localStorage.setItem('appSettings', JSON.stringify(debouncedAppData.settings));
              localStorage.setItem('galleryRoot', JSON.stringify(debouncedAppData.galleryRoot));
              localStorage.setItem('connectedConnectorIds', JSON.stringify(debouncedAppData.connectedConnectorIds));
              localStorage.setItem('activityLogs', JSON.stringify(debouncedAppData.logs));
          } catch (error) {
              console.error("Failed to save to Local Storage", error);
          }
      }
  }, [debouncedAppData, isDriveConnected, isDriveSyncing]);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem('sarLegacyLoggedInUser');
        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            if (users.some(u => u.id === user.id)) {
                setCurrentUser(user);
            }
        }
    } catch (error) {
        console.error("Failed to parse stored user from localStorage", error);
    }
  }, [users]);
  
  useEffect(() => {
    if (settings.openLastUsedPanel && !isInitialLoad.current) {
        try {
            const savedView = localStorage.getItem('sarLegacyLastActiveView') as MainView;
            if (savedView && savedView !== 'chat') {
                setActiveView(savedView);
            }
        } catch(e) { console.error("Could not load last active view", e); }
    }
  }, [settings.openLastUsedPanel]);

  useEffect(() => {
      try { localStorage.setItem('sarLegacyLastActiveView', activeView); } catch(e) { console.error(e) }
  }, [activeView]);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    let effectiveTheme = settings.theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : settings.theme;
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    body.classList.add(effectiveTheme);
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    body.classList.toggle('compact', settings.compactUI);
    body.classList.toggle('animations-disabled', settings.animationsDisabled);

  }, [settings]);

  useEffect(() => {
    if (activeModel.provider === 'SAR LEGACY') {
      chat.current = createChatSession(activeModel, undefined, settings.modelConfig, settings.systemInstruction);
    } else {
      chat.current = null;
    }
  }, [settings.modelConfig, activeModel, settings.systemInstruction]);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.microphoneLanguage;
      recognition.onresult = (event) => setInputValue(Array.from(event.results).map(r => r[0].transcript).join(''));
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (event) => { console.error(event.error); setIsRecording(false); };
      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported.");
    }
  }, [settings.microphoneLanguage]);

  useEffect(() => {
    if (chatContainerRef.current && settings.autoScroll && !isSearchActive) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, settings.autoScroll, isSearchActive]);

  useEffect(() => {
      if (searchTerm) {
          const results = messages.filter(m => m.text?.toLowerCase().includes(searchTerm.toLowerCase())).map(m => m.id);
          setSearchResults(results);
          setCurrentResultIndex(results.length > 0 ? 0 : null);
      } else {
          setSearchResults([]);
          setCurrentResultIndex(null);
      }
  }, [searchTerm, messages]);

  useEffect(() => {
      if (currentResultIndex !== null && searchResults.length > 0) {
          const messageId = searchResults[currentResultIndex];
          document.getElementById(`message-${messageId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [currentResultIndex, searchResults]);
  
  const checkModelStatus = useCallback(() => {
    setModelStatus('checking');
    setModelStatusMessage('Verifying connection...');

    setTimeout(() => {
        if (!navigator.onLine) {
            setModelStatus('offline');
            setModelStatusMessage('No internet connection.');
            return;
        }

        if (activeModel.provider !== 'SAR LEGACY') {
            const hasActiveKey = apiKeys.some(k => k.provider === activeModel.provider && k.status === 'active');
            if (!hasActiveKey) {
                setModelStatus('degraded');
                setModelStatusMessage(`No active API key found for ${activeModel.provider}. Please add one in the Admin Panel.`);
                return;
            }
        }
        setModelStatus('online');
        setModelStatusMessage('Connected and ready.');
    }, 750);
  }, [activeModel, apiKeys]);

  useEffect(() => {
      checkModelStatus();
  }, [activeModel, apiKeys, checkModelStatus]);

  useEffect(() => {
      const handleOnline = () => checkModelStatus();
      const handleOffline = () => {
          setModelStatus('offline');
          setModelStatusMessage('No internet connection.');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
      };
  }, [checkModelStatus]);
  
  const handleClearChat = useCallback(() => {
    if (confirm("Are you sure you want to clear the current chat history? This action cannot be undone.")) {
      setMessages([]);
      speechSynthesis.cancel();
      setCurrentlySpeakingMessageId(null);
      setSessionTokenCount({ prompt: 0, response: 0 });
      setActiveDocument(null);
      if (activeModel.provider === 'SAR LEGACY') {
          chat.current = createChatSession(activeModel, undefined, settings.modelConfig, settings.systemInstruction);
      } else {
          chat.current = null;
      }
    }
  }, [activeModel, settings.modelConfig, settings.systemInstruction]);

  const handleSelectModel = useCallback((model: CustomModel) => {
    setActiveModel(model);
    setActiveView('chat');
    handleClearChat();
  }, [handleClearChat]);

  const handleLogin = useCallback(({ username, password, keepLoggedIn }: { username: string; password: string; keepLoggedIn: boolean; }) => {
    if (username === 'sar' && password === '1234') {
        const adminUser = users.find(u => u.role === 'admin');
        if (adminUser) {
            const updatedUser = { ...adminUser, lastLogin: new Date().toISOString() };
            setCurrentUser(updatedUser);
            setUsers(currentUsers => currentUsers.map(u => u.id === adminUser.id ? updatedUser : u));
            if (keepLoggedIn) {
                try { localStorage.setItem('sarLegacyLoggedInUser', JSON.stringify(updatedUser)); } catch (e) { console.error(e); }
            }
            addLogEntry('User Login', { user: adminUser.name });
            return true;
        }
    }
    addLogEntry('Failed Login Attempt', { username });
    return false;
  }, [users, addLogEntry]);

  const handleLogout = useCallback(() => {
      if (settings.privacySettings.autoClearOnLogout) {
          handleClearChat();
      }
      addLogEntry('User Logout', { user: currentUser?.name });
      setCurrentUser(null);
      setSessionTokenCount({ prompt: 0, response: 0 });
      setActiveDocument(null);
      try { localStorage.removeItem('sarLegacyLoggedInUser'); } catch (e) { console.error(e); }
  }, [currentUser?.name, addLogEntry, settings.privacySettings.autoClearOnLogout, handleClearChat]);

  useEffect(() => {
    const timeoutMinutes = settings.privacySettings.sessionTimeoutMinutes;
    if (timeoutMinutes === 0 || !currentUser) return;

    let timeoutId: number;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        addLogEntry('Session Timeout');
        handleLogout();
      }, timeoutMinutes * 60 * 1000);
    };

    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [settings.privacySettings.sessionTimeoutMinutes, handleLogout, addLogEntry, currentUser]);

  const startSpeaking = useCallback((messageId: string, text: string) => {
    if (!text || !text.trim()) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setCurrentlySpeakingMessageId(null);
    speechSynthesis.speak(utterance);
    setCurrentlySpeakingMessageId(messageId);
  }, []);
  
  const handleToggleSpeech = useCallback((messageId: string, text: string) => {
    if (currentlySpeakingMessageId === messageId) {
      speechSynthesis.cancel();
      setCurrentlySpeakingMessageId(null);
    } else {
      startSpeaking(messageId, text);
    }
  }, [currentlySpeakingMessageId, startSpeaking]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    const text = messageText.trim();
    const currentAttachment = attachment;

    if (!text && !currentAttachment) return;

    playSound('send');
    speechSynthesis.cancel();
    setCurrentlySpeakingMessageId(null);
    setIsLoading(true);
    setInputValue('');
    setAttachment(null);

    const userMessage: ChatMessage = { 
      id: `user-${Date.now()}`,
      role: MessageRole.USER, 
      text,
      attachment: currentAttachment ? { url: currentAttachment.url, type: currentAttachment.file.type, name: currentAttachment.file.name, size: currentAttachment.file.size, } : undefined,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    if (currentAttachment && !activeDocument) {
      const { file, url } = currentAttachment;
      const newGalleryItem: GalleryItem = {
          id: `gallery-item-${Date.now()}`,
          type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('video/') ? 'video' : 'file'),
          name: file.name, date: new Date().toISOString(), src: url, alt: file.name, fileType: file.type, size: formatFileSize(file.size), file,
      };
      setGalleryRoot(prevRoot => galleryService.createFolder(prevRoot, prevRoot.id, newGalleryItem));
    }

    const isExplicitWebSearch = text.startsWith('/web ');
    const isCommand = text.startsWith('/');
    let isWebSearch = isExplicitWebSearch || (settings.webSearchDefault && !isCommand && !currentAttachment);
    const isVisualizationRequest = !isWebSearch && !currentAttachment && (/\b(visualize|chart|graph|plot)\b/i.test(text) || text.includes("Visualize Data"));
    let textToSend = text;

    if (activeDocument && updatedMessages.filter(m => m.role === MessageRole.USER).length === 1) {
        if (!activeDocument.file) {
            const errorMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: "The file content is not available for this session. Please re-upload the document to analyze it." };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
        try {
            const content = await fileService.extractTextFromFile(activeDocument.file);
            textToSend = `Based on the following document, please answer the user's question.\n\nDOCUMENT CONTENT:\n---\n${content}\n---\n\nUSER QUESTION:\n${text}`;
        } catch (error) {
            const errorText = error instanceof Error ? error.message : "Sorry, I could not read the document content.";
            const errorMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: errorText };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
    }


    if (isWebSearch) {
        const query = isExplicitWebSearch ? text.substring(5).trim() : text;
        if (!query) {
            const errorMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: "Please provide a query to search the web. For example: `/web latest AI news`" };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await generateContentWithGoogleSearch(query);
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: response.text, groundingChunks: groundingChunks, };
            setMessages(prev => [...prev, modelMessage]);
            if (modelMessage.text) {
                if (settings.enableTTS) startSpeaking(modelMessage.id, modelMessage.text);
                playSound('messageReceived');
            }
        } catch (error) {
            const errorText = error instanceof Error ? error.message : "Sorry, I encountered an error while searching the web.";
            const errorMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: errorText };
            setMessages(prev => [...prev, errorMessage]);
            if (settings.enableTTS) startSpeaking(errorMessage.id, errorText);
        } finally {
            setIsLoading(false);
        }
    } else if (isVisualizationRequest) {
      try {
        const chartData = await generateChartData(text);
        const modelMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: chartData.title || "Here is the chart you requested.", chartData: chartData, };
        setMessages(prev => [...prev, modelMessage]);
         if (modelMessage.text) {
            if (settings.enableTTS) startSpeaking(modelMessage.id, modelMessage.text);
            playSound('messageReceived');
        }
      } catch (error) {
        const errorText = error instanceof Error ? error.message : "Sorry, I couldn't create a chart.";
        const errorMessage: ChatMessage = { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: errorText };
        setMessages(prev => [...prev, errorMessage]);
        if (settings.enableTTS) startSpeaking(errorMessage.id, errorText);
      } finally {
        setIsLoading(false);
      }
    } else {
        let session: Chat | null = chat.current;
        let keyToUse: ApiKey | undefined;

        if (activeModel.provider !== 'SAR LEGACY') {
            const availableKeys = apiKeys.filter(k => k.provider === activeModel.provider && k.status === 'active');
            if (availableKeys.length === 0) {
                const errorText = `No active API Key found for ${activeModel.provider}. Please add one in the Admin Panel.`;
                setMessages(prev => [...prev, { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: errorText }]);
                setIsLoading(false); return;
            }
            keyToUse = availableKeys.sort((a, b) => new Date(a.lastUsed || 0).getTime() - new Date(b.lastUsed || 0).getTime())[0];
            session = createChatSession(activeModel, keyToUse.key, settings.modelConfig, settings.systemInstruction);
        }

        if (!session) { 
            const errorText = "Chat session could not be started. Please check your model configuration.";
            setMessages(prev => [...prev, { id: `model-${Date.now()}`, role: MessageRole.MODEL, text: errorText }]);
            setIsLoading(false); return; 
        }
        
        const messageId = `model-${Date.now()}`;
        try {
            setMessages(prev => [...prev, { id: messageId, role: MessageRole.MODEL, text: '' }]);
            
            const messageParts = currentAttachment ? [ textToSend, { inlineData: { data: currentAttachment.url.split(',')[1], mimeType: currentAttachment.file.type } } ] : [textToSend];
            // Fix: Pass message content in a `SendMessageParameters` object.
            const streamResult = await session.sendMessageStream({ message: messageParts });

            // Fix: Handle different return types from real SDK (AsyncGenerator) and mock ({stream, response}).
            // The real SDK stream does not provide usage metadata, so token counting will only work for mocked providers.
            const isRealSDKResponse = typeof (streamResult as any)[Symbol.asyncIterator] === 'function';

            const stream = isRealSDKResponse ? streamResult : (streamResult as any).stream;
            const responsePromise = isRealSDKResponse ? null : (streamResult as any).response;

            let accumulatedText = '';
            for await (const chunk of stream as AsyncGenerator<GenerateContentResponse>) {
              accumulatedText += chunk.text;
              setMessages(prev => prev.map(m => m.id === messageId ? { ...m, text: accumulatedText } : m));
            }
            
            if (responsePromise) {
                const finalResponse = await responsePromise;
                const usageMetadata = finalResponse.usageMetadata;
                
                if (usageMetadata) {
                    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, usageMetadata } : m));
                    setSessionTokenCount(prev => ({ prompt: prev.prompt + (usageMetadata.promptTokenCount || 0), response: prev.response + (usageMetadata.candidatesTokenCount || 0) }));
                }

                if (keyToUse) {
                    setApiKeys(prev => prev.map(k => k.id === keyToUse!.id ? { ...k, requestCount: k.requestCount + 1, lastUsed: new Date().toISOString(), tokenUsage: (k.tokenUsage || 0) + (usageMetadata?.totalTokenCount || 0), } : k));
                }
            }

            if (accumulatedText) {
                if (settings.enableTTS) startSpeaking(messageId, accumulatedText);
                playSound('messageReceived');
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, text: errorText } : m));
            if (settings.enableTTS) startSpeaking(messageId, errorText);
            playSound('messageReceived'); // Play sound even for error message
        } finally {
            setIsLoading(false);
        }
    }
  }, [attachment, settings, startSpeaking, activeModel, apiKeys, messages, activeDocument, playSound]);

  const handleMicClick = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      playSound('micOff');
    } else {
      setInputValue('');
      recognitionRef.current.start();
      playSound('micOn');
    }
    setIsRecording(!isRecording);
  }, [isRecording, playSound]);
  
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) { if (event.target) event.target.value = ''; return; }

    if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onloadend = () => {
            const url = reader.result as string;
            const newGalleryItem: GalleryItem = {
                id: `gallery-item-${Date.now()}`, type: 'file', name: file.name, date: new Date().toISOString(), src: url,
                fileType: file.type, size: formatFileSize(file.size), file: file,
            };
            setGalleryRoot(prevRoot => galleryService.createFolder(prevRoot, prevRoot.id, newGalleryItem));
            setActiveDocument(newGalleryItem);
            setMessages([{ id: `model-rag-intro-${Date.now()}`, role: MessageRole.MODEL, text: `Now analyzing "${file.name}". Ask me anything about its content.` }]);
            setAttachment(null);
        };
        reader.readAsDataURL(file);
    } else {
        const reader = new FileReader();
        reader.onloadend = () => { setAttachment({ file, url: reader.result as string }); setActiveDocument(null); };
        reader.readAsDataURL(file);
    }
    if (event.target) event.target.value = '';
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((settings.sendOnEnter && e.key === 'Enter' && !e.shiftKey) || (!settings.sendOnEnter && e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        handleSendMessage(inputValue);
    }
  }, [settings.sendOnEnter, inputValue, handleSendMessage]);

  const handleNextResult = useCallback(() => currentResultIndex !== null && setCurrentResultIndex((p) => (p! + 1) % searchResults.length), [currentResultIndex, searchResults.length]);
  const handlePrevResult = useCallback(() => currentResultIndex !== null && setCurrentResultIndex((p) => (p! - 1 + searchResults.length) % searchResults.length), [currentResultIndex, searchResults.length]);

  const handleAddUser = useCallback((user: Omit<User, 'id' | 'lastLogin'>) => {
    setUsers(prev => [...prev, { ...user, id: `user-${Date.now()}`, lastLogin: new Date().toISOString() }]);
    addLogEntry('User Created', { name: user.name, role: user.role });
  }, [addLogEntry]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
        try {
            const storedUser = localStorage.getItem('sarLegacyLoggedInUser');
            if (storedUser) {
                localStorage.setItem('sarLegacyLoggedInUser', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error(e);
        }
    }
    addLogEntry('User Updated', { name: updatedUser.name, id: updatedUser.id });
  }, [currentUser, addLogEntry]);

  const handleDeleteUser = useCallback((userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    if (userToDelete) {
      addLogEntry('User Deleted', { name: userToDelete.name, id: userId });
    }
  }, [users, addLogEntry]);
  
  const handleSaveModel = useCallback((modelToSave: CustomModel) => {
    const isEditing = customModels.some(m => m.id === modelToSave.id);
    setCustomModels(prev => isEditing ? prev.map(m => m.id === modelToSave.id ? modelToSave : m) : [...prev, { ...modelToSave, id: `custom-${Date.now()}` }]);
    setIsModelModalOpen(false);
    addLogEntry(isEditing ? 'Model Updated' : 'Model Created', { name: modelToSave.name });
  }, [customModels, addLogEntry]);

  const handleDeleteModel = useCallback((modelId: string) => {
    const modelToDelete = customModels.find(m => m.id === modelId);
    setCustomModels(prev => prev.filter(m => m.id !== modelId));
    if(modelToDelete) {
        addLogEntry('Model Deleted', { name: modelToDelete.name });
    }
  }, [customModels, addLogEntry]);
  
  const handleImportModels = useCallback((importedData: any) => {
    if (!Array.isArray(importedData)) {
        alert('Import failed: JSON file should contain an array of models.');
        return;
    }

    const newModels: CustomModel[] = [];
    let importCount = 0;
    let errorCount = 0;

    importedData.forEach((importedModel: any, index: number) => {
        if (
            typeof importedModel.name === 'string' &&
            typeof importedModel.provider === 'string' &&
            typeof importedModel.modelId === 'string' &&
            typeof importedModel.systemInstruction === 'string'
        ) {
            let newName = importedModel.name;
            const existingNames = new Set([...customModels.map(m => m.name), ...newModels.map(m => m.name)]);
            if (existingNames.has(newName)) {
                let counter = 1;
                let prospectiveName;
                do {
                    prospectiveName = `${importedModel.name} (${counter++})`;
                } while (existingNames.has(prospectiveName));
                newName = prospectiveName;
            }

            const newModel: CustomModel = {
                id: `custom-${Date.now()}-${index}`,
                name: newName,
                description: importedModel.description || '',
                category: importedModel.category || 'Custom',
                provider: importedModel.provider,
                modelId: importedModel.modelId,
                systemInstruction: importedModel.systemInstruction,
                icon: React.createElement(CpuChipIcon),
                isEditable: true,
            };
            newModels.push(newModel);
            importCount++;
        } else {
            errorCount++;
        }
    });

    if (newModels.length > 0) {
        setCustomModels(prev => [...prev, ...newModels]);
        addLogEntry('Models Imported', { count: newModels.length });
    }

    let alertMessage = '';
    if (importCount > 0) {
        alertMessage += `Successfully imported ${importCount} model(s).`;
    }
    if (errorCount > 0) {
        alertMessage += `\nSkipped ${errorCount} invalid model entry(s).`;
    }
    if (alertMessage) {
        alert(alertMessage.trim());
    }
  }, [customModels, addLogEntry]);

  const openAddModelModal = useCallback(() => { setEditingModel(null); setIsModelModalOpen(true); }, []);
  const openEditModelModal = useCallback((model: CustomModel) => { setEditingModel(model); setIsModelModalOpen(true); }, []);

  const handleAddApiKey = useCallback(async (key: Omit<ApiKey, 'id'|'requestCount'|'tokenUsage'|'lastUsed'|'createdAt'|'tokenLimit'|'healthCheckStatus'|'healthCheckReport'|'usageAnalysis'>) => {
    const newKey: ApiKey = { 
        ...key, 
        id: `key-${Date.now()}`, 
        requestCount: 0, 
        tokenUsage: 0, 
        lastUsed: null,
        createdAt: new Date().toISOString(),
        healthCheckStatus: 'checking',
        healthCheckReport: 'Performing initial health check...',
        usageAnalysis: '',
    };
    setApiKeys(prev => [...prev, newKey]);
    addLogEntry('API Key Added', { name: key.name, provider: key.provider });
    
    // Perform health check in the background
    const { status, report } = await performApiKeyHealthCheck(newKey);
    setApiKeys(prev => prev.map(k => k.id === newKey.id ? { ...k, healthCheckStatus: status, healthCheckReport: report } : k));
  }, [addLogEntry]);

  const handleUpdateApiKey = useCallback((updatedKey: ApiKey) => {
    setApiKeys(prev => prev.map(key => key.id === updatedKey.id ? updatedKey : key));
    addLogEntry('API Key Updated', { name: updatedKey.name });
  }, [addLogEntry]);

  const handleDeleteApiKey = useCallback((keyId: string) => {
    const keyToDelete = apiKeys.find(k => k.id === keyId);
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    if (keyToDelete) {
        addLogEntry('API Key Deleted', { name: keyToDelete.name });
    }
  }, [apiKeys, addLogEntry]);
  
  const handleDeleteApiKeys = useCallback((keyIds: string[]) => {
    const keysToDelete = apiKeys.filter(k => keyIds.includes(k.id));
    if (keysToDelete.length > 0) {
        setApiKeys(prev => prev.filter(key => !keyIds.includes(key.id)));
        addLogEntry('API Keys Deleted', { count: keyIds.length, names: keysToDelete.map(k => k.name).join(', ') });
    }
  }, [apiKeys, addLogEntry]);

  const handleRunHealthCheck = useCallback(async (keyId: string) => {
      setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, healthCheckStatus: 'checking', healthCheckReport: 'Performing health check...' } : k));
      const keyToCheck = apiKeys.find(k => k.id === keyId);
      if (!keyToCheck) return;

      const { status, report } = await performApiKeyHealthCheck(keyToCheck);
      setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, healthCheckStatus: status, healthCheckReport: report } : k));
      addLogEntry('API Key Health Check', { name: keyToCheck.name });
  }, [apiKeys, addLogEntry]);
  
  const handleRunUsageAnalysis = useCallback(async (keyId: string) => {
      setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, usageAnalysis: 'Generating analysis...' } : k));
      const keyToAnalyze = apiKeys.find(k => k.id === keyId);
      if (!keyToAnalyze) return;

      const report = await getApiKeyUsageAnalysis(keyToAnalyze);
      setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, usageAnalysis: report } : k));
      addLogEntry('API Key Analysis Ran', { name: keyToAnalyze.name });
  }, [apiKeys, addLogEntry]);

  const handleGalleryCreateFolder = useCallback((parentId: string, folderName: string) => {
    const newFolder: GalleryItem = { id: `folder-${Date.now()}`, type: 'folder', name: folderName, date: new Date().toISOString(), children: [] };
    setGalleryRoot(currentRoot => galleryService.createFolder(currentRoot, parentId, newFolder));
    addLogEntry('Folder Created', { name: folderName });
  }, [addLogEntry]);

  const handleGalleryRenameItem = useCallback((itemId: string, newName:string) => {
    setGalleryRoot(currentRoot => galleryService.renameItem(currentRoot, itemId, newName));
    addLogEntry('Item Renamed', { id: itemId, newName });
  }, [addLogEntry]);

  const handleGalleryDeleteItems = useCallback((itemIds: string[]) => {
    if (!confirm(`Are you sure you want to delete ${itemIds.length} item(s)? This action cannot be undone.`)) return;
    setGalleryRoot(currentRoot => galleryService.deleteItems(currentRoot, itemIds));
    addLogEntry('Items Deleted', { count: itemIds.length, ids: itemIds.join(', ') });
  }, [addLogEntry]);

  const handleGalleryMoveItems = useCallback((itemIds: string[], destinationId: string) => {
    setGalleryRoot(currentRoot => galleryService.moveItems(currentRoot, itemIds, destinationId));
    addLogEntry('Items Moved', { count: itemIds.length, destinationId });
  }, [addLogEntry]);
  
  const handleChatWithDocument = useCallback((item: GalleryItem) => {
    if (!item.file) { alert("To chat about this document from a previous session, please re-upload it."); return; }
    setActiveDocument(item);
    setActiveView('chat');
    setMessages([{ id: `model-rag-intro-${Date.now()}`, role: MessageRole.MODEL, text: `Now analyzing "${item.name}". Ask me anything about its content.` }]);
  }, []);

  const handleToggleConnector = useCallback(async (connectorId: string) => {
    const connector = mockConnectors.find(c => c.id === connectorId);
    const isCurrentlyConnected = connectedConnectorIds.includes(connectorId);
    const action = isCurrentlyConnected ? 'Connector Disconnected' : 'Connector Connected';
    
    if (connectorId === 'google-drive') {
        setIsDriveConnecting(true);
        try {
            if (isDriveConnected) {
                await driveService.signOut();
                setConnectedConnectorIds(prev => prev.filter(id => id !== 'google-drive'));
            } else {
                await driveService.signIn();
                setConnectedConnectorIds(prev => [...new Set([...prev, 'google-drive'])]);
            }
            addLogEntry(action, { name: connector?.name || connectorId });
        } catch (error) {
            console.error("Failed to toggle Google Drive connection:", error);
            alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsDriveConnecting(false);
        }
    } else {
        setConnectedConnectorIds(p => isCurrentlyConnected ? p.filter(id => id !== connectorId) : [...p, connectorId]);
        addLogEntry(action, { name: connector?.name || connectorId });
    }
  }, [isDriveConnected, addLogEntry, connectedConnectorIds]);

  const handleImagesGenerated = useCallback((images: GeneratedImageData[]) => {
    const aiGenerationsFolderId = 'ai-generations-folder';
    addLogEntry('Images Generated', { count: images.length });

    setGalleryRoot(currentRoot => {
        let updatedRoot = { ...currentRoot };
        const aiFolder = galleryService.findItem(updatedRoot, aiGenerationsFolderId);

        if (!aiFolder) {
            const newFolder: GalleryItem = {
                id: aiGenerationsFolderId,
                type: 'folder',
                name: 'AI Generations',
                date: new Date().toISOString(),
                children: []
            };
            updatedRoot = galleryService.createFolder(updatedRoot, 'root', newFolder);
        }
        
        const newImageItems: GalleryItem[] = images.map((img, index) => ({
            id: `gallery-item-${Date.now()}-${index}`,
            type: 'image',
            name: `AI Image - ${img.prompt.substring(0, 30).trim() || 'Untitled'}...`,
            src: `data:image/jpeg;base64,${img.base64}`,
            alt: img.prompt,
            prompt: img.prompt,
            date: new Date().toISOString(),
            size: formatFileSize(img.base64.length * 3 / 4),
            fileType: 'image/jpeg',
        }));
        
        let finalRoot = updatedRoot;
        for (const item of newImageItems.reverse()) { // Add new items to the top
            finalRoot = galleryService.createFolder(finalRoot, aiGenerationsFolderId, item);
        }
        
        return finalRoot;
    });

    setNotifications(prev => [
        { 
            id: Date.now(), 
            icon: <GenerateIcon className="w-5 h-5 text-purple-400" />, 
            title: `${images.length} Image(s) Generated`,
            description: "Your new images have been saved to the Gallery.", 
            timestamp: "Just now" 
        },
        ...prev
    ].slice(0, 10));

    playSound('notification');
    setActiveView('gallery');
  }, [addLogEntry, playSound]);
  
    const handleSaveEditedImage = useCallback((imageData: { base64: string, prompt: string, name: string }) => {
        const aiGenerationsFolderId = 'ai-generations-folder';
        addLogEntry('Image Edited', { name: imageData.name });

        setGalleryRoot(currentRoot => {
            let updatedRoot = { ...currentRoot };
            const aiFolder = galleryService.findItem(updatedRoot, aiGenerationsFolderId);

            if (!aiFolder) {
                const newFolder: GalleryItem = {
                    id: aiGenerationsFolderId, type: 'folder', name: 'AI Generations',
                    date: new Date().toISOString(), children: []
                };
                updatedRoot = galleryService.createFolder(updatedRoot, 'root', newFolder);
            }
            
            const newImageItem: GalleryItem = {
                id: `gallery-item-${Date.now()}`,
                type: 'image',
                name: imageData.name,
                src: `data:image/png;base64,${imageData.base64}`,
                alt: imageData.prompt,
                prompt: imageData.prompt,
                date: new Date().toISOString(),
                size: formatFileSize(imageData.base64.length * 3 / 4),
                fileType: 'image/png'
            };
            
            const finalRoot = galleryService.createFolder(updatedRoot, aiGenerationsFolderId, newImageItem);
            return finalRoot;
        });

        setNotifications(prev => [
            { 
                id: Date.now(), 
                icon: <GenerateIcon className="w-5 h-5 text-purple-400" />, 
                title: "Image Edit Complete",
                description: `"${imageData.name}" saved to Gallery.`, 
                timestamp: "Just now" 
            },
            ...prev
        ].slice(0, 10));
        
        playSound('notification');
    }, [addLogEntry, playSound]);

    const handleVideoGenerated = useCallback((videoData: { blob: Blob, prompt: string }) => {
        const aiGenerationsFolderId = 'ai-generations-folder';
        addLogEntry('Video Generated', { prompt: videoData.prompt });
    
        setGalleryRoot(currentRoot => {
            let updatedRoot = { ...currentRoot };
            const aiFolder = galleryService.findItem(updatedRoot, aiGenerationsFolderId);
    
            if (!aiFolder) {
                const newFolder: GalleryItem = {
                    id: aiGenerationsFolderId, type: 'folder', name: 'AI Generations',
                    date: new Date().toISOString(), children: []
                };
                updatedRoot = galleryService.createFolder(updatedRoot, 'root', newFolder);
            }
    
            const file = new File([videoData.blob], `ai-video-${Date.now()}.mp4`, { type: 'video/mp4' });
            const src = URL.createObjectURL(videoData.blob);
    
            const newVideoItem: GalleryItem = {
                id: `gallery-item-${Date.now()}`,
                type: 'video',
                name: `AI Video - ${videoData.prompt.substring(0, 30).trim() || 'Untitled'}...`,
                src: src,
                prompt: videoData.prompt,
                date: new Date().toISOString(),
                size: formatFileSize(videoData.blob.size),
                fileType: 'video/mp4',
                file: file,
            };
    
            return galleryService.createFolder(updatedRoot, aiGenerationsFolderId, newVideoItem);
        });
    
        setNotifications(prev => [
            { id: Date.now(), icon: <MovieIcon className="w-5 h-5 text-purple-400" />, title: "Video Generation Complete", description: "Your new video has been saved to the Gallery.", timestamp: "Just now" },
            ...prev
        ].slice(0, 10));
    
        playSound('notification');
        setActiveView('gallery');
    }, [addLogEntry, playSound]);

    const handleProjectGenerated = useCallback((data: { projectPlan: ProjectPlan, files: GeneratedFile[] }) => {
        const sarProjectsFolderId = 'sar-projects-folder';
        addLogEntry('SAR Project Generated', { name: data.projectPlan.projectName });

        setGalleryRoot(currentRoot => {
            let updatedRoot = { ...currentRoot };
            const projectsFolder = galleryService.findItem(updatedRoot, sarProjectsFolderId);
    
            if (!projectsFolder) {
                 const newFolder: GalleryItem = {
                    id: sarProjectsFolderId, type: 'folder', name: 'SAR Projects',
                    date: new Date().toISOString(), children: []
                };
                updatedRoot = galleryService.createFolder(updatedRoot, 'root', newFolder);
            }
    
            const newProjectItem: GalleryItem = {
                id: `sar-project-${Date.now()}`,
                type: 'sar_project',
                name: data.projectPlan.projectName,
                date: new Date().toISOString(),
                projectPlan: data.projectPlan,
                generatedFiles: data.files,
                size: `${data.files.length} files`,
            };
    
            return galleryService.createFolder(updatedRoot, sarProjectsFolderId, newProjectItem);
        });
    
        setNotifications(prev => [
            { id: Date.now(), icon: <SparkleIcon className="w-5 h-5 text-purple-400" />, title: "Project Generation Complete", description: `"${data.projectPlan.projectName}" saved to Gallery.`, timestamp: "Just now" },
            ...prev
        ].slice(0, 10));
    
        playSound('notification');
        setActiveView('gallery');
    }, [addLogEntry, playSound]);

    const handleEditImageRequest = useCallback((item: GalleryItem) => {
        setEditingImage(item);
    }, []);

  const handlePreviewSarProject = useCallback((item: GalleryItem) => {
    if (item.type !== 'sar_project' || !item.generatedFiles) return;
    setProjectToPreview(item);
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs([]);
    addLogEntry('Activity Log Cleared');
  }, [addLogEntry]);

  const handleMobileNav = (action: () => void) => {
      action();
      setIsSidebarOpen(false);
  };
    
  const handlePanelClick = (panel: MainView) => {
      setActiveView(panel);
      setIsSidebarOpen(false);
  };

  const suggestions = [
    { text: 'Recommend a movie', icon: <MovieIcon /> }, { text: 'Generate image', icon: <GenerateIcon /> },
    { text: 'Search Web', icon: <SearchIcon /> }, { text: 'Visualize Data', icon: <ChartBarIcon /> },
    { text: 'Write a post', icon: <WriteIcon /> }, { text: 'Data analysis', icon: <DataAnalysisIcon /> },
  ];
  
  const handleContextMenu = useCallback((event: React.MouseEvent, message: ChatMessage) => { event.preventDefault(); setContextMenu({ isOpen: true, position: { x: event.clientX, y: event.clientY }, message }); }, []);
  const handleCloseContextMenu = useCallback(() => setContextMenu(prev => ({ ...prev, isOpen: false, message: null })), []);
  
  const handleExportMessage = useCallback((message: ChatMessage) => {
    let content = '';
    const fileExtension = settings.exportFormat;
    const filename = `message-${message.id}.${fileExtension === 'markdown' ? 'md' : fileExtension}`;

    switch (settings.exportFormat) {
      case 'json': content = JSON.stringify(message, null, 2); break;
      case 'markdown': content = `**[${message.role}]**\n\n${message.attachment ? `*Attachment: ${message.attachment.name}*\n\n` : ''}${message.text || ''}`; break;
      default: content = `[${message.role}]\n\n${message.attachment ? `Attachment: ${message.attachment.name}\n\n` : ''}${message.text || ''}`; break;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [settings.exportFormat]);

   const handleExportChatHistory = useCallback(() => {
    if (messages.length === 0) {
      alert("Chat history is empty.");
      return;
    }
    let content = '';
    const fileExtension = settings.exportFormat;
    const filename = `sar-legacy-chat-history-${new Date().toISOString().split('T')[0]}.${fileExtension === 'markdown' ? 'md' : fileExtension}`;

    switch (settings.exportFormat) {
      case 'json':
        content = JSON.stringify(messages, null, 2);
        break;
      case 'markdown':
        content = messages.map(msg => `**[${msg.role}]** (${new Date(parseInt(msg.id.split('-')[1])).toLocaleString()})\n\n${msg.attachment ? `*Attachment: ${msg.attachment.name}*\n\n` : ''}${msg.text || ''}`).join('\n\n---\n\n');
        break;
      default:
        content = messages.map(msg => `[${msg.role}] (${new Date(parseInt(msg.id.split('-')[1])).toLocaleString()})\n\n${msg.attachment ? `Attachment: ${msg.attachment.name}\n\n` : ''}${msg.text || ''}`).join('\n\n---\n\n');
        break;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    addLogEntry('Chat History Exported');
  }, [messages, settings.exportFormat, addLogEntry]);

  const handleBackupAppData = useCallback(() => {
    try {
        const backupData = {
            users,
            customModels: customModels.map(({ icon, ...rest }) => rest), // Remove React component
            apiKeys,
            settings,
            galleryRoot: galleryService.stripFileObjects(galleryRoot), // Remove File objects
            connectedConnectorIds
        };
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sar-legacy-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addLogEntry('App Data Backed Up');
    } catch (error) {
        console.error("Failed to back up app data:", error);
        alert("An error occurred while creating the backup.");
    }
  }, [users, customModels, apiKeys, settings, galleryRoot, connectedConnectorIds, addLogEntry]);

  const handleRestoreAppData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File could not be read.");
            const data = JSON.parse(text);

            if (!data.users || !data.customModels || !data.settings) {
                throw new Error("Invalid backup file format.");
            }
            
            if (confirm("Are you sure you want to restore from this backup? This will overwrite all current settings, models, and user data.")) {
                setUsers(data.users);
                setCustomModels(data.customModels.map((m: any) => ({...m, icon: React.createElement(CpuChipIcon)})));
                setApiKeys(data.apiKeys || []);
                setSettings({ ...defaultSettings, ...data.settings });
                setGalleryRoot(data.galleryRoot || rootFolder);
                setConnectedConnectorIds(data.connectedConnectorIds || []);
                
                addLogEntry('App Data Restored');
                
                setTimeout(() => {
                    alert("Restore successful. The application will now reload.");
                    setTimeout(() => window.location.reload(), 1600);
                }, 100);
            }
        } catch (error) {
            console.error("Failed to restore app data:", error);
            alert(`Restore failed. Please ensure you are using a valid backup file. Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            if (event.target) event.target.value = '';
        }
    };
    reader.readAsText(file);
  }, [addLogEntry]);

  const handleResetApplication = useCallback(() => {
    if (confirm("WARNING: This will delete all local data, including users, custom models, and API keys, and log you out. Are you sure you want to proceed?")) {
        console.log("Resetting application...");
        localStorage.clear(); // Clear all local storage for the domain
        window.location.reload();
    }
  }, []);

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  if (isDriveSyncing) return (
      <div className="min-h-screen flex items-center justify-center p-4">
          <LoadingIndicator />
      </div>
  );

  const contextMenuOptions = [];
  if (contextMenu.message) {
    if (contextMenu.message.text?.trim()) {
      contextMenuOptions.push({ label: 'Copy Message', icon: <CopyIcon />, action: () => navigator.clipboard.writeText(contextMenu.message!.text), });
      if (settings.enableTTS && contextMenu.message.role === MessageRole.MODEL) {
        contextMenuOptions.push({ label: 'Read Aloud', icon: <SpeakerOnIcon />, action: () => handleToggleSpeech(contextMenu.message!.id, contextMenu.message!.text), });
      }
    }
    contextMenuOptions.push({ label: 'Export Message', icon: <DownloadIcon />, action: () => handleExportMessage(contextMenu.message!), });
  }

  const mainContentMap = {
    gallery: <Gallery onMenuClick={() => setIsSidebarOpen(true)} onClose={() => setActiveView('chat')} galleryRoot={galleryRoot} onCreateFolder={handleGalleryCreateFolder} onRenameItem={handleGalleryRenameItem} onDeleteItems={handleGalleryDeleteItems} onMoveItems={handleGalleryMoveItems} onChatWithDocument={handleChatWithDocument} onPreviewSarProject={handlePreviewSarProject} onEditImageRequest={handleEditImageRequest} />,
    studio: <SarStudio onMenuClick={() => setIsSidebarOpen(true)} onClose={() => setActiveView('chat')} onImagesGenerated={handleImagesGenerated} onVideoGenerated={handleVideoGenerated} onProjectGenerated={handleProjectGenerated} />,
    marketplace: <ModelMarketplace onMenuClick={() => setIsSidebarOpen(true)} onSelectModel={handleSelectModel} onClose={() => setActiveView('chat')} models={[...defaultModels, ...customModels]} onAddModel={openAddModelModal} onEditModel={openEditModelModal} onDeleteModel={handleDeleteModel} onImportModels={handleImportModels} />,
    connectors: <ConnectorsPanel onMenuClick={() => setIsSidebarOpen(true)} onClose={() => setActiveView('chat')} connectors={mockConnectors} connectedConnectorIds={connectedConnectorIds} onToggleConnector={handleToggleConnector} isConnecting={isDriveConnecting} />,
    chat: (
        <>
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none -z-10"></div>
            <header className="grid grid-cols-2 lg:grid-cols-3 items-center text-[var(--text-muted)]">
                <div className="flex items-center gap-2 md:gap-4 justify-start">
                     <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <MenuIcon />
                    </button>
                    <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-[var(--text-primary)]">{activeModel.name}</h1>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 text-xs rounded-full">{activeModel.provider}</span>
                    </div>
                    {settings.showStatusIndicator && <StatusIndicator status={modelStatus} tooltipText={modelStatusMessage} />}
                </div>
                
                <div className="hidden lg:flex justify-center">
                    <Clock />
                </div>

                <div className="flex items-center gap-2 sm:gap-4 justify-end col-start-2 lg:col-start-3">
                    {messages.length > 0 && (
                        <>
                            <button onClick={handleClearChat} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Clear chat history"><TrashIcon /></button>
                            <div className="flex items-center">
                                {isSearchActive ? (
                                    <div className="flex items-center gap-2 bg-[var(--bg-interactive)] rounded-full border border-[var(--border-primary)] p-1 animate-fade-in-down">
                                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent focus:outline-none text-sm px-2 w-24 sm:w-36" autoFocus />
                                        {searchTerm && <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{searchResults.length > 0 ? `${(currentResultIndex ?? -1) + 1} / ${searchResults.length}` : '0 / 0'}</span>}
                                        <button onClick={handlePrevResult} disabled={searchResults.length < 2} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] disabled:opacity-50" aria-label="Previous search result"><ChevronUpIcon className="w-4 h-4" /></button>
                                        <button onClick={handleNextResult} disabled={searchResults.length < 2} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] disabled:opacity-50" aria-label="Next search result"><ChevronDownIcon className="w-4 h-4" /></button>
                                        <button onClick={() => { setIsSearchActive(false); setSearchTerm(''); }} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close search"><CloseIcon className="w-4 h-4" /></button>
                                    </div>
                                ) : ( <button onClick={() => setIsSearchActive(true)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Search chat history"><SearchIcon /></button> )}
                            </div>
                        </>
                    )}
                    <button onClick={() => setIsProfilePanelOpen(true)} className="flex items-center gap-3 p-1 pr-2 sm:pr-4 rounded-full transition-colors hover:bg-[var(--bg-interactive)]" aria-label="Open user profile">
                        {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                                {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                        )}
                        <span className="font-semibold text-[var(--text-primary)] hidden sm:block">{currentUser.name}</span>
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[var(--text-primary)]" aria-label="Logout"><LogoutIcon /></button>
                    <div className="relative">
                        <button ref={notificationsButtonRef} onClick={() => setIsNotificationsOpen(p => !p)} className="flex items-center gap-2 hover:text-[var(--text-primary)]" aria-label="Toggle notifications">
                            <BellIcon />
                            {notifications.length > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center border-2 border-[var(--bg-secondary)]">{notifications.length}</div>}
                        </button>
                        <NotificationPanel isOpen={isNotificationsOpen} notifications={notifications} onClose={() => setIsNotificationsOpen(false)} onClearAll={() => { setNotifications([]); setIsNotificationsOpen(false); }} triggerRef={notificationsButtonRef} position={settings.notificationPosition} />
                    </div>
                </div>
            </header>
            
            {messages.length === 0 ? <WelcomeScreen /> : (
                <div ref={chatContainerRef} role="log" aria-live="polite" aria-busy={isLoading} className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4 space-y-6 py-4">
                    {messages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg} enableTTS={settings.enableTTS} isSpeaking={currentlySpeakingMessageId === msg.id} onToggleSpeech={handleToggleSpeech} onContextMenu={handleContextMenu} searchTerm={isSearchActive ? searchTerm : null} isHighlighted={currentResultIndex !== null && searchResults[currentResultIndex] === msg.id} userBubbleAlignment={settings.userBubbleAlignment} showTimestamps={settings.showTimestamps} />
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === MessageRole.USER && (
                    <div role="status" className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-interactive)] rounded-full flex-shrink-0 mt-1"><SarLogoIcon /></div>
                        <div className="rounded-2xl px-4 py-3 max-w-md bg-[var(--bg-interactive)] text-[var(--text-muted)] rounded-tl-none">
                            <div className="flex items-center gap-2 h-5 bounce-dot"><span className="sr-only">Typing...</span><span className="w-2 h-2 bg-current rounded-full"></span><span className="w-2 h-2 bg-current rounded-full"></span><span className="w-2 h-2 bg-current rounded-full"></span></div>
                        </div>
                    </div>
                    )}
                </div>
            )}

            <div className="mt-auto pt-4">
                {messages.length === 0 && !activeDocument && settings.showSuggestionChips && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {suggestions.map((s, i) => <SuggestionChip key={i} text={s.text} icon={s.icon} onClick={(text) => {
                        if (text === 'Search Web') { setInputValue('/web '); textareaRef.current?.focus(); }
                        else if (text === 'Generate image') { setActiveView('studio'); }
                        else { handleSendMessage(text); }
                    }} />)}
                </div>
                )}
                {activeDocument && (
                    <div className="mb-2 max-w-md p-2 bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-xl relative flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-md flex items-center justify-center flex-shrink-0"><FileTextIcon className="w-6 h-6 text-[var(--text-muted)]" /></div>
                        <div className="text-sm overflow-hidden flex-1"><p className="text-[var(--text-muted)] text-xs">Analyzing Document</p><p className="text-[var(--text-primary)] font-medium truncate">{activeDocument.name}</p></div>
                        <button onClick={() => setActiveDocument(null)} aria-label="Stop analyzing document" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full p-1"><CloseIcon className="w-4 h-4" /></button>
                    </div>
                )}
                {attachment && (
                    <div className="mb-2 max-w-sm p-2 bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-xl relative flex items-center gap-3">
                        {attachment.file.type.startsWith('image/') ? ( <img src={attachment.url} alt="Attachment preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" /> ) : ( <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-md flex items-center justify-center flex-shrink-0"><FileTextIcon className="w-8 h-8 text-[var(--text-muted)]" /></div> )}
                        <div className="text-sm overflow-hidden flex-1"><p className="text-[var(--text-primary)] font-medium truncate">{attachment.file.name}</p><p className="text-[var(--text-muted)]">{formatFileSize(attachment.file.size)}</p></div>
                        <button onClick={() => setAttachment(null)} aria-label="Remove attachment" className="absolute -top-2 -right-2 bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full p-1 border border-[var(--border-primary)]"><CloseIcon className="w-4 h-4" /></button>
                    </div>
                )}
                {settings.showTokenCount && messages.length > 0 && (
                    <div className="flex justify-end text-xs text-[var(--text-muted)] px-3 pb-2">
                        <span>Session Tokens: {sessionTokenCount.prompt + sessionTokenCount.response}</span>
                    </div>
                )}
                <form onSubmit={(e) => {e.preventDefault(); handleSendMessage(inputValue);}} className="bg-black/20 border border-[var(--border-primary)] rounded-2xl flex items-end p-2 pl-6 focus-within:border-purple-500 transition-colors">
                    <textarea ref={textareaRef} rows={1} placeholder={isRecording ? "Listening..." : (activeDocument ? `Ask about ${activeDocument.name}...` : "Enter Message")} className="flex-1 bg-transparent focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-lg resize-none overflow-y-auto max-h-40 custom-scrollbar" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading} aria-label="Chat input" />
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Add attachment"><PaperclipIcon /></button>
                    <button type="button" onClick={handleMicClick} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={isRecording ? 'Stop recording' : 'Start recording'}><MicrophoneIcon className={isRecording ? 'text-purple-500 animate-pulse' : ''} /></button>
                    <button type="submit" disabled={!(inputValue.trim() || attachment) || isLoading || modelStatus !== 'online'} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50" aria-label="Send message"><SendIcon /></button>
                </form>
            </div>
        </>
    )
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 text-[var(--text-primary)] font-sans overflow-hidden">
      <div className="w-full max-w-[1400px] h-[calc(100vh-1rem)] sm:h-[90vh] max-h-[900px] flex gap-4">
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} settingsButtonRef={settingsButtonRef} isAdmin={currentUser.role === 'admin'} onAdminClick={() => setIsAdminPanelOpen(true)} onPanelClick={setActiveView} />
        </div>
         {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                <div className="absolute top-0 left-0 h-full bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] shadow-lg animate-slide-in-left" onClick={e => e.stopPropagation()}>
                    <Sidebar
                        isAdmin={currentUser.role === 'admin'}
                        settingsButtonRef={settingsButtonRef}
                        onSettingsClick={() => handleMobileNav(() => setIsSettingsOpen(true))}
                        onAdminClick={() => handleMobileNav(() => setIsAdminPanelOpen(true))}
                        onPanelClick={handlePanelClick}
                    />
                </div>
            </div>
        )}
        <main className="flex-1 bg-[var(--bg-tertiary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-[32px] p-4 sm:p-8 flex flex-col relative overflow-hidden custom-scrollbar">
          <input type="file" ref={restoreFileInputRef} onChange={handleRestoreAppData} accept=".json" className="hidden" />
          {isSettingsOpen && <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSettingsChange={setSettings} onClearChat={handleClearChat} triggerRef={settingsButtonRef} activeModel={activeModel} onBackup={handleBackupAppData} onRestore={() => restoreFileInputRef.current?.click()} onReset={handleResetApplication} playSound={playSound} onExportChatHistory={handleExportChatHistory} />}
          {currentUser.role === 'admin' && isAdminPanelOpen && <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} users={users} onAddUser={handleAddUser} onUpdateUser={handleUpdateUser} onDeleteUser={handleDeleteUser} apiKeys={apiKeys} onAddApiKey={handleAddApiKey} onUpdateApiKey={handleUpdateApiKey} onDeleteApiKey={handleDeleteApiKey} onDeleteApiKeys={handleDeleteApiKeys} logs={logs} onClearLogs={handleClearLogs} onRunHealthCheck={handleRunHealthCheck} onRunUsageAnalysis={handleRunUsageAnalysis} />}
          {isProfilePanelOpen && <ProfilePanel user={currentUser} onClose={() => setIsProfilePanelOpen(false)} onUpdateUser={handleUpdateUser} />}
          {isModelModalOpen && <CustomModelModal model={editingModel} onSave={handleSaveModel} onClose={() => setIsModelModalOpen(false)} />}
          {projectToPreview && <SarProjectCanvas project={projectToPreview} onClose={() => setProjectToPreview(null)} />}
          {editingImage && <ImageEditor isOpen={!!editingImage} onClose={() => setEditingImage(null)} imageToEdit={editingImage} onSave={handleSaveEditedImage} />}
          
          {mainContentMap[activeView]}

        </main>
      </div>
      {contextMenu.isOpen && ( <ContextMenu isOpen={contextMenu.isOpen} position={contextMenu.position} options={contextMenuOptions} onClose={handleCloseContextMenu} /> )}
    </div>
  );
};

export default App;