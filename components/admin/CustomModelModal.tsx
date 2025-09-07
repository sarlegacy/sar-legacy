import React, { useState, useEffect } from 'react';
import { CustomModel, AIProvider } from '../../types.ts';
import { CloseIcon, CpuChipIcon, OpenAiIcon, AnthropicIcon } from './icons.tsx';
import { thirdPartyModels } from '../../data/thirdPartyModels.ts';

interface CustomModelModalProps {
  model: CustomModel | null;
  onClose: () => void;
  onSave: (model: CustomModel) => void;
}

const initialFormData: Omit<CustomModel, 'id' | 'icon' | 'category'> = {
  name: '',
  description: '',
  provider: 'SAR LEGACY',
  modelId: 'gemini-2.5-flash',
  systemInstruction: '',
  isEditable: true,
};

export const CustomModelModal: React.FC<CustomModelModalProps> = ({ model, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name,
        description: model.description,
        provider: model.provider,
        modelId: model.modelId,
        systemInstruction: model.systemInstruction,
        isEditable: true,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [model]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as AIProvider;
    const defaultModelForProvider = provider === 'SAR LEGACY' ? 'gemini-2.5-flash' : thirdPartyModels[provider][0]?.id || '';
    setFormData(prev => ({
        ...prev,
        provider: provider,
        modelId: defaultModelForProvider
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalModelData: CustomModel = {
      ...(model || { id: '', icon: React.createElement(CpuChipIcon), category: 'Custom' }),
      ...formData,
      isEditable: true,
    };
    onSave(finalModelData);
  };
  
  const providerOptions: {value: AIProvider, label: string, icon: React.ReactNode}[] = [
      { value: 'SAR LEGACY', label: 'SAR LEGACY', icon: <CpuChipIcon className="w-5 h-5" /> },
      { value: 'OpenAI', label: 'OpenAI', icon: <OpenAiIcon className="w-5 h-5" /> },
      { value: 'Anthropic', label: 'Anthropic', icon: <AnthropicIcon className="w-5 h-5" /> },
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fade-in-down flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="model-modal-title"
      >
        <header className="flex items-center justify-between pb-4 mb-6 flex-shrink-0">
          <h2 id="model-modal-title" className="text-xl font-bold text-[var(--text-primary)]">
            {model ? 'Edit Custom Model' : 'Add Custom Model'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close modal">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
          <div className="space-y-4">
             <div>
              <label htmlFor="provider" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Provider</label>
              <select name="provider" id="provider" value={formData.provider} onChange={handleProviderChange} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">
                {providerOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            
            {formData.provider !== 'SAR LEGACY' && (
                <>
                     <div>
                        <label htmlFor="modelId" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Model</label>
                        <select name="modelId" id="modelId" value={formData.modelId} onChange={handleChange} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors">
                           {thirdPartyModels[formData.provider]?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>
                </>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Model Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder="e.g., My Personal Tutor" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

             <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={2} placeholder="A short description of what this model does" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            <div>
              <label htmlFor="systemInstruction" className="block text-sm font-medium text-[var(--text-muted)] mb-1">System Instruction (Persona)</label>
              <textarea name="systemInstruction" id="systemInstruction" value={formData.systemInstruction} onChange={handleChange} rows={4} required placeholder="e.g., You are a helpful assistant that speaks like a pirate." className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-[var(--border-primary)]">
            <button type="button" onClick={onClose} className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Save Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};