
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { SarLogoIcon, SpeakerOnIcon, SpeakerOffIcon } from './icons';
import { ChartRenderer } from './ChartRenderer';

interface ChatBubbleProps {
  message: ChatMessage;
  enableTTS: boolean;
  isSpeaking: boolean;
  onToggleSpeech: (messageId: string, text: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, enableTTS, isSpeaking, onToggleSpeech }) => {
  const isModel = message.role === MessageRole.MODEL;

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-interactive)] rounded-full flex-shrink-0 mt-1">
          <SarLogoIcon />
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-3 relative group flex flex-col ${ isModel ? 'max-w-2xl w-full' : 'max-w-md'} ${
          isModel
            ? 'bg-[var(--bg-interactive)] text-[var(--text-primary)] rounded-tl-none'
            : 'bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white rounded-br-none'
        }`}
      >
        {message.attachment && message.attachment.type.startsWith('image/') && (
          <img
            src={message.attachment.url}
            alt="User attachment"
            className="rounded-lg mb-2 max-w-xs max-h-64 object-contain"
          />
        )}
        {message.chartData ? (
            <ChartRenderer chartData={message.chartData} />
        ) : (
            message.text && <p className="whitespace-pre-wrap">{message.text}</p>
        )}
        
        {isModel && enableTTS && message.text && !message.chartData && (
          <button 
            onClick={() => onToggleSpeech(message.id, message.text)}
            aria-label={isSpeaking ? 'Stop speech' : 'Read message aloud'}
            className="absolute -bottom-4 right-2 p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full text-[var(--text-muted)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            {isSpeaking ? <SpeakerOffIcon className="w-4 h-4" /> : <SpeakerOnIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
