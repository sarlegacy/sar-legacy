import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, CloseIcon, SendIcon, SarLogoIcon, SparkleIcon } from './icons.tsx';
import { ProjectPlan, GeneratedFile } from '../../types.ts';
import { generateCodeModification } from '../../services/aiService.ts';

interface AiAssistantPopupProps {
    projectPlan: ProjectPlan;
    initialFiles: GeneratedFile[];
    onCodeUpdate: (filePath: string, newContent: string) => void;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
}

export const AiAssistantPopup: React.FC<AiAssistantPopupProps> = ({ projectPlan, initialFiles, onCodeUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'system-1', role: 'system', text: "I'm ready to help you modify this project. What would you like to change?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const { filePath, fileContent, reasoning } = await generateCodeModification(projectPlan, initialFiles, trimmedInput);
            
            // Call parent to update the actual code
            onCodeUpdate(filePath, fileContent);

            const modelMessage: ChatMessage = { 
                id: `model-${Date.now()}`, 
                role: 'model', 
                text: `${reasoning}\n\nI've updated \`${filePath}\` for you. The preview has been refreshed.`
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            const errorMessage: ChatMessage = {
                id: `model-error-${Date.now()}`,
                role: 'model',
                text: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "An unknown issue occurred."}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[100] bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform"
                aria-label="Open AI Assistant"
            >
                <BotIcon className="w-8 h-8" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[32rem] bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl flex flex-col animate-fade-in-down">
            <header className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Live AI Editor</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close Assistant">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>
            
            <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role !== 'user' && <div className="w-7 h-7 flex-shrink-0 bg-[var(--bg-interactive)] rounded-full flex items-center justify-center mt-1"><SarLogoIcon className="w-4 h-4"/></div>}
                        <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                            msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 
                            msg.role === 'system' ? 'bg-transparent text-center text-xs text-[var(--text-muted)] w-full' :
                            'bg-[var(--bg-interactive)] rounded-bl-none'
                        }`}>
                           <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/`([^`]+)`/g, '<code class="bg-black/20 text-purple-300 px-1 py-0.5 rounded text-xs">\$1</code>') }} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-2">
                        <div className="w-7 h-7 flex-shrink-0 bg-[var(--bg-interactive)] rounded-full flex items-center justify-center mt-1"><SarLogoIcon className="w-4 h-4 animate-spin"/></div>
                        <div className="px-3 py-2 rounded-lg max-w-xs text-sm bg-[var(--bg-interactive)] rounded-bl-none text-[var(--text-muted)]">
                           Thinking...
                        </div>
                    </div>
                )}
            </div>

            <footer className="p-4 border-t border-[var(--border-primary)] flex-shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="e.g., Change the theme to light blue" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                    <button type="submit" disabled={!inputValue.trim() || isLoading} className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-500">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};
