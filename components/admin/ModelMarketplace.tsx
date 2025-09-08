import React, { useState, useMemo, useCallback, useRef } from 'react';
import { CustomModel } from '../../types.ts';
// FIX: Add MenuIcon to imports for mobile navigation.
import { CloseIcon, UserPlusIcon, EditIcon, TrashIcon, OpenAiIcon, AnthropicIcon, SarLogoIcon, DownloadIcon, MenuIcon } from './icons.tsx';

interface ModelMarketplaceProps {
  models: CustomModel[];
  onSelectModel: (model: CustomModel) => void;
  onClose: () => void;
  onAddModel: () => void;
  onEditModel: (model: CustomModel) => void;
  onDeleteModel: (modelId: string) => void;
  onImportModels: (models: any[]) => void;
  // FIX: Add onMenuClick prop for mobile navigation.
  onMenuClick: () => void;
}

interface ModelCardProps {
    model: CustomModel;
    onSelect: (model: CustomModel) => void;
    onEdit: (model: CustomModel) => void;
    onDelete: (model: CustomModel) => void;
}

const ModelCard: React.FC<ModelCardProps> = React.memo(({ model, onSelect, onEdit, onDelete }) => {
    
    const providerLogo = useMemo(() => {
        const iconProps = { className: "w-5 h-5 flex-shrink-0" };
        switch(model.provider) {
            case 'OpenAI':
                return <OpenAiIcon {...iconProps} />;
            case 'Anthropic':
                return <AnthropicIcon {...iconProps} />;
            case 'SAR LEGACY':
            default:
                return <SarLogoIcon {...iconProps} className="w-5 h-5 text-purple-400 flex-shrink-0" />;
        }
    }, [model.provider]);

    const handleSelect = useCallback(() => onSelect(model), [model, onSelect]);
    const handleEdit = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onEdit(model); }, [model, onEdit]);
    const handleDelete = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onDelete(model); }, [model, onDelete]);

    return (
        <div className="bg-[var(--bg-interactive)] border border-transparent hover:border-[var(--border-primary)] rounded-2xl p-6 flex flex-col items-start text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl relative group h-full active:scale-95">
            <button onClick={handleSelect} className="w-full h-full text-left flex flex-col items-start">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-xl mb-4 text-white">
                    {model.icon}
                </div>
                <div className="flex items-center gap-2 mb-1">
                    {providerLogo}
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{model.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-muted)] flex-1">{model.description}</p>
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">{model.category}</span>
                    <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">{model.provider}</span>
                </div>
            </button>
             {model.isEditable && (
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleEdit} aria-label={`Edit ${model.name}`} className="p-2 bg-[var(--bg-secondary)] rounded-full text-blue-400 hover:bg-[var(--bg-interactive-hover)]">
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button onClick={handleDelete} aria-label={`Delete ${model.name}`} className="p-2 bg-[var(--bg-secondary)] rounded-full text-red-400 hover:bg-[var(--bg-interactive-hover)]">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
});

interface FilterChipProps {
    text: string;
    active?: boolean;
    onClick: (text: string) => void;
}

const FilterChip: React.FC<FilterChipProps> = React.memo(({ text, active, onClick }) => {
  const handleClick = useCallback(() => onClick(text), [onClick, text]);
  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap active:scale-95 ${
        active
          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
          : 'bg-[var(--bg-interactive)] text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'
      }`}
    >
      {text}
    </button>
  );
});


export const ModelMarketplace: React.FC<ModelMarketplaceProps> = ({ models, onSelectModel, onClose, onAddModel, onEditModel, onDeleteModel, onImportModels, onMenuClick }) => {
    const [activeFilter, setActiveFilter] = useState('All');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const categories = useMemo(() => ['All', ...Array.from(new Set(models.map(m => m.category)))], [models]);

    const filteredModels = useMemo(() => activeFilter === 'All'
        ? models
        : models.filter(model => model.category === activeFilter), [models, activeFilter]);
  
    const handleFilterClick = useCallback((category: string) => {
        setActiveFilter(category);
    }, []);

    const handleDeleteModelWithConfirm = useCallback((model: CustomModel) => {
        if (confirm(`Are you sure you want to delete "${model.name}"?`)) {
            onDeleteModel(model.id);
        }
    }, [onDeleteModel]);
    
    const handleExportModels = useCallback(() => {
        const customModels = models.filter(m => m.isEditable);
        if (customModels.length === 0) {
            alert("No custom models to export.");
            return;
        }

        const serializableModels = customModels.map(({ icon, id, ...rest }) => rest);
        const jsonString = JSON.stringify(serializableModels, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sar-legacy-custom-models.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [models]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            onImportModels(data);
        } catch (error) {
            console.error("Failed to import models:", error);
            alert(`Failed to import models. Please ensure the file is a valid JSON. Error: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            if (event.target) {
                event.target.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col h-full animate-scale-in-center">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <MenuIcon />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Model Marketplace</h2>
                        <p className="text-[var(--text-muted)]">Select or create an AI assistant for your task</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
                    <button onClick={handleImportClick} className="flex items-center gap-2 bg-[var(--bg-interactive)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg hover:bg-[var(--bg-interactive-hover)] transition-colors">
                        <DownloadIcon className="transform rotate-180" />
                        Import
                    </button>
                    <button onClick={handleExportModels} className="flex items-center gap-2 bg-[var(--bg-interactive)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg hover:bg-[var(--bg-interactive-hover)] transition-colors">
                        <DownloadIcon />
                        Export
                    </button>
                    <button onClick={onAddModel} className="flex items-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                        <UserPlusIcon />
                        Add Custom Model
                    </button>
                    {/* FIX: Moved close button into header for consistency */}
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close marketplace">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-1 px-1 flex-shrink-0 custom-scrollbar">
                    {categories.map(category => (
                        <FilterChip key={category} text={category} active={activeFilter === category} onClick={handleFilterClick} />
                    ))}
                </div>
            </div>


            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModels.map((model, index) => (
                        <div key={model.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <ModelCard 
                                model={model} 
                                onSelect={onSelectModel}
                                onEdit={onEditModel}
                                onDelete={handleDeleteModelWithConfirm}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};