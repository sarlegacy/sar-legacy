import React from 'react';

interface SuggestionChipProps {
  text: string;
  icon: React.ReactNode;
  onClick: (text: string) => void;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, icon, onClick }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="bg-white/5 border border-transparent rounded-lg px-3 py-2 text-sm text-left text-gray-300 hover:bg-white/10 hover:border-white/10 transition-all duration-200 flex items-center gap-2"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
};
