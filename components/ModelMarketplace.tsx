
import React, { useState } from 'react';
import { CustomModel } from '../types';
import { mockModels } from '../data/mockModels';
import { CloseIcon } from './icons';

interface ModelMarketplaceProps {
  onSelectModel: (model: CustomModel) => void;
  onClose: () => void;
}

const ModelCard: React.FC<{ model: CustomModel; onSelect: () => void }> = ({ model, onSelect }) => (
    <button onClick={onSelect} className="bg-[var(--bg-interactive)] border border-transparent hover:border-[var(--border-primary)] rounded-2xl p-6 flex flex-col items-start text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-xl mb-4 text-white">
            {model.icon}
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{model.name}</h3>
        <p className="text-sm text-[var(--text-muted)] flex-1">{model.description}</p>
        <div className="mt-4 text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{model.category}</div>
    </button>
);

const FilterChip: React.FC<{ text: string; active?: boolean; onClick: () => void; }> = ({ text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
      active
        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
        : 'bg-[var(--bg-interactive)] text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'
    }`}
  >
    {text}
  </button>
);


export const ModelMarketplace: React.FC<ModelMarketplaceProps> = ({ onSelectModel, onClose }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    
    const categories = ['All', ...Array.from(new Set(mockModels.map(m => m.category)))];

    const filteredModels = activeFilter === 'All'
        ? mockModels
        : mockModels.filter(model => model.category === activeFilter);
  
    return (
        <div className="flex flex-col h-full animate-fade-in-down">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Model Marketplace</h2>
                    <p className="text-[var(--text-muted)]">Select an AI assistant for your task</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close marketplace">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-1 px-1 flex-shrink-0 custom-scrollbar">
                {categories.map(category => (
                    <FilterChip key={category} text={category} active={activeFilter === category} onClick={() => setActiveFilter(category)} />
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModels.map(model => (
                        <ModelCard key={model.id} model={model} onSelect={() => onSelectModel(model)} />
                    ))}
                </div>
            </div>
        </div>
    );
};
