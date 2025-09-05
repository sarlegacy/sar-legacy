
import React, { useState } from 'react';
import { User } from '../types';
import { SarLegacyLogo } from './icons';

interface LoginScreenProps {
  users: User[];
  onLogin: (userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onLogin(selectedUserId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[var(--text-primary)] font-sans bg-[var(--bg-primary)]">
      <div className="dark:bg-gradient-to-br from-purple-900/20 to-indigo-900/20 absolute inset-0 -z-10"></div>
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-2xl p-8 shadow-2xl text-center">
            <SarLegacyLogo className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Welcome to SAR LEGACY</h1>
            <p className="text-[var(--text-muted)] mb-8">Select a user to continue</p>

            <div className="mb-6 text-left">
                <label htmlFor="user-select" className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                    Login As
                </label>
                <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>
            </div>
          
            <button
                type="submit"
                className="w-full bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={!selectedUserId}
            >
                Login
            </button>
        </form>
      </div>
    </div>
  );
};
