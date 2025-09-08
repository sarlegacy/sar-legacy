import React, { useRef, useEffect } from 'react';
import { Notification } from '../../types.ts';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  notifications,
  onClose,
  onClearAll,
  triggerRef,
  position,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);

      setTimeout(() => {
        const focusableElements = panelRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
        );
        if (focusableElements && focusableElements.length > 0) {
            focusableElements[0].focus();
        }
      }, 100); // Small delay to allow for panel animation

      const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab' && panelRef.current) {
                const focusableElements = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
                ));
                if (focusableElements.length === 0) return;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
      };
      
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        document.removeEventListener('keydown', handleKeyDown);
        triggerRef.current?.focus();
      };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-12 right-0',
    'top-left': 'top-12 left-0',
    'bottom-right': 'bottom-12 right-0',
    'bottom-left': 'bottom-12 left-0',
  };

  const animationClasses = {
    'top-right': 'animate-slide-in-tr',
    'top-left': 'animate-slide-in-tl',
    'bottom-right': 'animate-slide-in-br',
    'bottom-left': 'animate-slide-in-bl',
  };

  return (
    <div
      ref={panelRef}
      className={`absolute w-80 max-w-sm bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-primary)] rounded-2xl shadow-2xl z-50 overflow-hidden ${animationClasses[position]} ${positionClasses[position]}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div className="p-4 border-b border-[var(--border-primary)]">
        <h3 id="notification-title" className="font-semibold text-[var(--text-primary)]">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b border-[var(--border-primary)] p-4 hover:bg-[var(--bg-interactive-hover)] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm">{notification.title}</p>
                    <p className="text-[var(--text-muted)] text-xs mt-1">{notification.description}</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs ml-auto flex-shrink-0">{notification.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--text-muted)] text-center py-8 text-sm">No new notifications.</p>
        )}
      </div>
       {notifications.length > 0 && (
          <div className="p-2">
            <button
              onClick={onClearAll}
              className="w-full text-center text-sm text-[var(--text-primary)] py-2 rounded-lg hover:bg-[var(--bg-interactive-hover)] transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
    </div>
  );
};