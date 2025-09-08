import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GalleryItem, GalleryItemType } from '../../types.ts';
import {
    CloseIcon, ChevronLeftIcon, ChevronRightIcon, FolderIcon, PlayIcon, FileTextIcon,
    DownloadIcon, MoreIcon, SearchIcon, FolderPlusIcon, TrashIcon, CheckCircleIcon, EditIcon,
    SparkleIcon, WriteIcon, EyeIcon, GenerateIcon, MenuIcon
} from './icons.tsx';
import { ContextMenu } from './ContextMenu.tsx';
import { MoveItemsModal } from './MoveItemsModal.tsx';

interface GalleryProps {
    onClose: () => void;
    onMenuClick: () => void;
    galleryRoot: GalleryItem;
    onCreateFolder: (parentId: string, folderName: string) => void;
    onRenameItem: (itemId: string, newName: string) => void;
    onDeleteItems: (itemIds: string[]) => void;
    onMoveItems: (itemIds: string[], destinationId: string) => void;
    onChatWithDocument: (item: GalleryItem) => void;
    onPreviewSarProject: (item: GalleryItem) => void;
    onEditImageRequest: (item: GalleryItem) => void;
}

const Lightbox: React.FC<{
    item: GalleryItem;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    onChatWithDocument: (item: GalleryItem) => void;
    onEditImageRequest: (item: GalleryItem) => void;
}> = ({ item, onClose, onNext, onPrev, onChatWithDocument, onEditImageRequest }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (item.type !== 'file' && e.key === 'ArrowRight') onNext();
            if (item.type !== 'file' && e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev, item.type]);

    const renderContent = () => {
        switch (item.type) {
            case 'image':
                return <img src={item.src} alt={item.alt} className="max-w-full max-h-[60vh] lg:max-h-[90vh] w-auto h-auto object-contain" />;
            case 'video':
                return <video src={item.src} className="max-w-full max-h-[60vh] lg:max-h-[90vh] w-auto h-auto" controls autoPlay muted />;
            case 'file':
                const fileType = (item.fileType || '').toLowerCase();
                const isPdf = fileType.includes('pdf');

                if (isPdf && item.src) {
                    return <iframe src={item.src} title={item.name} className="w-full h-full bg-white" />;
                }
                return (
                    <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-[var(--bg-tertiary)]">
                        <FileTextIcon className="w-24 h-24 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                        <p className="text-[var(--text-muted)] mb-2">Preview not available for this file type.</p>
                        <p className="text-[var(--text-muted)] mb-6">{item.fileType} &middot; {item.size}</p>
                        <a href={item.src || '#'} download={item.name} className="flex items-center gap-2 bg-purple-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                            <DownloadIcon />
                            Download
                        </a>
                    </div>
                );
            default:
                return null;
        }
    }

    const showNav = item.type === 'image' || item.type === 'video';
    const contentContainerClass = item.type === 'file' && (item.fileType || '').toLowerCase().includes('pdf') ? 'lg:w-full h-[80vh]' : 'lg:w-3/4';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-[60] p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
                {showNav && <>
                    <button onClick={onPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-[60] p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <button onClick={onNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-[60] p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </>}
                <div className="max-w-6xl max-h-[90vh] w-full h-auto flex flex-col lg:flex-row bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-2xl animate-scale-in-center">
                    <div className={`flex-shrink-0 flex-grow flex items-center justify-center bg-black/50 ${contentContainerClass}`}>
                        {renderContent()}
                    </div>
                    <div className="p-6 text-white lg:w-1/4 flex-shrink-0 flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold">Details</h3>
                            <div className="mt-4 text-sm space-y-3 text-[var(--text-muted)]">
                                <p><strong className="text-[var(--text-primary)]">Name:</strong> {item.name}</p>
                                {item.prompt && <p><strong className="text-[var(--text-primary)]">Prompt:</strong> {item.prompt}</p>}
                                <p><strong className="text-[var(--text-primary)]">Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                                {item.size && <p><strong className="text-[var(--text-primary)]">Size:</strong> {item.size}</p>}
                            </div>
                        </div>
                        {item.type === 'file' && (
                            <button
                                onClick={() => onChatWithDocument(item)}
                                disabled={!item.file}
                                className="w-full mt-4 bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                title={!item.file ? "Chat is only available for documents uploaded in the current session." : ""}
                            >
                                Chat about this Document
                            </button>
                        )}
                        {item.type === 'image' && (
                            <button
                                onClick={() => {
                                    onClose(); // Close the lightbox before opening the editor
                                    onEditImageRequest(item);
                                }}
                                className="w-full mt-4 bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <GenerateIcon className="w-5 h-5" />
                                Edit with AI
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const GalleryItemCard: React.FC<{
    item: GalleryItem;
    isSelected: boolean;
    isRenaming: boolean;
    onToggleSelect: (itemId: string, isSelected: boolean) => void;
    onStartRename: () => void;
    onCommitRename: (newName: string) => void;
    onCancelRename: () => void;
    onOpen: () => void;
    onOpenContextMenu: (event: React.MouseEvent) => void;
}> = ({ item, isSelected, isRenaming, onToggleSelect, onStartRename, onCommitRename, onCancelRename, onOpen, onOpenContextMenu }) => {
    const renameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming) {
            renameInputRef.current?.focus();
            renameInputRef.current?.select();
        }
    }, [isRenaming]);

    const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onCommitRename(e.currentTarget.value);
        if (e.key === 'Escape') onCancelRename();
    };
    
    const renderContent = () => {
        switch (item.type) {
            case 'image': return <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />;
            case 'video': return <>
                <img src={item.thumbnail || item.src} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><PlayIcon className="w-12 h-12 text-white/80 transform transition-transform group-hover:scale-110" /></div>
            </>;
            case 'folder': return <div className="flex flex-col items-center justify-center w-full h-full p-4"><FolderIcon className="w-16 h-16 text-purple-400 mb-2 transition-transform group-hover:scale-110" /></div>;
            case 'file': return <div className="flex flex-col items-center justify-center w-full h-full p-4"><FileTextIcon className="w-12 h-12 text-blue-400 mb-2 transition-transform group-hover:scale-110" /></div>;
            case 'sar_project': return <div className="flex flex-col items-center justify-center w-full h-full p-4"><SparkleIcon className="w-16 h-16 text-purple-400 mb-2 transition-transform group-hover:scale-110" /></div>;
            default: return null;
        }
    };
    
    return (
        <div className={`group relative bg-[var(--bg-interactive)] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 border active:scale-95 ${isSelected ? 'border-purple-500' : 'border-transparent hover:border-[var(--border-primary)]'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            <button onClick={() => onToggleSelect(item.id, !isSelected)} aria-label={`Select ${item.name}`} className={`absolute top-2 left-2 z-20 p-1 rounded-full transition-opacity ${isSelected ? 'opacity-100 bg-purple-600 text-white' : 'opacity-0 group-hover:opacity-100 bg-black/50 text-white hover:bg-black/70'}`}>
                <CheckCircleIcon className="w-5 h-5" />
            </button>
            <button onClick={onOpenContextMenu} aria-label={`Actions for ${item.name}`} className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-opacity opacity-0 group-hover:opacity-100">
                <MoreIcon className="w-5 h-5" />
            </button>
            <button onClick={onOpen} className="w-full aspect-[4/3] block">{renderContent()}</button>
            <div className="absolute bottom-0 left-0 p-3 z-10 w-full">
                {isRenaming ? (
                    <input
                        ref={renameInputRef}
                        type="text"
                        defaultValue={item.name}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={(e) => onCommitRename(e.target.value)}
                        className="w-full bg-black/70 text-white font-semibold text-sm rounded p-1 border border-purple-500 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <p className="text-white font-semibold text-sm line-clamp-2 text-left" onClick={onStartRename}>{item.name}</p>
                )}
                <p className="text-gray-300 text-xs text-left">{new Date(item.date).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export const Gallery: React.FC<GalleryProps> = ({ onClose, onMenuClick, galleryRoot, onCreateFolder, onRenameItem, onDeleteItems, onMoveItems, onChatWithDocument, onPreviewSarProject, onEditImageRequest }) => {
    const [currentPath, setCurrentPath] = useState<GalleryItem[]>([galleryRoot]);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [renamingItemId, setRenamingItemId] = useState<string | null>(null);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState({ isOpen: false, position: { x: 0, y: 0 }, item: null as GalleryItem | null });
    
    const currentFolder = currentPath[currentPath.length - 1];
    const itemsInCurrentFolder = currentFolder.children || [];

    const filteredItems = useMemo(() => {
        return itemsInCurrentFolder.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [itemsInCurrentFolder, searchTerm]);

    const handleBreadcrumbClick = (index: number) => setCurrentPath(currentPath.slice(0, index + 1));
    const handleToggleSelect = (itemId: string, isSelected: boolean) => {
        setSelectedItemIds(prev => isSelected ? [...prev, itemId] : prev.filter(id => id !== itemId));
    };

    const handleCreateFolder = useCallback(() => {
        const newFolderName = 'Untitled Folder';
        let finalName = newFolderName;
        let counter = 2;
        while (itemsInCurrentFolder.some(item => item.name === finalName)) {
            finalName = `${newFolderName} ${counter++}`;
        }
        onCreateFolder(currentFolder.id, finalName);
    }, [itemsInCurrentFolder, onCreateFolder, currentFolder.id]);

    const handleOpenContextMenu = (event: React.MouseEvent, item: GalleryItem) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ isOpen: true, position: { x: event.clientX, y: event.clientY }, item });
    };

    const openLightbox = (item: GalleryItem) => {
        const viewableItems = filteredItems.filter(i => ['image', 'video', 'file'].includes(i.type));
        const indexInViewable = viewableItems.findIndex(i => i.id === item.id);
        if (indexInViewable !== -1) {
            setSelectedItemIndex(filteredItems.findIndex(i => i.id === item.id));
        }
    };

    const handleNext = useCallback(() => {
        if (selectedItemIndex === null) return;
        const viewableItems = filteredItems.filter(i => ['image', 'video'].includes(i.type));
        const currentIndexInViewable = viewableItems.findIndex(i => i.id === filteredItems[selectedItemIndex].id);
        if (currentIndexInViewable !== -1) {
            const nextViewableItem = viewableItems[(currentIndexInViewable + 1) % viewableItems.length];
            setSelectedItemIndex(filteredItems.findIndex(i => i.id === nextViewableItem.id));
        }
    }, [selectedItemIndex, filteredItems]);
    
    const handlePrev = useCallback(() => {
        if (selectedItemIndex === null) return;
        const viewableItems = filteredItems.filter(i => ['image', 'video'].includes(i.type));
        const currentIndexInViewable = viewableItems.findIndex(i => i.id === filteredItems[selectedItemIndex].id);
        if (currentIndexInViewable !== -1) {
            const prevViewableItem = viewableItems[(currentIndexInViewable - 1 + viewableItems.length) % viewableItems.length];
            setSelectedItemIndex(filteredItems.findIndex(i => i.id === prevViewableItem.id));
        }
    }, [selectedItemIndex, filteredItems]);

    const selectedItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

    const contextMenuOptions = useMemo(() => {
        const item = contextMenu.item;
        if (!item) return [];
        
        const baseOptions = [
            { label: 'Rename', icon: <EditIcon />, action: () => setRenamingItemId(item.id) },
            { label: 'Move', icon: <ChevronRightIcon />, action: () => { setSelectedItemIds([item.id]); setIsMoveModalOpen(true); } },
            { label: 'Delete', icon: <TrashIcon />, action: () => onDeleteItems([item.id]) },
        ];

        if (item.type === 'sar_project') {
            return [
                { label: 'Preview on Canvas', icon: <EyeIcon />, action: () => onPreviewSarProject(item) },
                ...baseOptions,
            ];
        }
        
        if (item.type === 'file' && item.file) {
            return [
                { label: 'Chat with Document', icon: <WriteIcon className="w-4 h-4"/>, action: () => onChatWithDocument(item) },
                ...baseOptions,
            ];
        }

        return baseOptions;
    }, [contextMenu.item, onDeleteItems, onChatWithDocument, onPreviewSarProject]);
  
    return (
        <div className="flex flex-col h-full animate-scale-in-center">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                     <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <MenuIcon />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Gallery</h2>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-1 flex-wrap">
                            {currentPath.map((folder, index) => (
                                <React.Fragment key={folder.id}>
                                    {index > 0 && <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />}
                                    <button onClick={() => handleBreadcrumbClick(index)} disabled={index === currentPath.length - 1} className="hover:text-[var(--text-primary)] disabled:font-semibold disabled:text-[var(--text-primary)] disabled:cursor-default">{folder.name}</button>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] ml-4" aria-label="Close gallery"><CloseIcon className="w-6 h-6" /></button>
            </header>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 flex-shrink-0">
                <div className="relative w-full md:max-w-xs">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Search in this folder..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCreateFolder} className="flex items-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                        <FolderPlusIcon />
                        New Folder
                    </button>
                </div>
            </div>
            
            {selectedItemIds.length > 0 && (
                 <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-2 flex items-center justify-between mb-4 animate-fade-in-down">
                    <span className="text-sm font-medium px-2">{selectedItemIds.length} item(s) selected</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsMoveModalOpen(true)} className="flex items-center gap-2 hover:bg-[var(--bg-interactive-hover)] text-sm font-medium py-1 px-3 rounded-lg transition-colors">Move</button>
                        <button onClick={() => onDeleteItems(selectedItemIds)} className="flex items-center gap-2 hover:bg-[var(--bg-interactive-hover)] text-sm font-medium py-1 px-3 rounded-lg transition-colors text-red-400"><TrashIcon />Delete</button>
                    </div>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-2">
                {filteredItems.length > 0 ? (
                    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                        {filteredItems.map((item, index) => (
                            <div key={item.id} className="animate-fade-in-up break-inside-avoid mb-4" style={{ animationDelay: `${index * 40}ms` }}>
                                <GalleryItemCard
                                    item={item}
                                    isSelected={selectedItemIds.includes(item.id)}
                                    isRenaming={renamingItemId === item.id}
                                    onToggleSelect={handleToggleSelect}
                                    onStartRename={() => setRenamingItemId(item.id)}
                                    onCommitRename={(newName) => {
                                        if (newName.trim() && newName !== item.name) {
                                            onRenameItem(item.id, newName.trim());
                                        }
                                        setRenamingItemId(null);
                                    }}
                                    onCancelRename={() => setRenamingItemId(null)}
                                    onOpen={() => {
                                        if (item.type === 'folder') {
                                            setCurrentPath(prev => [...prev, item]);
                                        } else if (item.type === 'sar_project') {
                                            onPreviewSarProject(item);
                                        } else {
                                            openLightbox(item);
                                        }
                                    }}
                                    onOpenContextMenu={(e) => handleOpenContextMenu(e, item)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-center p-8">
                        <div>
                            <h3 className="text-xl font-semibold text-[var(--text-primary)]">This Folder is Empty</h3>
                            <p className="text-[var(--text-muted)] mt-2">Upload a file or create a new folder to get started.</p>
                        </div>
                    </div>
                )}
            </div>

            {selectedItem && <Lightbox item={selectedItem} onClose={() => setSelectedItemIndex(null)} onNext={handleNext} onPrev={handlePrev} onChatWithDocument={onChatWithDocument} onEditImageRequest={onEditImageRequest} />}
            <ContextMenu isOpen={contextMenu.isOpen} position={contextMenu.position} options={contextMenuOptions} onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))} />
            {isMoveModalOpen && (
                <MoveItemsModal
                    galleryRoot={galleryRoot}
                    onClose={() => setIsMoveModalOpen(false)}
                    onMove={(destinationId) => {
                        onMoveItems(selectedItemIds, destinationId);
                        setIsMoveModalOpen(false);
                        setSelectedItemIds([]);
                    }}
                />
            )}
        </div>
    );
};