import React, { useState } from 'react';
import { User, ApiKey, LogEntry } from '../../types.ts';
import { CloseIcon, UserPlusIcon, ShieldIcon, ClipboardListIcon, LayoutDashboardIcon } from './icons.tsx';
import { UserManagementTable } from './UserManagementTable.tsx';
import { UserProfileModal } from './UserProfileModal.tsx';
import { ApiKeyManager } from './ApiKeyManager.tsx';
import { ActivityLog } from './ActivityLog.tsx';
import { AdminDashboard } from './AdminDashboard.tsx';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  apiKeys: ApiKey[];
  onAddApiKey: (key: Omit<ApiKey, 'id' | 'requestCount' | 'tokenUsage' | 'lastUsed'>) => void;
  onUpdateApiKey: (key: ApiKey) => void;
  onDeleteApiKey: (keyId: string) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
}

type AdminView = 'dashboard' | 'users' | 'keys' | 'logs';

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
            active
                ? 'bg-purple-600/20 text-purple-300'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'
        }`}
    >
        {children}
    </button>
);

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  apiKeys,
  onAddApiKey,
  onUpdateApiKey,
  onDeleteApiKey,
  logs,
  onClearLogs,
}) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const handleOpenAddUserModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };
  
  const handleSaveUser = (user: User | Omit<User, 'id' | 'lastLogin'>) => {
    if ('id' in user) {
        onUpdateUser(user);
    } else {
        onAddUser(user);
    }
    setIsUserModalOpen(false);
  };

  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'users', icon: <UserPlusIcon className="w-5 h-5" />, label: 'User Management' },
    { id: 'keys', icon: <ShieldIcon className="w-5 h-5" />, label: 'API Keys' },
    { id: 'logs', icon: <ClipboardListIcon className="w-5 h-5" />, label: 'Activity Log' },
  ];

  return (
    <>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}>
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-6xl bg-[var(--bg-secondary)] backdrop-blur-xl border-r border-[var(--border-primary)] shadow-2xl z-50 flex text-[var(--text-muted)] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-panel-title"
        >
          <div className="w-64 flex-shrink-0 border-r border-[var(--border-primary)] p-6 flex flex-col">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6">
                <h2 id="admin-panel-title" className="text-xl font-bold text-[var(--text-primary)]">Admin Panel</h2>
            </header>
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <NavButton key={item.id} active={activeView === item.id} onClick={() => setActiveView(item.id as AdminView)}>
                  {item.icon}
                  <span>{item.label}</span>
                </NavButton>
              ))}
            </nav>
          </div>
          <main className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="flex justify-end mb-6 -mt-2 -mr-2">
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close admin panel">
                  <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                {activeView === 'dashboard' && <AdminDashboard users={users} apiKeys={apiKeys} logs={logs} />}
                {activeView === 'users' && (
                    <UserManagementTable 
                        users={users}
                        onAddUser={handleOpenAddUserModal}
                        onEditUser={handleOpenEditUserModal}
                        onDeleteUser={onDeleteUser}
                    />
                )}
                {activeView === 'keys' && (
                    <ApiKeyManager
                        keys={apiKeys}
                        onAddKey={onAddApiKey}
                        onUpdateKey={onUpdateApiKey}
                        onDeleteKey={onDeleteApiKey}
                    />
                )}
                {activeView === 'logs' && (
                    <ActivityLog logs={logs} onClearLogs={onClearLogs} />
                )}
            </div>
          </main>
        </div>
      </div>
      {isUserModalOpen && (
        <UserProfileModal 
            user={editingUser}
            onClose={() => setIsUserModalOpen(false)}
            onSave={handleSaveUser}
        />
      )}
    </>
  );
};