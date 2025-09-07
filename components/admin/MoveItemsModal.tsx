import React, { useState } from 'react';
import { GalleryItem } from '../../types.ts';
import { CloseIcon, FolderIcon, ChevronRightIcon } from './icons.tsx';
import * as galleryService from '../../services/galleryService.ts';

interface MoveItemsModalProps {
    galleryRoot: GalleryItem;
    onClose: () => void;
    onMove: (destinationFolderId: string) => void;
}

interface FolderTreeItemProps {
    folder: GalleryItem;
    onSelectFolder: (folderId: string) => void;
    level: number;
}

const FolderTreeItem: React.FC<FolderTreeItemProps> = ({ folder, onSelectFolder, level }) => {
    const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first two levels

    return (
        <div>
            <div className="flex items-center justify-between hover:bg-[var(--bg-interactive-hover)] rounded-md">
                <div className="flex items-center gap-2 flex-1" style={{ paddingLeft: `${level * 1.5}rem` }}>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1" disabled={!folder.children || folder.children.length === 0}>
                        {folder.children && folder.children.length > 0 ? (
                            <ChevronRightIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        ) : (
                            <span className="w-4 h-4 inline-block" /> // Placeholder for alignment
                        )}
                    </button>
                    <FolderIcon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-sm truncate">{folder.name}</span>
                </div>
                <button onClick={() => onSelectFolder(folder.id)} className="text-sm font-medium text-purple-400 hover:text-purple-300 px-3 py-1.5 whitespace-nowrap">
                    Move Here
                </button>
            </div>
            {isOpen && folder.children && (
                <div>
                    {folder.children.map(child => (
                        <FolderTreeItem key={child.id} folder={child} onSelectFolder={onSelectFolder} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const MoveItemsModal: React.FC<MoveItemsModalProps> = ({ galleryRoot, onClose, onMove }) => {
    const folderTree = galleryService.getFolderTree(galleryRoot);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="move-items-title"
            >
                <header className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-primary)] flex-shrink-0">
                    <h2 id="move-items-title" className="text-xl font-bold text-[var(--text-primary)]">
                        Move Items
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-3 pr-3">
                    <p className="text-sm text-[var(--text-muted)] mb-4">Select a destination folder:</p>
                    {folderTree && <FolderTreeItem folder={folderTree} onSelectFolder={onMove} level={0} />}
                </div>

                <div className="mt-6 flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-[var(--border-primary)]">
                    <button type="button" onClick={onClose} className="bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
