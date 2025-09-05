
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GalleryItem, GalleryItemType } from '../types';
import { mockGalleryItems } from '../data/mockGallery';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, FolderIcon, PlayIcon, FileTextIcon, DownloadIcon } from './icons';

interface GalleryProps {
  onClose: () => void;
}

const BaseCard: React.FC<{ onClick?: () => void, children: React.ReactNode, className?: string, itemName: string }> = ({ onClick, children, className, itemName }) => (
    <button onClick={onClick} className={`group relative block w-full aspect-square bg-[var(--bg-interactive)] rounded-2xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] focus-visible:ring-[var(--focus-ring)] transition-all duration-300 hover:border-[var(--border-primary)] border border-transparent hover:-translate-y-1 ${className}`} aria-label={`View ${itemName}`}>
        {children}
    </button>
);

const ImageCard: React.FC<{ item: GalleryItem; onClick: () => void }> = ({ item, onClick }) => (
    <BaseCard onClick={onClick} itemName={item.name}>
        <img
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-3">
             <p className="text-white font-semibold text-sm line-clamp-2 text-left">{item.name}</p>
        </div>
    </BaseCard>
);

const VideoCard: React.FC<{ item: GalleryItem; onClick: () => void }> = ({ item, onClick }) => (
    <BaseCard onClick={onClick} itemName={item.name}>
        <img
            src={item.thumbnail || item.src}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <PlayIcon className="w-12 h-12 text-white/80 transform transition-transform group-hover:scale-110" />
        </div>
        <div className="absolute bottom-0 left-0 p-3">
             <p className="text-white font-semibold text-sm line-clamp-2 text-left">{item.name}</p>
        </div>
    </BaseCard>
);

const FolderCard: React.FC<{ item: GalleryItem; onClick: () => void }> = ({ item, onClick }) => (
    <BaseCard onClick={onClick} itemName={item.name} className="flex flex-col items-center justify-center p-4">
        <FolderIcon className="w-16 h-16 text-purple-400 mb-2 transition-transform group-hover:scale-110"/>
        <p className="text-[var(--text-primary)] font-semibold text-sm text-center truncate w-full">{item.name}</p>
        <p className="text-[var(--text-muted)] text-xs">{new Date(item.date).toLocaleDateString()}</p>
    </BaseCard>
);

const FileCard: React.FC<{ item: GalleryItem; onClick: () => void }> = ({ item, onClick }) => (
     <BaseCard onClick={onClick} itemName={item.name} className="flex flex-col items-center justify-center p-4 text-left w-full">
        <FileTextIcon className="w-12 h-12 text-blue-400 mb-2 transition-transform group-hover:scale-110"/>
        <div className="w-full truncate text-center">
          <p className="text-[var(--text-primary)] font-semibold text-sm truncate">{item.name}</p>
          <p className="text-[var(--text-muted)] text-xs">{item.fileType} &middot; {item.size}</p>
        </div>
    </BaseCard>
);


const Lightbox: React.FC<{ item: GalleryItem; onClose: () => void; onNext: () => void; onPrev: () => void; }> = ({ item, onClose, onNext, onPrev }) => {
    
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
                 return (
                    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                        <FileTextIcon className="w-24 h-24 text-blue-400 mb-4"/>
                        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
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

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>

                {showNav && <>
                    <button onClick={onPrev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <button onClick={onNext} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>
                </>}

                <div className="max-w-4xl max-h-[90vh] w-auto h-auto flex flex-col lg:flex-row bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-down">
                    <div className="flex-shrink-0 flex-grow flex items-center justify-center bg-black/50 lg:w-3/4">
                       {renderContent()}
                    </div>
                    <div className="p-6 text-white lg:w-1/4 flex-shrink-0 flex flex-col">
                        <h3 className="text-lg font-bold">Details</h3>
                        <div className="mt-4 text-sm space-y-3 text-[var(--text-muted)] flex-1 overflow-y-auto custom-scrollbar">
                           <p><strong className="text-[var(--text-primary)]">Name:</strong> {item.name}</p>
                           {item.prompt && <p><strong className="text-[var(--text-primary)]">Prompt:</strong> {item.prompt}</p>}
                           <p><strong className="text-[var(--text-primary)]">Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                           {item.size && <p><strong className="text-[var(--text-primary)]">Size:</strong> {item.size}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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


export const Gallery: React.FC<GalleryProps> = ({ onClose }) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [activeFilter, setActiveFilter] = useState<GalleryItemType | 'all'>('all');
    
    const items = mockGalleryItems;
    
    const filteredItems = useMemo(() => {
        if (activeFilter === 'all') return items;
        return items.filter(item => item.type === activeFilter);
    }, [items, activeFilter]);
    
    const categories: (GalleryItemType | 'all')[] = ['all', 'image', 'video', 'file'];


    const openLightbox = (item: GalleryItem) => {
        const indexInFiltered = filteredItems.findIndex(i => i.id === item.id);
        if (indexInFiltered !== -1) {
            setSelectedItemIndex(indexInFiltered);
        }
    };

    const handleNext = useCallback(() => {
        if (selectedItemIndex === null) return;
        const nextIndex = (selectedItemIndex + 1) % filteredItems.length;
        const nextItem = filteredItems[nextIndex];
        if (nextItem.type !== 'folder' && nextItem.type !== 'file') {
            setSelectedItemIndex(nextIndex);
        } else {
            setSelectedItemIndex((prev) => (prev! + 2) % filteredItems.length);
        }
    }, [selectedItemIndex, filteredItems]);
    
    const handlePrev = useCallback(() => {
        if (selectedItemIndex === null) return;
        const prevIndex = (selectedItemIndex - 1 + filteredItems.length) % filteredItems.length;
        const prevItem = filteredItems[prevIndex];
        if (prevItem.type !== 'folder' && prevItem.type !== 'file') {
             setSelectedItemIndex(prevIndex);
        } else {
             setSelectedItemIndex((prev) => (prev! - 2 + filteredItems.length) % filteredItems.length);
        }
    }, [selectedItemIndex, filteredItems]);

    const handleCloseLightbox = () => {
        setSelectedItemIndex(null);
    };

    const selectedItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

    const renderItem = (item: GalleryItem) => {
        const handleItemClick = () => {
             if (item.type === 'folder') {
                alert(`Navigating to folder: ${item.name}`);
                return;
            }
            openLightbox(item);
        };
        switch (item.type) {
            case 'image': return <ImageCard item={item} onClick={handleItemClick} />;
            case 'video': return <VideoCard item={item} onClick={handleItemClick} />;
            case 'folder': return <FolderCard item={item} onClick={handleItemClick} />;
            case 'file': return <FileCard item={item} onClick={handleItemClick} />;
            default: return null;
        }
    };
  
    return (
        <div className="flex flex-col h-full animate-fade-in-down">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Gallery</h2>
                    <p className="text-[var(--text-muted)]">Browse your media and files</p>
                </div>
            </header>
            
             <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-1 px-1 flex-shrink-0 custom-scrollbar">
                {categories.map(category => (
                    <FilterChip 
                        key={category} 
                        text={category.charAt(0).toUpperCase() + category.slice(1)}
                        active={activeFilter === category} 
                        onClick={() => {
                            setActiveFilter(category);
                            setSelectedItemIndex(null); // Reset selection on filter change
                        }}
                    />
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredItems.map(item => (
                        <React.Fragment key={item.id}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {selectedItem && (
                <Lightbox 
                    item={selectedItem}
                    onClose={handleCloseLightbox}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            )}
        </div>
    );
};
