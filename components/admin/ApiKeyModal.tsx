import React, { useState, useEffect } from 'react';
import { ApiKey, AIProvider } from '../../types.ts';
import { CloseIcon } from './icons.tsx';
import { thirdPartyModels } from '../../data/thirdPartyModels.ts';

interface ApiKeyModalProps {
  apiKey: ApiKey | null;
  onSave: (keyData: Omit<ApiKey, 'id' | 'requestCount' | 'tokenUsage' | 'lastUsed'> | ApiKey) => void;
  onClose: () => void;
}

const initialFormData = {
  name: '',
  provider: 'OpenAI' as AIProvider,
  key: '',
  status: 'active' as 'active' | 'inactive',
};

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ apiKey, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (apiKey) {
      setFormData({
        name: apiKey.name,
        provider: apiKey.provider,
        key: apiKey.key,
        status: apiKey.status,
      });
    } else {
        setFormData(initialFormData);
    }
  }, [apiKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      onSave({ ...apiKey, ...formData });
    } else {
      onSave(formData);
    }
  };

  const providerOptions = Object.keys(thirdPartyModels).filter(p => p !== 'SAR LEGACY') as AIProvider[];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in-down"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
      >
        <header className="flex items-center justify-between pb-4 mb-6">
          <h2 id="api-key-modal-title" className="text-xl font-bold text-[var(--text-primary)]">
            {apiKey ? 'Edit API Key' : 'Add New API Key'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Provider</label>
              <select name="provider" id="provider" value={formData.provider} onChange={handleChange} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">
                {providerOptions.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Key Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder="e.g., My Personal OpenAI Key" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label htmlFor="key" className="block text-sm font-medium text-[var(--text-muted)] mb-1">API Key</label>
              <input type="password" name="key" id="key" value={formData.key} onChange={handleChange} required placeholder="sk-..." className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};