import React, { useState, useEffect } from 'react';
import { SarLegacyLogo, UserIcon, LockIcon, GoogleIcon, GithubIcon } from './icons.tsx';

interface LoginScreenProps {
  onLogin: (details: { username: string; password: string; keepLoggedIn: boolean }) => boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('login-video-active');
    return () => {
        document.body.classList.remove('login-video-active');
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
        const success = onLogin({ username, password, keepLoggedIn });
        if (!success) {
            setError('Invalid username or password.');
        }
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-[var(--text-primary)] font-sans bg-transparent overflow-hidden">
        <div className="absolute inset-0 bg-black/50 -z-[1]"></div>
      
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] backdrop-blur-3xl border border-[var(--border-primary)] rounded-2xl p-8 shadow-2xl animate-fade-in-down">
                <div className="text-center mb-10">
                    <SarLegacyLogo className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome Back</h1>
                    <p className="text-[var(--text-muted)]">Sign in to your SAR LEGACY account</p>
                </div>
                
                {error && <p role="alert" className="bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-lg mb-4 text-center">{error}</p>}

                <div className="space-y-4">
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                        <input
                            id="username-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Username"
                            autoComplete="username"
                            className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] focus:ring-[var(--focus-ring)] transition-colors"
                        />
                    </div>
                     <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                            autoComplete="current-password"
                            className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-3 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)] focus:ring-[var(--focus-ring)] transition-colors"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center">
                            <input
                                id="keep-logged-in"
                                type="checkbox"
                                checked={keepLoggedIn}
                                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                className="h-4 w-4 rounded border-[var(--border-primary)] text-purple-600 bg-[var(--bg-interactive)] focus:ring-[var(--focus-ring)] focus:ring-offset-[var(--bg-secondary)] cursor-pointer"
                            />
                            <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-[var(--text-muted)] cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">Forgot password?</a>
                    </div>
                </div>
              
                <button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                    disabled={!username || !password || isLoading}
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Sign In'}
                </button>
                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-[var(--border-primary)]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[var(--bg-secondary)] px-2 text-[var(--text-muted)]">Or continue with</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="button" aria-label="Sign in with Google" className="w-full flex justify-center items-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2.5 px-4 rounded-lg transition-colors">
                        <GoogleIcon className="w-5 h-5" />
                    </button>
                    <button type="button" aria-label="Sign in with GitHub" className="w-full flex justify-center items-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2.5 px-4 rounded-lg transition-colors">
                        <GithubIcon className="w-5 h-5" />
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};