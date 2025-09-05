
import React, { useRef, useEffect } from 'react';
import { Notification } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  notifications,
  onClose,
  onClearAll,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute top-12 right-0 w-80 max-w-sm bg-[#181629]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-down"
      style={{ animationDuration: '300ms' }}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white">Notifications</h3>
      </div>
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className="border-b border-white/5 p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                  <div>
                    <p className="font-medium text-white text-sm">{notification.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.description}</p>
                  </div>
                  <p className="text-gray-500 text-xs ml-auto flex-shrink-0">{notification.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center py-8 text-sm">No new notifications.</p>
        )}
      </div>
       {notifications.length > 0 && (
          <div className="p-2">
            <button
              onClick={onClearAll}
              className="w-full text-center text-sm text-gray-300 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
    </div>
  );
};
