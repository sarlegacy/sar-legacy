import React, { useEffect, useRef } from 'react';

interface ContextMenuOption {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  options: ContextMenuOption[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, position, options, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || options.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[60] bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-lg shadow-2xl py-2 w-48 animate-fade-in-down"
      role="menu"
      aria-orientation="vertical"
    >
      <ul className="space-y-1">
        {options.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => {
                option.action();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-[var(--text-primary)] hover:bg-[var(--bg-interactive-hover)] transition-colors"
              role="menuitem"
            >
              <span className="w-4 h-4 text-[var(--text-muted)]">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
