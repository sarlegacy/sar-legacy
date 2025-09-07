import React, { useState, useCallback, useEffect } from 'react';
import { GalleryItem } from '../../types.ts';
import { editImage } from '../../services/aiService.ts';
import { CloseIcon, GenerateIcon, SarLogoIcon, SparkleIcon } from './icons.tsx';

interface ImageEditorProps {
    isOpen: boolean;
    onClose: () => void;
    imageToEdit: GalleryItem | null;
    onSave: (imageData: { base64: string, prompt: string, name: string }) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ isOpen, onClose, imageToEdit, onSave }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<{ base64: string; text?: string } | null>(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset state on close
            setPrompt('');
            setError(null);
            setEditedImage(null);
        }
    }, [isOpen]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || !imageToEdit || !imageToEdit.src) return;

        setIsLoading(true);
        setError(null);
        setEditedImage(null);
        
        try {
            const [header, base64Data] = imageToEdit.src.split(',');
            if (!base64Data) throw new Error("Invalid image source format.");
            
            const mimeType = imageToEdit.fileType || header.match(/:(.*?);/)?.[1] || 'image/jpeg';

            const result = await editImage(base64Data, mimeType, prompt);

            if (result.newImageBase64) {
                 setEditedImage({ base64: result.newImageBase64, text: result.textResponse });
            } else {
                setError("The model did not return an image. It might have responded with text only: " + result.textResponse);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred during editing.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, imageToEdit]);

    const handleSave = () => {
        if (!editedImage || !imageToEdit) return;
        onSave({
            base64: editedImage.base64,
            prompt: `Edited from '${imageToEdit.name}' with prompt: ${prompt}`,
            name: `${imageToEdit.name} (Edited)`,
        });
        onClose();
    };
    
    if (!isOpen || !imageToEdit) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col p-4 animate-fade-in" onClick={onClose}>
            <div className="w-full max-w-6xl mx-auto flex flex-col h-full" onClick={e => e.stopPropagation()}>
                <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] rounded-t-2xl p-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <SparkleIcon className="w-6 h-6 text-purple-400"/>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] truncate pr-4">
                            AI Image Editor
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close Editor">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 bg-[var(--bg-secondary)] rounded-b-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-px">
                     {/* Controls */}
                    <div className="lg:col-span-1 bg-[var(--bg-secondary)] p-6 flex flex-col gap-6">
                        <h3 className="text-lg font-semibold text-center">Original Image</h3>
                        <div className="aspect-square bg-black/30 rounded-lg overflow-hidden border border-[var(--border-primary)]">
                             <img src={imageToEdit.src} alt={imageToEdit.alt} className="w-full h-full object-contain"/>
                        </div>
                        <div>
                            <label htmlFor="edit-prompt" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Editing Prompt</label>
                            <textarea id="edit-prompt" rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Add a futuristic city in the background" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar" />
                        </div>
                         <div className="mt-auto space-y-3">
                            <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? <SarLogoIcon className="w-5 h-5 animate-spin" /> : <GenerateIcon />}
                                {isLoading ? 'Editing...' : 'Generate Edit'}
                            </button>
                             {editedImage && (
                                <button onClick={handleSave} className="w-full bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-sm font-medium py-3 px-3 rounded-lg transition-colors">Save to Gallery</button>
                             )}
                        </div>
                    </div>

                    {/* Output */}
                    <div className="lg:col-span-2 bg-[var(--bg-tertiary)] p-6 flex flex-col items-center justify-center gap-4">
                         {isLoading ? (
                            <div className="flex flex-col items-center gap-4 text-purple-400">
                                <SarLogoIcon className="w-12 h-12 animate-spin" />
                                <p className="text-sm font-medium text-[var(--text-primary)]">Applying AI magic...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Editing Failed</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        ) : editedImage ? (
                            <div className="w-full h-full flex flex-col gap-4">
                                <h3 className="text-lg font-semibold text-center">Edited Image</h3>
                                <div className="flex-1 aspect-square bg-black/30 rounded-lg overflow-hidden border border-[var(--border-primary)] relative">
                                    <img src={`data:image/png;base64,${editedImage.base64}`} alt="Edited result" className="w-full h-full object-contain"/>
                                </div>
                                {editedImage.text && <p className="text-sm text-center bg-black/20 p-2 rounded-md">{editedImage.text}</p>}
                            </div>
                        ) : (
                             <div className="text-center text-[var(--text-muted)]">
                                <SparkleIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Your edited image will appear here</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
