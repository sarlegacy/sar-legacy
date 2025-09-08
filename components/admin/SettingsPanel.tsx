import React, { FC, ChangeEvent, useEffect, useRef, useState, SetStateAction } from 'react';
import { AppSettings, CustomModel, ModelConfig, SoundSettings, ChatMessage } from '../../types.ts';
import { 
    CloseIcon, SunIcon, MoonIcon, DesktopIcon, TrashIcon, DownloadIcon, 
    UploadIcon, RefreshCwIcon, SettingsIcon, CpuChipIcon, SpeakerOnIcon,
    UniversalAccessIcon, DatabaseIcon, ShieldCheckIcon, ArchiveBoxIcon, EyeIcon
} from './icons.tsx';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (updater: SetStateAction<AppSettings>) => void;
  onClearChat: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  activeModel: CustomModel;
  onBackup: () => void;
  onRestore: () => void;
  onReset: () => void;
  playSound: (type: 'ui') => void;
  onExportChatHistory: () => void;
}

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'ja-JP', name: '日本語' },
];

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

const Slider: FC<{ label: string; name: string; value: number; min: number; max: number; step: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; displayValue?: string; }> = ({ label, name, value, min, max, step, onChange, displayValue }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--text-muted)]">{label}</label>
            <span className="text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-interactive-hover)] px-2 py-0.5 rounded-full">{displayValue || value}</span>
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

const ToggleSwitch: FC<{ label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
        <div>
            <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
            {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
        </div>
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

const SegmentedControl: FC<{ options: { label: string, value: string }[], value: string, onChange: (value: string) => void }> = ({ options, value, onChange }) => (
    <div className="flex bg-[var(--bg-interactive)] rounded-lg p-1">
        {options.map(option => (
            <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`flex-1 text-center text-sm py-1.5 rounded-md transition-colors ${
                    value === option.value
                        ? 'bg-[var(--bg-secondary)] shadow text-[var(--text-primary)] font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
            >
                {option.label}
            </button>
        ))}
    </div>
);

type SettingsView = 'general' | 'appearance' | 'accessibility' | 'model' | 'audio' | 'privacy' | 'data';

export const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange, onClearChat, triggerRef, activeModel, onBackup, onRestore, onReset, playSound, onExportChatHistory }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<SettingsView>('general');

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    if (isOpen) {
        document.addEventListener('keydown', handleEscapeKey);
        setTimeout(() => { panelRef.current?.querySelector('button')?.focus(); }, 100);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab' && panelRef.current) {
                const focusableElements = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
                if (focusableElements.length === 0) return;
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) { lastElement.focus(); event.preventDefault(); }
                } else {
                    if (document.activeElement === lastElement) { firstElement.focus(); event.preventDefault(); }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => { document.removeEventListener('keydown', handleEscapeKey); document.removeEventListener('keydown', handleKeyDown); triggerRef.current?.focus(); };
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleSettingsChange = (key: keyof AppSettings, value: any) => onSettingsChange(prev => ({ ...prev, [key]: value }));
  const handleToggleChange = (key: keyof AppSettings, value: boolean) => { playSound('ui'); onSettingsChange(prev => ({ ...prev, [key]: value })); };
  const handlePrivacySettingsChange = (key: keyof AppSettings['privacySettings'], value: any) => onSettingsChange(prev => ({...prev, privacySettings: {...prev.privacySettings, [key]: value}}));
  const handleSoundSettingsChange = (key: keyof SoundSettings, value: any) => onSettingsChange(prev => ({ ...prev, soundSettings: { ...prev.soundSettings, [key]: value } }));
  const handleSoundToggleChange = (key: keyof SoundSettings, value: boolean) => { playSound('ui'); handleSoundSettingsChange(key, value); };
  const handleModelConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    const newModelConfig: ModelConfig = { ...settings.modelConfig };
    if (name === 'maxOutputTokens' || name === 'thinkingBudget') { (newModelConfig as any)[name] = numValue > 0 ? numValue : undefined; } 
    else { (newModelConfig as any)[name] = numValue; }
    if (name === 'maxOutputTokens' && newModelConfig.thinkingBudget && newModelConfig.maxOutputTokens && newModelConfig.thinkingBudget > newModelConfig.maxOutputTokens) {
        newModelConfig.thinkingBudget = newModelConfig.maxOutputTokens;
    }
    onSettingsChange(prev => ({ ...prev, modelConfig: newModelConfig }));
  };

  const navItems = [
    { id: 'general', label: 'General', icon: <SettingsIcon className="w-5 h-5" /> },
    { id: 'appearance', label: 'Appearance', icon: <EyeIcon className="w-5 h-5" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <UniversalAccessIcon className="w-5 h-5" /> },
    { id: 'model', label: 'Model', icon: <CpuChipIcon className="w-5 h-5" /> },
    { id: 'audio', label: 'Audio', icon: <SpeakerOnIcon className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'data', label: 'Data', icon: <DatabaseIcon className="w-5 h-5" /> }
  ];
  const currentNav = navItems.find(item => item.id === activeView);

  const renderContent = () => {
    switch (activeView) {
        case 'general': return (<div className="space-y-6">
            <div><label className="text-sm text-[var(--text-muted)] mb-2 block">Your Message Alignment</label><SegmentedControl value={settings.userBubbleAlignment} onChange={(val) => handleSettingsChange('userBubbleAlignment', val)} options={[{ label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }]} /></div>
            <ToggleSwitch label="Show Timestamps" description="Display timestamps for each message." checked={settings.showTimestamps} onChange={(val) => handleToggleChange('showTimestamps', val)} />
            <ToggleSwitch label="Show Suggestion Chips" description="Show helpful prompts on a new chat screen." checked={settings.showSuggestionChips} onChange={(val) => handleToggleChange('showSuggestionChips', val)} />
            <ToggleSwitch label="Send on Enter" description="Press Enter to send, Shift+Enter for new line." checked={settings.sendOnEnter} onChange={(val) => handleToggleChange('sendOnEnter', val)} />
            <ToggleSwitch label="Auto-scroll" description="Automatically scroll to new messages." checked={settings.autoScroll} onChange={(val) => handleToggleChange('autoScroll', val)} />
            <ToggleSwitch label="Open to Last Used Panel" description="Start the app in the last active view (e.g. Gallery)." checked={settings.openLastUsedPanel} onChange={(val) => handleToggleChange('openLastUsedPanel', val)} />
        </div>);
        case 'appearance': return (<div className="space-y-6">
            <div><label className="text-sm text-[var(--text-muted)] mb-2 block">Theme</label><div className="flex gap-3"><ThemeButton active={settings.theme === 'light'} onClick={() => handleSettingsChange('theme', 'light')} label="Light"><SunIcon /></ThemeButton><ThemeButton active={settings.theme === 'dark'} onClick={() => handleSettingsChange('theme', 'dark')} label="Dark"><MoonIcon /></ThemeButton><ThemeButton active={settings.theme === 'system'} onClick={() => handleSettingsChange('theme', 'system')} label="System"><DesktopIcon /></ThemeButton></div></div>
            <ToggleSwitch label="Compact UI" description="Reduce padding and margins for a denser view." checked={settings.compactUI} onChange={(val) => handleToggleChange('compactUI', val)} />
            <ToggleSwitch label="Disable Animations" description="Improve performance on older devices." checked={settings.animationsDisabled} onChange={(val) => handleToggleChange('animationsDisabled', val)} />
            <hr className="border-[var(--border-primary)] !my-8" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Interface Elements</h4>
            <div>
                <label htmlFor="notification-position" className="text-sm text-[var(--text-muted)] mb-2 block">Notification Position</label>
                <select id="notification-position" value={settings.notificationPosition} onChange={(e) => handleSettingsChange('notificationPosition', e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                </select>
            </div>
            <ToggleSwitch label="Show Model Status" description="Display the model connection status in the header." checked={settings.showStatusIndicator} onChange={(val) => handleToggleChange('showStatusIndicator', val)} />
            <ToggleSwitch label="Show Session Tokens" description="Display the token count below the chat input." checked={settings.showTokenCount} onChange={(val) => handleToggleChange('showTokenCount', val)} />
        </div>);
        case 'accessibility': return (<div className="space-y-6">
            <Slider label="Font Size" name="fontSize" value={settings.fontSize} min={80} max={120} step={5} onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))} displayValue={`${settings.fontSize}%`} />
        </div>);
        case 'model': return (<div className="space-y-6">
            <ToggleSwitch label="Default to Web Search" description="Automatically perform a web search for non-command prompts." checked={settings.webSearchDefault} onChange={(val) => handleToggleChange('webSearchDefault', val)} />
            <hr className="border-[var(--border-primary)] !my-8" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Model Parameters</h4>
            <Slider label="Temperature" name="temperature" value={settings.modelConfig.temperature} min={0} max={1} step={0.1} onChange={handleModelConfigChange} />
            <Slider label="Top-P" name="topP" value={settings.modelConfig.topP} min={0} max={1} step={0.05} onChange={handleModelConfigChange} />
            <Slider label="Top-K" name="topK" value={settings.modelConfig.topK} min={1} max={100} step={1} onChange={handleModelConfigChange} />
            <Slider label="Max Output Tokens" name="maxOutputTokens" value={settings.modelConfig.maxOutputTokens || 0} min={0} max={8192} step={128} onChange={handleModelConfigChange} displayValue={settings.modelConfig.maxOutputTokens ? settings.modelConfig.maxOutputTokens.toString() : 'Default'} />
            {activeModel.modelId === 'gemini-2.5-flash' && (<div><Slider label="Thinking Budget" name="thinkingBudget" value={settings.modelConfig.thinkingBudget || 0} min={0} max={settings.modelConfig.maxOutputTokens || 2048} step={64} onChange={handleModelConfigChange} displayValue={settings.modelConfig.thinkingBudget ? settings.modelConfig.thinkingBudget.toString() : 'Default'} /><p className="text-xs text-[var(--text-muted)] mt-2">Reserve tokens for final output when using Max Output Tokens.</p></div>)}
            <hr className="border-[var(--border-primary)] !my-8" />
            <div><label htmlFor="system-instruction" className="text-sm text-[var(--text-muted)] mb-2 block">System Prompt for {activeModel.name}</label><textarea id="system-instruction" name="systemInstruction" rows={5} value={settings.systemInstruction || ''} onChange={(e) => handleSettingsChange('systemInstruction', e.target.value)} placeholder={activeModel.systemInstruction} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors custom-scrollbar resize-y" /></div>
        </div>);
        case 'audio': return (<div className="space-y-6">
            <ToggleSwitch label="Enable Text-to-Speech" description="Read AI responses aloud automatically." checked={settings.enableTTS} onChange={(val) => handleToggleChange('enableTTS', val)} />
            <div><label htmlFor="mic-language" className="text-sm text-[var(--text-muted)] mb-2 block">Microphone Language</label><select id="mic-language" value={settings.microphoneLanguage} onChange={(e) => handleSettingsChange('microphoneLanguage', e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">{languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}</select></div>
            <hr className="border-[var(--border-primary)] !my-8" />
            <h4 className="text-base font-semibold text-[var(--text-primary)]">Sound Alerts</h4>
            <ToggleSwitch label="Enable All Sounds" description="Master switch for all in-app sounds." checked={settings.soundSettings.enableSound} onChange={(val) => handleSoundToggleChange('enableSound', val)} />
            <div className={`space-y-6 transition-opacity duration-300 ${!settings.soundSettings.enableSound ? 'opacity-50 pointer-events-none' : ''}`}>
                <Slider label="Master Volume" name="masterVolume" value={settings.soundSettings.masterVolume} min={0} max={1} step={0.05} onChange={(e) => handleSoundSettingsChange('masterVolume', parseFloat(e.target.value))} displayValue={`${Math.round(settings.soundSettings.masterVolume * 100)}%`} />
                <div className="space-y-4 pt-4 border-t border-[var(--border-primary)]">
                    <ToggleSwitch label="UI Sounds" description="For clicks, toggles, and interactions." checked={settings.soundSettings.uiSounds} onChange={(val) => handleSoundToggleChange('uiSounds', val)} />
                    <ToggleSwitch label="Message Events" description="Sound on sending/receiving messages." checked={settings.soundSettings.messageSent} onChange={(val) => {handleSoundToggleChange('messageSent', val); handleSoundToggleChange('messageReceived', val);}} />
                    <ToggleSwitch label="Notifications" description="Sound for system notifications." checked={settings.soundSettings.notifications} onChange={(val) => handleSoundToggleChange('notifications', val)} />
                    <ToggleSwitch label="Voice Recognition" description="Sounds for mic on/off." checked={settings.soundSettings.voiceRecognition} onChange={(val) => handleSoundToggleChange('voiceRecognition', val)} />
                </div>
            </div>
        </div>);
        case 'privacy': return (<div className="space-y-6">
            <ToggleSwitch label="Auto-clear Chat on Logout" description="Permanently delete chat history upon logout." checked={settings.privacySettings.autoClearOnLogout} onChange={(val) => handlePrivacySettingsChange('autoClearOnLogout', val)} />
            <div><label htmlFor="session-timeout" className="text-sm text-[var(--text-muted)] mb-2 block">Session Timeout</label><p className="text-xs text-[var(--text-muted)] mb-2">Automatically log out after a period of inactivity.</p><select id="session-timeout" value={settings.privacySettings.sessionTimeoutMinutes} onChange={(e) => handlePrivacySettingsChange('sessionTimeoutMinutes', parseInt(e.target.value))} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"><option value={0}>Never</option><option value={15}>15 Minutes</option><option value={30}>30 Minutes</option><option value={60}>1 Hour</option></select></div>
        </div>);
        case 'data': return (<div className="space-y-6">
            <div><h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Chat History</h4><div className="grid grid-cols-2 gap-3"><button onClick={onExportChatHistory} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><ArchiveBoxIcon />Export History</button><button onClick={() => { onClearChat(); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><TrashIcon />Clear History</button></div></div>
            <hr className="border-[var(--border-primary)] !my-8" />
            <div>
                <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Application Data</h4>
                <div className="space-y-3">
                    <button onClick={onBackup} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><DownloadIcon />Backup Data</button>
                    <button onClick={onRestore} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><UploadIcon />Restore Backup</button>
                </div>
            </div>
            <hr className="border-[var(--border-primary)] !my-8" />
             <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-base font-semibold text-red-300">Danger Zone</h4>
                <p className="text-sm text-red-300/80 mt-1 mb-4">This action is irreversible and will delete all local data.</p>
                <button onClick={onReset} className="w-full flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    <RefreshCwIcon />Reset Application
                </button>
            </div>
        </div>);
        default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
        <div ref={panelRef} onClick={e => e.stopPropagation()} className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] max-h-[800px] flex flex-col md:flex-row animate-scale-in-center">
            <div className="w-full md:w-64 flex-shrink-0 md:border-r border-b md:border-b-0 border-[var(--border-primary)] p-4 md:p-6 flex flex-col">
                <header className="hidden md:flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
                </header>
                <div className="flex md:hidden items-center justify-between w-full mb-4">
                     <h2 className="text-xl font-bold text-[var(--text-primary)]">{currentNav?.label}</h2>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close settings"><CloseIcon className="w-6 h-6" /></button>
                </div>
                <nav className="flex flex-row md:flex-col gap-2 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto custom-scrollbar">
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => setActiveView(item.id as SettingsView)} className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${activeView === item.id ? 'bg-purple-600/20 text-purple-300' : 'text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'}`}>
                            {item.icon}
                            <span className="hidden md:inline">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                <header className="hidden md:flex justify-between items-center mb-6 -mt-2">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">{currentNav?.label}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close settings"><CloseIcon className="w-6 h-6" /></button>
                </header>
                <div className="w-full max-w-2xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    </div>
  );
};