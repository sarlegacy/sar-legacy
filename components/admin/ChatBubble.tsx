import React from 'react';
import { ChatMessage, MessageRole } from '../../types.ts';
import { SarLogoIcon, SpeakerOnIcon, SpeakerOffIcon, FileTextIcon } from './icons.tsx';
import { ChartRenderer } from './ChartRenderer.tsx';

interface ChatBubbleProps {
  message: ChatMessage;
  enableTTS: boolean;
  isSpeaking: boolean;
  onToggleSpeech: (messageId: string, text: string) => void;
  onContextMenu: (event: React.MouseEvent, message: ChatMessage) => void;
  searchTerm: string | null;
  isHighlighted: boolean;
}

const formatFileSize = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const HighlightedText = React.memo(({ text, highlight }: { text: string; highlight: string | null }) => {
    if (!highlight || !text) {
        return <>{text}</>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={i}>{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
});

export const ChatBubble = React.memo<ChatBubbleProps>(({ message, enableTTS, isSpeaking, onToggleSpeech, onContextMenu, searchTerm, isHighlighted }) => {
  const isModel = message.role === MessageRole.MODEL;

  return (
    <div
      className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
      onContextMenu={(e) => onContextMenu(e, message)}
    >
      {isModel && (
        <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-interactive)] rounded-full flex-shrink-0 mt-1">
          <SarLogoIcon />
        </div>
      )}
      <div
        id={`message-${message.id}`}
        className={`rounded-2xl px-4 py-3 relative group flex flex-col ${ isModel ? 'max-w-2xl w-full' : 'max-w-md'} ${
          isModel
            ? 'bg-[var(--bg-interactive)] text-[var(--text-primary)] rounded-tl-none'
            : 'bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white rounded-br-none'
        } ${isHighlighted ? 'highlight-bubble' : ''}`}
      >
        {message.attachment && (
          message.attachment.type.startsWith('image/') ? (
            <img
              src={message.attachment.url}
              alt="User attachment"
              className="rounded-lg mb-2 max-w-xs max-h-64 object-contain"
            />
          ) : (
             <a
                href={message.attachment.url}
                download={message.attachment.name}
                aria-label={`Download ${message.attachment.name}`}
                className="mb-2 p-3 bg-black/20 rounded-lg flex items-center gap-3 border border-white/10 hover:bg-black/30 transition-all duration-200 hover:-translate-y-0.5 no-underline text-inherit"
             >
                <FileTextIcon className="w-8 h-8 text-current flex-shrink-0 opacity-70" />
                <div className="overflow-hidden text-left">
                  <p className="font-semibold text-sm truncate">{message.attachment.name}</p>
                  <p className="text-xs opacity-80">{formatFileSize(message.attachment.size)}</p>
                </div>
            </a>
          )
        )}
        {message.chartData ? (
            <ChartRenderer chartData={message.chartData} />
        ) : (
            message.text && <p className="whitespace-pre-wrap"><HighlightedText text={message.text} highlight={searchTerm} /></p>
        )}
        
        {message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Sources</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-sm">
                    {message.groundingChunks.map((chunk, index) => (
                        chunk.web && chunk.web.uri && (
                            <li key={index}>
                                <a
                                    href={chunk.web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-300 hover:underline break-words"
                                    title={chunk.web.uri}
                                >
                                    {chunk.web.title || new URL(chunk.web.uri).hostname}
                                </a>
                            </li>
                        )
                    ))}
                </ol>
            </div>
        )}

        {isModel && (message.usageMetadata || (enableTTS && message.text && !message.chartData)) && (
          <div className="absolute bottom-0 right-0 translate-y-full flex items-center justify-end gap-2 pt-1">
              {message.usageMetadata && (
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full border border-[var(--border-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.usageMetadata.totalTokenCount} tokens
                  </span>
              )}
              {enableTTS && message.text && !message.chartData && (
                <button 
                  onClick={() => onToggleSpeech(message.id, message.text)}
                  aria-label={isSpeaking ? 'Stop speech' : 'Read message aloud'}
                  className="p-1.5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full text-[var(--text-muted)] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  {isSpeaking ? <SpeakerOffIcon className="w-4 h-4" /> : <SpeakerOnIcon className="w-4 h-4" />}
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
});