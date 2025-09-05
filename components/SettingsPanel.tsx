
import React, { FC, ChangeEvent, useEffect, useRef } from 'react';
import { AppSettings, Theme } from '../types';
import { CloseIcon, SunIcon, MoonIcon, DesktopIcon, TrashIcon, DownloadIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClearChat: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'ja-JP', name: '日本語' },
];

const SettingSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-[var(--border-primary)] pb-6 mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
        {children}
    </div>
);

const ThemeButton: FC<{ active: boolean; onClick: () => void; children: React.ReactNode; label: string }> = ({ active, onClick, children, label }) => (
    <button
        onClick={onClick}
        aria-label={`Set theme to ${label}`}
        className={`flex-1 p-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${active ? 'bg-purple-600 text-white' : 'bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)]'}`}
    >
        {children}
        <span className="text-xs">{label}</span>
    </button>
);

const Slider: FC<{ label: string; name: string; value: number; min: number; max: number; step: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, min, max, step, onChange }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--text-muted)]">{label}</label>
            <span className="text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-interactive-hover)] px-2 py-0.5 rounded-full">{value}</span>
        </div>
        <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-[var(--bg-interactive)] rounded-lg appearance-none cursor-pointer range-thumb"
        />
    </div>
);

const ToggleSwitch: FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--text-muted)]">{label}</label>
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-purple-600' : 'bg-[var(--bg-interactive-hover)]'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

export const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange, onClearChat, triggerRef }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };
    
    if (isOpen) {
        document.addEventListener('keydown', handleEscapeKey);
        
        setTimeout(() => {
            const closeButton = panelRef.current?.querySelector('button');
            closeButton?.focus();
        }, 100);

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
            document.removeEventListener('keydown', handleEscapeKey);
            document.removeEventListener('keydown', handleKeyDown);
            triggerRef.current?.focus();
        };
    }
  }, [isOpen, onClose, triggerRef]);


  if (!isOpen) return null;

  const handleThemeChange = (theme: Theme) => {
    onSettingsChange({ ...settings, theme });
  };

  const handleModelConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onSettingsChange({
      ...settings,
      modelConfig: {
        ...settings.modelConfig,
        [name]: parseFloat(value),
      },
    });
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, microphoneLanguage: e.target.value });
  };
  
  const handleTTSChange = (enabled: boolean) => {
    onSettingsChange({ ...settings, enableTTS: enabled });
  };

  const handleExportChat = () => {
    // In a real app, this would trigger a download of the chat history.
    alert("Export functionality is not implemented in this demo.");
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}>
      <div
        ref={panelRef}
        className={`absolute top-0 left-0 h-full w-full max-w-sm bg-[var(--bg-secondary)] backdrop-blur-xl border-r border-[var(--border-primary)] shadow-2xl z-50 p-6 flex flex-col text-[var(--text-muted)] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6">
          <h2 id="settings-title" className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-3 pr-3">
            <SettingSection title="Theme">
                <div className="flex gap-3">
                    <ThemeButton active={settings.theme === 'light'} onClick={() => handleThemeChange('light')} label="Light"><SunIcon /></ThemeButton>
                    <ThemeButton active={settings.theme === 'dark'} onClick={() => handleThemeChange('dark')} label="Dark"><MoonIcon /></ThemeButton>
                    <ThemeButton active={settings.theme === 'system'} onClick={() => handleThemeChange('system')} label="System"><DesktopIcon /></ThemeButton>
                </div>
            </SettingSection>

            <SettingSection title="Model Configuration">
                <div className="space-y-4">
                    <Slider label="Temperature" name="temperature" value={settings.modelConfig.temperature} min={0} max={1} step={0.1} onChange={handleModelConfigChange} />
                    <Slider label="Top-P" name="topP" value={settings.modelConfig.topP} min={0} max={1} step={0.05} onChange={handleModelConfigChange} />
                    <Slider label="Top-K" name="topK" value={settings.modelConfig.topK} min={1} max={100} step={1} onChange={handleModelConfigChange} />
                </div>
            </SettingSection>
            
            <SettingSection title="Audio">
                <ToggleSwitch label="Enable Text-to-Speech" checked={settings.enableTTS} onChange={handleTTSChange} />
            </SettingSection>

            <SettingSection title="Microphone">
                <label htmlFor="mic-language" className="text-sm text-[var(--text-muted)] mb-2 block">Input Language</label>
                <select 
                    id="mic-language"
                    value={settings.microphoneLanguage}
                    onChange={handleLanguageChange}
                    className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
                >
                    {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
            </SettingSection>

             <SettingSection title="Data Controls">
                <div className="flex flex-col gap-3">
                   <button onClick={() => { onClearChat(); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
                      <TrashIcon />
                      Clear Chat History
                   </button>
                   <button onClick={handleExportChat} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
                      <DownloadIcon />
                      Export Chat History
                   </button>
                </div>
            </SettingSection>
        </div>
      </div>
    </div>
  );
};
