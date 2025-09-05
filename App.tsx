
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { 
  SarLegacyLogo, GalleryIcon, CalendarIcon, GridIcon, SettingsIcon,
  BellIcon, SparkleIcon, MicrophoneIcon, MovieIcon, GenerateIcon, WriteIcon,
  DataAnalysisIcon, MoreIcon, ChevronRightIcon, ChevronDownIcon, CloseIcon,
  SendIcon, SarLogoIcon, AlertTriangleIcon, ChartBarIcon
} from './components/icons';
import { SuggestionChip } from './components/SuggestionChip';
import { createChatSession, generateChartData } from './services/geminiService';
import { ChatMessage, MessageRole, Notification, AppSettings } from './types';
import { ChatBubble } from './components/ChatBubble';
import { NotificationPanel } from './components/NotificationPanel';
import { SettingsPanel } from './components/SettingsPanel';

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

const Sidebar: React.FC<{ onSettingsClick: () => void }> = ({ onSettingsClick }) => {
  const navItems = [
    { icon: <GalleryIcon />, label: 'Gallery' },
    { icon: <CalendarIcon />, label: 'Calendar' },
    { icon: <GridIcon />, label: 'Apps' },
  ];
  return (
    <aside className="bg-[#181629]/50 backdrop-blur-3xl border border-white/10 rounded-[32px] flex flex-col items-center justify-between p-4 py-8">
      <div className="flex flex-col items-center gap-8">
        <a href="#" aria-label="Homepage">
          <SarLegacyLogo className="w-12 h-12" />
        </a>
        <nav className="flex flex-col gap-6">
          {navItems.map((item, index) => (
            <button key={index} aria-label={item.label} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              {item.icon}
            </button>
          ))}
        </nav>
      </div>
      <button onClick={onSettingsClick} aria-label="Settings" className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
        <SettingsIcon />
      </button>
    </aside>
  );
};

const WelcomeScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Favorites', 'Performance', 'Research and analysis', 'Education'];

  return (
    <>
      <div className="absolute top-8 right-8 bg-[#181629]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-start gap-3 max-w-xs shadow-2xl">
        <div className="text-yellow-400 mt-1">
          <SparkleIcon />
        </div>
        <div>
          <p className="font-semibold text-white">You have a busy day today with lots of meetings.</p>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <section className="mt-16 flex-shrink-0">
        <p className="text-gray-300">Good morning!</p>
        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter text-white !leading-[1.1] mt-1">You're on a wave of<br/>productivity!</h1>
      </section>

      <section className="mt-12 flex-1 flex flex-col min-h-0">
        <h2 className="text-2xl font-bold text-white">Discover</h2>
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {filters.map(filter => (
            <FilterChip key={filter} text={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 custom-scrollbar -mr-4 pr-4">
          <DataCard title="Heart rate" subtitle="online" value="67" unit="BPM" chart={<svg viewBox="0 0 100 30" className="w-full h-8 mt-2"><path d="M0 20 C 10 5, 20 5, 30 20 S 50 35, 60 20 S 80 5, 90 20" fill="none" stroke="#A855F7" strokeWidth="2"/></svg>} />
          <DataCard title="Training program" subtitle="Tomorrow" value="24" unit="days" chart={<div className="w-full h-8 mt-2 bg-white/5 rounded-md"><div className="h-full bg-purple-500 rounded-md" style={{width: '75%'}}></div></div>} />
          <DataCard title="Sleep score" subtitle="Cycle" value="7.4" unit="Hours" className="bg-gradient-to-br from-purple-600 to-indigo-700 !border-purple-500" chart={<svg viewBox="0 0 100 30" className="w-full h-8 mt-2 opacity-75">{[...Array(15)].map((_, i) => <rect key={i} x={i * 6.5} y={30 - (10 + Math.sin(i*0.8)*8 + 5)} width="4" height={30} fill="white" />)}</svg>} />
          <DataCard title="Steps" subtitle="Today" value="8,452" unit="steps" chart={<div className="w-full h-8 mt-2 bg-white/5 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{width: '60%'}}></div></div>} />
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
        ? 'bg-white text-black'
        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
    }`}
  >
    {text}
  </button>
);

const DataCard: React.FC<{ title: string; subtitle: string; value: string; unit: string; chart: React.ReactNode; className?: string; }> = ({ title, subtitle, value, unit, chart, className = '' }) => (
  <div className={`bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-48 ${className}`}>
    <div>
      <div className="flex justify-between items-center text-gray-400">
        <span>{title}</span>
        <ChevronRightIcon />
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-gray-400">{unit}</span>
      </div>
      {chart}
    </div>
  </div>
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
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  useEffect(() => {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }

    // Re-initialize chat session if model configs have changed
    chat.current = createChatSession(settings.modelConfig);

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

  const handleSendMessage = async (messageText: string) => {
    const text = messageText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setInputValue('');

    const userMessage: ChatMessage = { role: MessageRole.USER, text };
    setMessages(prev => [...prev, userMessage]);

    // Simple keyword check for visualization requests
    const isVisualizationRequest = /\b(visualize|chart|graph|plot)\b/i.test(text) || text.includes("Visualize Data");

    if (isVisualizationRequest && !text.toLowerCase().includes('data analysis')) {
      try {
        const chartData = await generateChartData(text);
        const modelMessage: ChatMessage = {
          role: MessageRole.MODEL,
          text: chartData.title || "Here is the chart you requested.",
          chartData: chartData,
        };
        setMessages(prev => [...prev, modelMessage]);
      } catch (error) {
        console.error("Error handling visualization request:", error);
        const errorMessage: ChatMessage = {
          role: MessageRole.MODEL,
          text: error instanceof Error ? error.message : "Sorry, I couldn't create a chart for that. Please try a different request.",
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } else { // Regular chat logic
        if (!chat.current) {
            // Handle case where chat is not initialized
            setIsLoading(false);
            return;
        }
      try {
        const stream = await chat.current.sendMessageStream({ message: text });
        let accumulatedText = '';
        setMessages(prev => [...prev, { role: MessageRole.MODEL, text: '' }]);

        for await (const chunk of stream) {
          accumulatedText += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: MessageRole.MODEL, text: accumulatedText };
            return newMessages;
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = { role: MessageRole.MODEL, text: "Sorry, I encountered an error. Please try again." };
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
        });
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
    chat.current = createChatSession(settings.modelConfig); // Reset chat history on Gemini's side
  };

  const suggestions = [
    { text: 'Recommend a movie', icon: <MovieIcon /> },
    { text: 'Generate image', icon: <GenerateIcon /> },
    { text: 'Visualize Data', icon: <ChartBarIcon /> },
    { text: 'Write a post', icon: <WriteIcon /> },
    { text: 'Data analysis', icon: <DataAnalysisIcon /> },
    { text: 'More', icon: <MoreIcon /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white font-sans overflow-hidden">
      <div className="w-full max-w-[1400px] h-[90vh] max-h-[900px] flex gap-4">
        <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
        <main className="flex-1 bg-black/30 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col relative overflow-hidden custom-scrollbar">
          <SettingsPanel
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              settings={settings}
              onSettingsChange={setSettings}
              onClearChat={handleClearChat}
            />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none -z-10"></div>

          <header className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white">SAR LEGACY 1.2</h1>
              <span className="bg-white/10 text-white/80 px-2 py-0.5 text-xs rounded-full">BETA</span>
            </div>
            <div className="relative">
              <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="flex items-center gap-2 hover:text-white transition-colors" aria-label="Toggle notifications">
                <BellIcon />
                {notifications.length > 0 && (
                   <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center border-2 border-[#181629]">
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
                />
            </div>
          </header>
          
          {messages.length === 0 ? <WelcomeScreen /> : (
             <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4 space-y-6 py-4">
                {messages.map((msg, index) => (
                  <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && messages[messages.length -1].role === MessageRole.USER && (
                  <div className="flex items-start gap-3 justify-start">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full flex-shrink-0 mt-1">
                          <SarLogoIcon />
                      </div>
                      <div className="rounded-2xl px-4 py-3 max-w-md bg-gray-700/50 text-gray-200 rounded-tl-none">
                          <div className="flex items-center gap-2 h-5">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
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
            <form onSubmit={handleFormSubmit} className="mt-4 bg-black/20 border border-white/10 rounded-2xl flex items-center p-2 pl-6 focus-within:border-purple-500 transition-colors">
              <input
                type="text"
                placeholder={isRecording ? "Listening..." : "Enter Message"}
                className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-500 text-lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                aria-label="Chat input"
              />
              <button type="button" onClick={handleMicClick} className="p-3 text-gray-400 hover:text-white transition-colors" aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
                <MicrophoneIcon className={isRecording ? 'text-purple-500 animate-pulse' : ''} />
              </button>
               <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-gray-400" aria-label="Send message">
                <SendIcon />
              </button>
            </form>
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default App;