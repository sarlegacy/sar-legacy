import React, { FC, ChangeEvent, useEffect, useRef, useState, SetStateAction } from 'react';
import { AppSettings, Theme, CustomModel, ModelConfig, SoundSettings } from '../../types.ts';
import { CloseIcon, SunIcon, MoonIcon, DesktopIcon, TrashIcon, DownloadIcon, ChevronDownIcon, UploadIcon, RefreshCwIcon } from './icons.tsx';

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
}

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
    { code: 'ja-JP', name: '日本語' },
];

const CollapsibleSection: FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => (
    <div className="border-b border-[var(--border-primary)] last:border-b-0">
        <button
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
            className="w-full flex justify-between items-center text-left py-4"
        >
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
            <ChevronDownIcon className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div
            id={`section-content-${title.replace(/\s+/g, '-')}`}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
        >
            <div className="space-y-4 pt-2">
                {children}
            </div>
        </div>
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

export const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose, settings, onSettingsChange, onClearChat, triggerRef, activeModel, onBackup, onRestore, onReset, playSound }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [openSections, setOpenSections] = useState<string[]>(['Appearance & Accessibility']);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

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

  const handleSettingsChange = (key: keyof AppSettings, value: any) => {
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  };

  const handleToggleChange = (key: keyof AppSettings, value: boolean) => {
    playSound('ui');
    onSettingsChange(prev => ({ ...prev, [key]: value }));
  }

  const handleSoundSettingsChange = (key: keyof SoundSettings, value: any) => {
      onSettingsChange(prev => ({
          ...prev,
          soundSettings: {
              ...prev.soundSettings,
              [key]: value,
          }
      }));
  }

  const handleSoundToggleChange = (key: keyof SoundSettings, value: boolean) => {
    playSound('ui');
    handleSoundSettingsChange(key, value);
  }

  const handleModelConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    const newModelConfig: Partial<ModelConfig> = { ...settings.modelConfig };

    if ((name === 'maxOutputTokens' || name === 'thinkingBudget') && numValue === 0) {
      delete newModelConfig[name as keyof typeof newModelConfig];
    } else {
      (newModelConfig as any)[name] = numValue;
    }
    
    // If user reduces maxOutputTokens below thinkingBudget, clamp thinkingBudget.
    if (name === 'maxOutputTokens' && typeof newModelConfig.thinkingBudget === 'number') {
        const currentMax = newModelConfig.maxOutputTokens || 0;
        if (newModelConfig.thinkingBudget > currentMax) {
            newModelConfig.thinkingBudget = currentMax;
        }
    }

    onSettingsChange(prev => ({
      ...prev,
      modelConfig: newModelConfig as ModelConfig
    }));
  };

  const handleExportChat = () => {
    alert(`Exporting chat as ${settings.exportFormat}. This feature requires a chat history to export.`);
  };

  const sections = [
    {
      title: 'Appearance & Accessibility',
      content: (
        <>
          <div>
            <label className="text-sm text-[var(--text-muted)] mb-2 block">Theme</label>
            <div className="flex gap-3">
              <ThemeButton active={settings.theme === 'light'} onClick={() => handleSettingsChange('theme', 'light')} label="Light"><SunIcon /></ThemeButton>
              <ThemeButton active={settings.theme === 'dark'} onClick={() => handleSettingsChange('theme', 'dark')} label="Dark"><MoonIcon /></ThemeButton>
              <ThemeButton active={settings.theme === 'system'} onClick={() => handleSettingsChange('theme', 'system')} label="System"><DesktopIcon /></ThemeButton>
            </div>
          </div>
          <Slider label="Font Size" name="fontSize" value={settings.fontSize} min={80} max={120} step={5} onChange={(e) => handleSettingsChange('fontSize', parseInt(e.target.value))} displayValue={`${settings.fontSize}%`} />
          <ToggleSwitch label="Compact UI" description="Reduce padding and margins." checked={settings.compactUI} onChange={(val) => handleToggleChange('compactUI', val)} />
          <ToggleSwitch label="Disable Animations" description="Improve performance on older devices." checked={settings.animationsDisabled} onChange={(val) => handleToggleChange('animationsDisabled', val)} />
        </>
      ),
    },
    {
      title: 'Chat & Model',
      content: (
        <>
          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Chat Behavior</h4>
          <div className="space-y-4">
            <ToggleSwitch label="Send on Enter" description="Press Enter to send, Shift+Enter for new line." checked={settings.sendOnEnter} onChange={(val) => handleToggleChange('sendOnEnter', val)} />
            <ToggleSwitch label="Auto-scroll" description="Automatically scroll to new messages." checked={settings.autoScroll} onChange={(val) => handleToggleChange('autoScroll', val)} />
          </div>
          <hr className="border-[var(--border-primary)] my-6" />
          
          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Model Configuration</h4>
          <div className="space-y-4">
            <Slider label="Temperature" name="temperature" value={settings.modelConfig.temperature} min={0} max={1} step={0.1} onChange={handleModelConfigChange} />
            <Slider label="Top-P" name="topP" value={settings.modelConfig.topP} min={0} max={1} step={0.05} onChange={handleModelConfigChange} />
            <Slider label="Top-K" name="topK" value={settings.modelConfig.topK} min={1} max={100} step={1} onChange={handleModelConfigChange} />
            <Slider label="Max Output Tokens" name="maxOutputTokens" value={settings.modelConfig.maxOutputTokens || 0} min={0} max={8192} step={128} onChange={handleModelConfigChange} displayValue={settings.modelConfig.maxOutputTokens ? settings.modelConfig.maxOutputTokens.toString() : 'Default'} />
            {activeModel.modelId === 'gemini-2.5-flash' && (
              <div>
                <Slider label="Thinking Budget" name="thinkingBudget" value={settings.modelConfig.thinkingBudget || 0} min={0} max={settings.modelConfig.maxOutputTokens || 2048} step={64} onChange={handleModelConfigChange} displayValue={typeof settings.modelConfig.thinkingBudget === 'number' && settings.modelConfig.thinkingBudget > 0 ? settings.modelConfig.thinkingBudget.toString() : 'Default'} />
                <p className="text-xs text-[var(--text-muted)] mt-2">For gemini-2.5-flash, set a thinking budget to reserve tokens for the final output when using Max Output Tokens.</p>
              </div>
            )}
          </div>
          <hr className="border-[var(--border-primary)] my-6" />

          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">System Prompt</h4>
          <div>
            <label htmlFor="system-instruction" className="text-sm text-[var(--text-muted)] mb-2 block">
              Provide a custom system instruction for the current model ({activeModel.name}). Leave blank to use the model's default.
            </label>
            <textarea
              id="system-instruction"
              name="systemInstruction"
              rows={4}
              value={settings.systemInstruction || ''}
              onChange={(e) => handleSettingsChange('systemInstruction', e.target.value)}
              placeholder={activeModel.systemInstruction}
              className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors custom-scrollbar resize-y"
            />
          </div>
          <hr className="border-[var(--border-primary)] my-6" />

          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Audio</h4>
          <div className="space-y-4">
            <ToggleSwitch label="Enable Text-to-Speech" description="Read AI responses aloud automatically." checked={settings.enableTTS} onChange={(val) => handleToggleChange('enableTTS', val)} />
            <div>
              <label htmlFor="mic-language" className="text-sm text-[var(--text-muted)] mb-2 block">Input Language</label>
              <select
                id="mic-language"
                value={settings.microphoneLanguage}
                onChange={(e) => handleSettingsChange('microphoneLanguage', e.target.value)}
                className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
              >
                {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </select>
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Sound Alerts',
      content: (
        <>
            <ToggleSwitch 
                label="Enable Sound Alerts" 
                description="Master switch for all in-app sounds." 
                checked={settings.soundSettings.enableSound} 
                onChange={(val) => handleSoundToggleChange('enableSound', val)} 
            />
            <hr className="border-[var(--border-primary)] my-4" />
            <div className={`transition-opacity duration-300 ${!settings.soundSettings.enableSound ? 'opacity-50 pointer-events-none' : ''}`}>
                <Slider 
                    label="Master Volume" 
                    name="masterVolume" 
                    value={settings.soundSettings.masterVolume} 
                    min={0} max={1} step={0.05} 
                    onChange={(e) => handleSoundSettingsChange('masterVolume', parseFloat(e.target.value))} 
                    displayValue={`${Math.round(settings.soundSettings.masterVolume * 100)}%`}
                />
                <hr className="border-[var(--border-primary)] my-4" />
                <div className="space-y-4">
                    <ToggleSwitch label="UI Sounds" description="For clicks, toggles, and interactions." checked={settings.soundSettings.uiSounds} onChange={(val) => handleSoundToggleChange('uiSounds', val)} />
                    <ToggleSwitch label="Message Sent" description="Sound on sending a message." checked={settings.soundSettings.messageSent} onChange={(val) => handleSoundToggleChange('messageSent', val)} />
                    <ToggleSwitch label="Message Received" description="Sound on receiving a response." checked={settings.soundSettings.messageReceived} onChange={(val) => handleSoundToggleChange('messageReceived', val)} />
                    <ToggleSwitch label="Notifications" description="Sound for system notifications." checked={settings.soundSettings.notifications} onChange={(val) => handleSoundToggleChange('notifications', val)} />
                    <ToggleSwitch label="Voice Recognition" description="Sounds for mic on/off." checked={settings.soundSettings.voiceRecognition} onChange={(val) => handleSoundToggleChange('voiceRecognition', val)} />
                </div>
            </div>
        </>
      )
    },
    {
      title: 'Data Management',
      content: (
        <>
          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Chat History</h4>
          <div className="space-y-3">
            <button onClick={() => { onClearChat(); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
              <TrashIcon />
              Clear Current Chat
            </button>
            <div className="flex gap-3">
              <select
                id="export-format"
                value={settings.exportFormat}
                onChange={(e) => handleSettingsChange('exportFormat', e.target.value as 'markdown' | 'json' | 'text')}
                className="flex-1 bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="text">Text</option>
              </select>
              <button onClick={handleExportChat} className="flex items-center justify-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                <DownloadIcon />
                Export Chat
              </button>
            </div>
          </div>

          <hr className="border-[var(--border-primary)] my-6" />
          <h4 className="text-base font-semibold text-[var(--text-primary)] mb-3">Application Data</h4>
          <div className="space-y-3">
            <button onClick={onBackup} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
              <DownloadIcon />
              Backup App Data
            </button>
            <button onClick={onRestore} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
              <UploadIcon />
              Restore App Data
            </button>
          </div>
          
          <hr className="border-[var(--border-primary)] my-6" />
          <h4 className="text-base font-semibold text-red-400 mb-3">Danger Zone</h4>
          <div className="space-y-3">
              <button onClick={onReset} className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-medium py-2 px-4 rounded-lg transition-colors">
                <RefreshCwIcon />
                Reset Application
            </button>
            <p className="text-xs text-[var(--text-muted)]">This will permanently delete all local data and log you out. This action cannot be undone.</p>
          </div>
        </>
      ),
    },
  ];

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
        <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-2">
          <h2 id="settings-title" className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close settings">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-3 pr-3">
          {sections.map(section => (
            <CollapsibleSection
              key={section.title}
              title={section.title}
              isOpen={openSections.includes(section.title)}
              onToggle={() => toggleSection(section.title)}
            >
              {section.content}
            </CollapsibleSection>
          ))}
        </div>
      </div>
    </div>
  );
};