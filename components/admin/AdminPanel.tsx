
import React, { useState } from 'react';
import { User } from '../../types';
import { CloseIcon } from '../icons';
import { UserManagementTable } from './UserManagementTable';
import { UserProfileModal } from './UserProfileModal';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleSaveUser = (user: User | Omit<User, 'id' | 'lastLogin'>) => {
    if ('id' in user) {
        onUpdateUser(user);
    } else {
        onAddUser(user);
    }
    setIsModalOpen(false);
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}>
        <div
          className={`absolute top-0 left-0 h-full w-full max-w-4xl bg-[var(--bg-secondary)] backdrop-blur-xl border-r border-[var(--border-primary)] shadow-2xl z-50 p-8 flex flex-col text-[var(--text-muted)] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-panel-title"
        >
          <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6">
            <h2 id="admin-panel-title" className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close admin panel">
              <CloseIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
             <UserManagementTable 
                users={users}
                onAddUser={handleOpenAddModal}
                onEditUser={handleOpenEditModal}
                onDeleteUser={onDeleteUser}
             />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UserProfileModal 
            user={editingUser}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
        />
      )}
    </>
  );
};
