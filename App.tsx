
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { 
  SarLegacyLogo, GalleryIcon, CalendarIcon, GridIcon, SettingsIcon,
  BellIcon, SparkleIcon, MicrophoneIcon, MovieIcon, GenerateIcon, WriteIcon,
  DataAnalysisIcon, MoreIcon, ChevronRightIcon, ChevronDownIcon, CloseIcon,
  SendIcon, SarLogoIcon, AlertTriangleIcon, ChartBarIcon, PaperclipIcon,
  ShieldIcon, LogoutIcon
} from './components/icons';
import { SuggestionChip } from './components/SuggestionChip';
import { createChatSession, generateChartData } from './services/geminiService';
import { ChatMessage, MessageRole, Notification, AppSettings, User, CustomModel } from './types';
import { ChatBubble } from './components/ChatBubble';
import { NotificationPanel } from './components/NotificationPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { LoginScreen } from './components/LoginScreen';
import { AdminPanel } from './components/admin/AdminPanel';
import { mockUsers } from './data/mockUsers';
import { ModelMarketplace } from './components/ModelMarketplace';
import { defaultModel } from './data/mockModels';
import { Gallery } from './components/Gallery';

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

// FIX: The Sidebar component was using 'settingsButtonRef' which was not in its scope. It is now passed in as a prop to fix the error.
const Sidebar: React.FC<{ 
  onSettingsClick: () => void; 
  onAdminClick: () => void;
  onMarketplaceClick: () => void;
  onGalleryClick: () => void;
  settingsButtonRef: React.RefObject<HTMLButtonElement>;
  isAdmin: boolean;
}> = ({ onSettingsClick, onAdminClick, onMarketplaceClick, onGalleryClick, settingsButtonRef, isAdmin }) => {
  const navItems = [
    { icon: <GalleryIcon />, label: 'Gallery', action: onGalleryClick },
    { icon: <CalendarIcon />, label: 'Calendar', action: () => alert('Calendar coming soon!') },
    { icon: <GridIcon />, label: 'Apps', action: onMarketplaceClick },
  ];
  return (
    <aside className="bg-[var(--bg-secondary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-[32px] flex flex-col items-center justify-between p-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <a href="#" aria-label="Homepage">
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
            <button onClick={onAdminClick} aria-label="Admin Panel" className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)] transition-colors">
                <ShieldIcon />
            </button>
        )}
        <button ref={settingsButtonRef} onClick={onSettingsClick} aria-label="Settings" className="p-2 rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)] transition-colors">
            <SettingsIcon />
        </button>
      </div>
    </aside>
  );
};

const WelcomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Favorites', 'Performance', 'Research and analysis', 'Education'];

  return (
    <>
      <div className="absolute top-8 right-8 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl p-4 flex items-start gap-3 max-w-xs shadow-2xl">
        <div className="text-yellow-400 mt-1">
          <SparkleIcon />
        </div>
        <div>
          <p className="font-semibold text-[var(--text-primary)]">You have a busy day today with lots of meetings.</p>
        </div>
        <button aria-label="Close welcome message" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <section className="mt-16 flex-shrink-0">
        <p className="text-[var(--text-muted)]">Good morning!</p>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-[var(--text-primary)] !leading-[1.1] mt-1">You're on a wave of<br/>productivity!</h1>
      </section>

      <section className="mt-12 flex-1 flex flex-col min-h-0">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Discover</h2>
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {filters.map(filter => (
            <FilterChip key={filter} text={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 custom-scrollbar -mr-4 pr-4">
          <DataCard title="Heart rate" subtitle="online" value="67" unit="BPM" chart={<svg viewBox="0 0 100 30" className="w-full h-8 mt-2"><path d="M0 20 C 10 5, 20 5, 30 20 S 50 35, 60 20 S 80 5, 90 20" fill="none" stroke="#A855F7" strokeWidth="2"/></svg>} />
          <DataCard title="Training program" subtitle="Tomorrow" value="24" unit="days" chart={<div className="w-full h-8 mt-2 bg-black/10 dark:bg-white/5 rounded-md"><div className="h-full bg-purple-500 rounded-md" style={{width: '75%'}}></div></div>} />
          <DataCard title="Sleep score" subtitle="Cycle" value="7.4" unit="Hours" className="bg-gradient-to-br from-purple-600 to-indigo-700 !border-purple-500" chart={<svg viewBox="0 0 100 30" className="w-full h-8 mt-2 opacity-75">{[...Array(15)].map((_, i) => <rect key={i} x={i * 6.5} y={30 - (10 + Math.sin(i*0.8)*8 + 5)} width="4" height={30} fill="white" />)}</svg>} />
          <DataCard title="Steps" subtitle="Today" value="8,452" unit="steps" chart={<div className="w-full h-8 mt-2 bg-black/10 dark:bg-white/5 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: '60%'}}></div></div>} />
          <DataCard title="Calories" subtitle="Burned" value="1,203" unit="kcal" chart={<svg viewBox="0 0 100 30" className="w-full h-8 mt-2"><path d="M0 25 C 20 25, 15 5, 40 15 S 70 28, 100 10" fill="none" stroke="#22D3EE" strokeWidth="2"/></svg>} />
        </div>
      </section>
    </>
  );
};

const FilterChip: React.FC<{ text: string; active?: boolean; onClick: () => void; }> = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      active
        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
        : 'bg-[var(--bg-interactive)] text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'
    }`}
  >
    {text}
  </button>
);

const DataCard: React.FC<{ title: string; subtitle: string; value: string; unit: string; chart: React.ReactNode; className?: string; }> = ({ title, subtitle, value, unit, chart, className = '' }) => (
  <button aria-label={`View details for ${title}`} className={`bg-[var(--bg-interactive)] border border-transparent hover:border-[var(--border-primary)] rounded-2xl p-4 flex flex-col justify-between h-48 text-left transition-colors ${className}`}>
    <div>
      <div className="flex justify-between items-center text-[var(--text-muted)]">
        <span>{title}</span>
        <ChevronRightIcon />
      </div>
      <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-[var(--text-primary)]">{value}</span>
        <span className="text-[var(--text-muted)]">{unit}</span>
      </div>
      {chart}
    </div>
  </button>
);

const initialNotifications: Notification[] = [
    {
        id: 1,
        icon: <CalendarIcon className="w-5 h-5 text-blue-400" />,
        title: "Project Sync-Up",
        description: "Your meeting with the design team starts in 15 minutes.",
        timestamp: "10m ago"
    },
    {
        id: 2,
        icon: <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />,
        title: "System Maintenance",
        description: "Scheduled maintenance will occur tonight at 11 PM PST.",
        timestamp: "1h ago"
    },
    {
        id: 3,
        icon: <GenerateIcon className="w-5 h-5 text-purple-400" />,
        title: "Image Generation Complete",
        description: "Your requested image 'Cyberpunk City' is ready.",
        timestamp: "3h ago"
    }
];

const defaultSettings: AppSettings = {
    theme: 'dark',
    modelConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
    },
    microphoneLanguage: 'en-US',
    enableTTS: true,
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  const [activeModel, setActiveModel] = useState<CustomModel>(defaultModel);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentlySpeakingMessageId, setCurrentlySpeakingMessageId] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<{ file: File; url: string } | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
        const storedSettings = localStorage.getItem('appSettings');
        return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return defaultSettings;
    }
  });

  const chat = useRef<Chat | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
    
    // Apply theme
    const root = window.document.documentElement;
    const body = window.document.body;
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    let effectiveTheme = settings.theme;
    if (effectiveTheme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (effectiveTheme === 'light') {
        root.classList.add('light');
        body.classList.add('light');
    } else {
        root.classList.add('dark');
        body.classList.add('dark');
    }

    // Re-initialize chat session if model configs have changed
    chat.current = createChatSession(settings.modelConfig, activeModel.systemInstruction);

  }, [settings]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.microphoneLanguage;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, [settings.microphoneLanguage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleSelectModel = (model: CustomModel) => {
    setActiveModel(model);
    setIsMarketplaceOpen(false);
    setMessages([]); // Clear chat history for the new model session
    speechSynthesis.cancel();
    setCurrentlySpeakingMessageId(null);
    chat.current = createChatSession(settings.modelConfig, model.systemInstruction);
  };

  const handleLogin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        const updatedUser = { ...user, lastLogin: new Date().toISOString() };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setMessages([]); // Clear chat on logout
  };

  const startSpeaking = (messageId: string, text: string) => {
    if (!text || !text.trim()) return;
    speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setCurrentlySpeakingMessageId(null);
    speechSynthesis.speak(utterance);
    setCurrentlySpeakingMessageId(messageId);
  };
  
  const handleToggleSpeech = (messageId: string, text: string) => {
    if (currentlySpeakingMessageId === messageId) {
      speechSynthesis.cancel();
      setCurrentlySpeakingMessageId(null);
    } else {
      startSpeaking(messageId, text);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    const text = messageText.trim();
    const currentAttachment = attachment;

    if (!text && !currentAttachment) return;

    // Stop any currently playing speech when sending a new message
    speechSynthesis.cancel();
    setCurrentlySpeakingMessageId(null);

    setIsLoading(true);
    setInputValue('');
    setAttachment(null);

    const userMessage: ChatMessage = { 
      id: `user-${Date.now()}`,
      role: MessageRole.USER, 
      text,
      attachment: currentAttachment ? { url: currentAttachment.url, type: currentAttachment.file.type } : undefined,
    };
    setMessages(prev => [...prev, userMessage]);

    const isVisualizationRequest = !currentAttachment && (/\b(visualize|chart|graph|plot)\b/i.test(text) || text.includes("Visualize Data"));

    if (isVisualizationRequest) {
      try {
        const chartData = await generateChartData(text);
        const modelMessage: ChatMessage = {
          id: `model-${Date.now()}`,
          role: MessageRole.MODEL,
          text: chartData.title || "Here is the chart you requested.",
          chartData: chartData,
        };
        setMessages(prev => [...prev, modelMessage]);
        if (settings.enableTTS && modelMessage.text) {
          startSpeaking(modelMessage.id, modelMessage.text);
        }
      } catch (error) {
        console.error("Error handling visualization request:", error);
        const errorMessage: ChatMessage = {
          id: `model-${Date.now()}`,
          role: MessageRole.MODEL,
          text: error instanceof Error ? error.message : "Sorry, I couldn't create a chart for that. Please try a different request.",
        };
        setMessages(prev => [...prev, errorMessage]);
        if (settings.enableTTS) {
          startSpeaking(errorMessage.id, errorMessage.text);
        }
      } finally {
        setIsLoading(false);
      }
    } else { // Regular chat logic with potential attachment
        if (!chat.current) {
            setIsLoading(false);
            return;
        }
        const messageId = `model-${Date.now()}`;
        try {
            setMessages(prev => [...prev, { id: messageId, role: MessageRole.MODEL, text: '' }]);

            let stream;
            if (currentAttachment) {
                const base64Data = currentAttachment.url.split(',')[1];
                const imagePart = { inlineData: { data: base64Data, mimeType: currentAttachment.file.type } };
                const parts: any[] = [{ text }];
                if (imagePart.inlineData.data) {
                    parts.push(imagePart);
                }
                // FIX: The `sendMessageStream` method expects a `message` property that can be a string or an array of parts for multimodal input. The original code was incorrectly passing a `parts` property.
                stream = await chat.current.sendMessageStream({ message: parts });
            } else {
                stream = await chat.current.sendMessageStream({ message: text });
            }

            let accumulatedText = '';
            for await (const chunk of stream) {
            accumulatedText += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessageIndex = newMessages.findIndex(m => m.id === messageId);
                if (lastMessageIndex !== -1) {
                    newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], text: accumulatedText };
                }
                return newMessages;
            });
            }
            if (settings.enableTTS) {
                startSpeaking(messageId, accumulatedText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorText = "Sorry, I encountered an error. Please try again.";
            const errorMessage = { id: messageId, role: MessageRole.MODEL, text: errorText };
            setMessages(prev => {
                const newMessages = [...prev];
                const msgIndex = newMessages.findIndex(m => m.id === messageId);
                if (msgIndex !== -1) {
                    newMessages[msgIndex] = errorMessage;
                } else {
                    newMessages.push(errorMessage);
                }
                return newMessages;
            });
            if (settings.enableTTS) {
                startSpeaking(errorMessage.id, errorMessage.text);
            }
        } finally {
            setIsLoading(false);
        }
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setInputValue('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };
  
  const handleClearChat = () => {
    setMessages([]);
    speechSynthesis.cancel();
    setCurrentlySpeakingMessageId(null);
    chat.current = createChatSession(settings.modelConfig, activeModel.systemInstruction); // Reset chat history on Gemini's side
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachment({ file, url: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
  };

  // User Management Handlers
  const handleAddUser = (user: Omit<User, 'id' | 'lastLogin'>) => {
    const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        lastLogin: new Date().toISOString()
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };
  
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };
  
  const openMarketplace = () => {
    setIsGalleryOpen(false);
    setIsMarketplaceOpen(true);
  };

  const openGallery = () => {
    setIsMarketplaceOpen(false);
    setIsGalleryOpen(true);
  };

  const suggestions = [
    { text: 'Recommend a movie', icon: <MovieIcon /> },
    { text: 'Generate image', icon: <GenerateIcon /> },
    { text: 'Visualize Data', icon: <ChartBarIcon /> },
    { text: 'Write a post', icon: <WriteIcon /> },
    { text: 'Data analysis', icon: <DataAnalysisIcon /> },
    { text: 'More', icon: <MoreIcon /> },
  ];

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[var(--text-primary)] font-sans overflow-hidden">
      <div className="w-full max-w-[1400px] h-[90vh] max-h-[900px] flex gap-4">
        {/* FIX: Pass the settingsButtonRef prop to the Sidebar component. */}
        <Sidebar 
            onSettingsClick={() => setIsSettingsOpen(true)} 
            settingsButtonRef={settingsButtonRef}
            isAdmin={currentUser.role === 'admin'}
            onAdminClick={() => setIsAdminPanelOpen(true)}
            onMarketplaceClick={openMarketplace}
            onGalleryClick={openGallery}
        />
        <main className="flex-1 bg-[var(--bg-tertiary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-[32px] p-8 flex flex-col relative overflow-hidden custom-scrollbar">
          <SettingsPanel
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              settings={settings}
              onSettingsChange={setSettings}
              onClearChat={handleClearChat}
              triggerRef={settingsButtonRef}
            />
            {currentUser.role === 'admin' && (
                <AdminPanel 
                    isOpen={isAdminPanelOpen}
                    onClose={() => setIsAdminPanelOpen(false)}
                    users={users}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}
            
            {isGalleryOpen ? (
                <Gallery onClose={() => setIsGalleryOpen(false)} />
            ) : isMarketplaceOpen ? (
                <ModelMarketplace onSelectModel={handleSelectModel} onClose={() => setIsMarketplaceOpen(false)} />
            ) : (
             <>
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none -z-10"></div>
                <header className="flex items-center justify-between text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-[var(--text-primary)]">{activeModel.name}</h1>
                    <span className="bg-[var(--bg-interactive-hover)] text-[var(--text-primary)] px-2 py-0.5 text-xs rounded-full">BETA</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">Welcome, <span className="font-semibold text-[var(--text-primary)]">{currentUser.name}</span></div>
                        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors" aria-label="Logout">
                            <LogoutIcon />
                        </button>
                        <div className="relative">
                        <button ref={notificationsButtonRef} onClick={() => setIsNotificationsOpen(prev => !prev)} className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors" aria-label="Toggle notifications">
                            <BellIcon />
                            {notifications.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center border-2 border-[var(--bg-secondary)]">
                                {notifications.length}
                            </div>
                            )}
                        </button>
                        <NotificationPanel
                            isOpen={isNotificationsOpen}
                            notifications={notifications}
                            onClose={() => setIsNotificationsOpen(false)}
                            onClearAll={() => {
                                setNotifications([]);
                                setIsNotificationsOpen(false);
                            }}
                            triggerRef={notificationsButtonRef}
                            />
                        </div>
                    </div>
                </header>
                
                {messages.length === 0 ? <WelcomeScreen /> : (
                    <div ref={chatContainerRef} role="log" aria-live="polite" aria-busy={isLoading} className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4 space-y-6 py-4">
                        {messages.map((msg) => (
                        <ChatBubble 
                            key={msg.id} 
                            message={msg}
                            enableTTS={settings.enableTTS}
                            isSpeaking={currentlySpeakingMessageId === msg.id}
                            onToggleSpeech={handleToggleSpeech}
                        />
                        ))}
                        {isLoading && messages[messages.length -1].role === MessageRole.USER && (
                        <div role="status" className="flex items-start gap-3 justify-start">
                            <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-interactive)] rounded-full flex-shrink-0 mt-1">
                                <SarLogoIcon />
                            </div>
                            <div className="rounded-2xl px-4 py-3 max-w-md bg-[var(--bg-interactive)] text-[var(--text-muted)] rounded-tl-none">
                                <div className="flex items-center gap-2 h-5">
                                    <span className="sr-only">Assistant is typing...</span>
                                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-4">
                    {messages.length === 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {suggestions.map((suggestion, index) => (
                        <SuggestionChip key={index} text={suggestion.text} icon={suggestion.icon} onClick={handleSendMessage} />
                        ))}
                    </div>
                    )}
                    {attachment && (
                        <div className="mb-2 w-28 h-28 p-2 bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-xl relative">
                            <img src={attachment.url} alt="Attachment preview" className="w-full h-full object-cover rounded-md" />
                            <button
                                onClick={handleRemoveAttachment}
                                aria-label="Remove attachment"
                                className="absolute -top-2 -right-2 bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full p-1 border border-[var(--border-primary)]"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="mt-4 bg-black/20 border border-[var(--border-primary)] rounded-2xl flex items-center p-2 pl-6 focus-within:border-purple-500 transition-colors">
                    <input
                        type="text"
                        placeholder={isRecording ? "Listening..." : "Enter Message"}
                        className="flex-1 bg-transparent focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-lg"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*"
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label="Add attachment">
                            <PaperclipIcon />
                        </button>
                    <button type="button" onClick={handleMicClick} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
                        <MicrophoneIcon className={isRecording ? 'text-purple-500 animate-pulse' : ''} />
                    </button>
                    <button type="submit" disabled={!(inputValue.trim() || attachment) || isLoading} className="p-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50 disabled:hover:text-[var(--text-muted)]" aria-label="Send message">
                        <SendIcon />
                    </button>
                    </form>
                </div>
             </>
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
