
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import { SarLogoIcon } from './icons';
import { ChartRenderer } from './ChartRenderer';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isModel = message.role === MessageRole.MODEL;

  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full flex-shrink-0 mt-1">
          <SarLogoIcon />
        </div>
      )}
      <div
        className={`rounded-2xl px-4 py-3 ${ isModel ? 'max-w-2xl w-full' : 'max-w-md'} ${
          isModel
            ? 'bg-gray-700/50 text-gray-200 rounded-tl-none'
            : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none'
        }`}
      >
        {message.chartData ? (
            <ChartRenderer chartData={message.chartData} />
        ) : (
            <p className="whitespace-pre-wrap">{message.text}</p>
        )}
      </div>
    </div>
  );
};
