
import React, { FC, ChangeEvent } from 'react';
import { AppSettings, Theme } from '../types';
import { CloseIcon, SunIcon, MoonIcon, DesktopIcon, TrashIcon, DownloadIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClearChat: () => void;
}

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'ja-JP', name: '日本語' },
];

const SettingSection: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-b border-white/10 pb-6 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
    </div>
);

const ThemeButton: FC<{ active: boolean; onClick: () => void; children: React.ReactNode; label: string }> = ({ active, onClick, children, label }) => (
    <button
        onClick={onClick}
        aria-label={`Set theme to ${label}`}
        className={`flex-1 p-2 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${active ? 'bg-purple-600' : 'bg-white/5 hover:bg-white/10'}`}
    >
        {children}
        <span className="text-xs">{label}</span>
    </button>
);

// FIX: Added the `name` prop to the Slider component to pass it to the input element.
// This resolves the type error and allows the `handleModelConfigChange` function to correctly identify which setting is being updated.
const Slider: FC<{ label: string; name: string; value: number; min: number; max: number; step: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, min, max, step, onChange }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-300">{label}</label>
            <span className="text-sm font-medium text-white bg-white/10 px-2 py-0.5 rounded-full">{value}</span>
        </div>
        <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer range-thumb"
        />
    </div>
);

export const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange, onClearChat }) => {
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

  const handleExportChat = () => {
    // In a real app, this would trigger a download of the chat history.
    alert("Export functionality is not implemented in this demo.");
  };

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose}>
      <div
        className={`absolute top-0 left-0 h-full w-full max-w-sm bg-[#181629]/80 backdrop-blur-xl border-r border-white/10 shadow-2xl z-50 p-6 flex flex-col text-gray-300 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <header className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h2 id="settings-title" className="text-2xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" aria-label="Close settings">
            <CloseIcon className="w-6 h-6 text-gray-400" />
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

            <SettingSection title="Microphone">
                <label htmlFor="mic-language" className="text-sm text-gray-300 mb-2 block">Input Language</label>
                <select 
                    id="mic-language"
                    value={settings.microphoneLanguage}
                    onChange={handleLanguageChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                    {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </select>
            </SettingSection>

             <SettingSection title="Data Controls">
                <div className="flex flex-col gap-3">
                   <button onClick={() => { onClearChat(); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                      <TrashIcon />
                      Clear Chat History
                   </button>
                   <button onClick={handleExportChat} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors">
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
