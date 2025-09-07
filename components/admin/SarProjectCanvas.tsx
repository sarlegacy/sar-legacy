import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GalleryItem, GeneratedFile } from '../../types.ts';
import { CloseIcon, RefreshCwIcon } from './icons.tsx';
import { AiAssistantPopup } from './AiAssistantPopup.tsx';

interface SarProjectCanvasProps {
    project: GalleryItem;
    onClose: () => void;
}

const processHtml = (htmlContent: string, allFiles: GeneratedFile[]): string => {
    let processedHtml = htmlContent;

    // Inline CSS
    const cssLinks = [...htmlContent.matchAll(/<link.+?href="([^"]+\.css)".*?>/g)];
    for (const match of cssLinks) {
        const linkTag = match[0];
        const path = match[1].startsWith('./') ? match[1].substring(2) : match[1];
        const cssFile = allFiles.find(f => f.filePath === path);
        if (cssFile) {
            const styleTag = `<style>${cssFile.fileContent}</style>`;
            processedHtml = processedHtml.replace(linkTag, styleTag);
        }
    }

    // Inline JS
    const scriptTags = [...htmlContent.matchAll(/<script.+?src="([^"]+\.js)".*?><\/script>/g)];
    for (const match of scriptTags) {
        const scriptTag = match[0];
        const path = match[1].startsWith('./') ? match[1].substring(2) : match[1];
        const jsFile = allFiles.find(f => f.filePath === path);
        if (jsFile) {
            const inlineScriptTag = `<script>${jsFile.fileContent}<\/script>`;
            processedHtml = processedHtml.replace(scriptTag, inlineScriptTag);
        }
    }
    
    // Handle module scripts (assuming they are in the root for simplicity)
    const moduleScriptTags = [...htmlContent.matchAll(/<script type="module" src="\/([^"]+)".*?><\/script>/g)];
    for (const match of moduleScriptTags) {
        const scriptTag = match[0];
        const path = match[1];
        const jsFile = allFiles.find(f => f.filePath === path);
        if (jsFile) {
            // For modules, we can't just inline them in the same way.
            // A simple approach is to replace with a regular script tag.
            // A more complex approach involves Blob URLs, but let's keep it simple.
            const inlineScriptTag = `<script type="module">${jsFile.fileContent}<\/script>`;
            processedHtml = processedHtml.replace(scriptTag, inlineScriptTag);
        }
    }


    return processedHtml;
};


export const SarProjectCanvas: React.FC<SarProjectCanvasProps> = ({ project, onClose }) => {
    const [projectFiles, setProjectFiles] = useState<GeneratedFile[]>(project.generatedFiles || []);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeKey, setIframeKey] = useState(Date.now());

    const indexHtmlFile = projectFiles.find(f => f.filePath.endsWith('index.html'));

    const iframeContent = useMemo(() => {
        if (!indexHtmlFile) {
            return `<html><body><h1>Error: index.html not found in project files.</h1></body></html>`;
        }
        try {
            return processHtml(indexHtmlFile.fileContent, projectFiles);
        } catch (error) {
            console.error("Error processing project files for preview:", error);
            return `<html><body><h1>Error rendering preview.</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p></body></html>`;
        }
    }, [projectFiles]); // Re-render iframe when files change

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);
    
    // Refresh is now simply re-triggering the iframe with the current state
    const refreshPreview = useCallback(() => {
        setIframeKey(Date.now());
    }, []);

    const handleCodeUpdate = useCallback((filePath: string, newContent: string) => {
        setProjectFiles(currentFiles => {
            const newFiles = currentFiles.map(file => 
                file.filePath === filePath ? { ...file, fileContent: newContent } : file
            );
            // If file not found, maybe add it? For now, just update existing.
            return newFiles;
        });
        // The iframe will auto-refresh due to the dependency on `projectFiles` in `iframeContent`
        // We can force a re-render of the iframe component itself via key change to be sure
        setIframeKey(Date.now());
    }, []);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-t-2xl p-4 flex items-center justify-between flex-shrink-0" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[var(--text-primary)] truncate pr-4">
                    Preview: {project.name}
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={refreshPreview} className="p-2 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Refresh Preview">
                        <RefreshCwIcon className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close Preview">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-b-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
                <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    srcDoc={iframeContent}
                    title={`Preview of ${project.name}`}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                />
                {project.projectPlan && (
                    <AiAssistantPopup 
                        projectPlan={project.projectPlan}
                        initialFiles={projectFiles}
                        onCodeUpdate={handleCodeUpdate}
                    />
                )}
            </div>
        </div>
    );
};