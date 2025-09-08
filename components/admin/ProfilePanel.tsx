import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types.ts';
import { CloseIcon, CameraIcon, UserIcon, LockIcon } from './icons.tsx';

interface ProfilePanelProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, onClose, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatar);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [onClose]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = () => {
        const updatedUser: User = { ...user, name, email, avatar };
        onUpdateUser(updatedUser);
        alert("Profile updated successfully!");
        onClose();
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters long.");
            return;
        }
        // This is a simulation
        alert("Password changed successfully! (This is a demo)");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                ref={panelRef}
                className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in-center flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-panel-title"
            >
                <header className="flex items-center justify-between p-6 border-b border-[var(--border-primary)] flex-shrink-0">
                    <h2 id="profile-panel-title" className="text-xl font-bold text-[var(--text-primary)]">
                        My Profile
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <div className="relative group flex-shrink-0">
                             <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-full" aria-label="Change profile picture">
                                {avatar ? (
                                    <img src={avatar} alt="User avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
                                        {getInitials(name)}
                                    </div>
                                )}
                                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CameraIcon className="w-8 h-8 text-white" />
                                </div>
                            </button>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{name}</h3>
                            <p className="text-[var(--text-muted)]">{email}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full inline-block">{user.role}</p>
                        </div>
                    </div>
                    
                    <hr className="border-[var(--border-primary)] my-8" />
                    
                    <section className="space-y-6">
                        <h4 className="text-lg font-semibold text-[var(--text-primary)]">Account Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="profile-name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Full Name</label>
                                <input type="text" id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                            <div>
                                <label htmlFor="profile-email" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Email Address</label>
                                <input type="email" id="profile-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                        </div>
                    </section>

                    <hr className="border-[var(--border-primary)] my-8" />

                    <section>
                        <h4 className="text-lg font-semibold text-[var(--text-primary)]">Change Password</h4>
                        <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                            <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" required className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                             <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" required className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                             <div className="relative">
                                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-sm text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">Update Password</button>
                            </div>
                        </form>
                    </section>
                </main>
                
                <footer className="p-6 border-t border-[var(--border-primary)] flex-shrink-0 flex justify-end">
                    <button onClick={handleSaveChanges} className="bg-purple-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};