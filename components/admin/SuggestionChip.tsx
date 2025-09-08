import React from 'react';

interface SuggestionChipProps {
  text: string;
  icon: React.ReactNode;
  onClick: (text: string) => void;
}

export const SuggestionChip = React.memo<SuggestionChipProps>(({ text, icon, onClick }) => {
  return (
    <button
      onClick={() => onClick(text)}
      className="bg-[var(--bg-interactive)] border border-transparent rounded-lg px-3 py-2 text-sm text-left text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:border-[var(--border-primary)] hover:text-[var(--text-primary)] transition-all duration-200 flex items-center gap-2 active:scale-95"
    >
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
});