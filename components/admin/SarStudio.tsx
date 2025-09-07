import React, { useState, useCallback, useMemo, useRef } from 'react';
import { AspectRatio, GeneratedImageData, GeneratedFile, ProjectPlan, VideoEngine } from '../../types.ts';
import { generateImages, generateVideo, generateProject } from '../../services/aiService.ts';
import { generateRealisticVideoPy } from '../../services/pyEngineService.ts';
import { CloseIcon, GenerateIcon, MovieIcon, CubeIcon, SarLogoIcon, AspectRatio11Icon, AspectRatio169Icon, AspectRatio916Icon, AspectRatio43Icon, AspectRatio34Icon, DownloadIcon, ZipIcon, PaperclipIcon } from './icons.tsx';

// ===================================================================================
// #region Image Generator Component
// ===================================================================================

interface ImageGeneratorProps {
  onImagesGenerated: (images: GeneratedImageData[]) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImagesGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [numberOfImages, setNumberOfImages] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError("Please enter a prompt."); return; }
        setIsLoading(true); setError(null); setGeneratedImages([]);
        try {
            const images = await generateImages(prompt, negativePrompt, aspectRatio, numberOfImages);
            setGeneratedImages(images);
            onImagesGenerated(images);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, negativePrompt, aspectRatio, numberOfImages, onImagesGenerated]);

    const aspectRatios: { ratio: AspectRatio; label: string; icon: React.ReactNode }[] = [
        { ratio: '1:1', label: 'Square', icon: <AspectRatio11Icon /> }, { ratio: '16:9', label: 'Widescreen', icon: <AspectRatio169Icon /> },
        { ratio: '9:16', label: 'Portrait', icon: <AspectRatio916Icon /> }, { ratio: '4:3', label: 'Standard', icon: <AspectRatio43Icon /> },
        { ratio: '3:4', label: 'Tall', icon: <AspectRatio34Icon /> },
    ];
    const stylePresets = ['Photorealistic', 'Cinematic', 'Anime', 'Fantasy', '3D Render', 'Vector Art', 'Watercolor', 'Cyberpunk'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div><label htmlFor="prompt" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Prompt</label><textarea id="prompt" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A majestic lion wearing a crown, studio lighting, hyperrealistic" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar" /></div>
                <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Style Presets</label><div className="flex flex-wrap gap-2">{stylePresets.map(style => (<button key={style} onClick={() => setPrompt(p => p ? `${p}, ${style.toLowerCase()}` : style)} className="px-3 py-1 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-xs text-[var(--text-primary)] rounded-full transition-colors">{style}</button>))}</div></div>
                <div><label htmlFor="negative-prompt" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Negative Prompt (Optional)</label><textarea id="negative-prompt" rows={2} value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="e.g., blurry, low quality, cartoon" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar" /></div>
                <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Aspect Ratio</label><div className="grid grid-cols-5 gap-2">{aspectRatios.map(({ ratio, label, icon }) => (<button key={ratio} onClick={() => setAspectRatio(ratio)} title={label} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-colors ${aspectRatio === ratio ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)]'}`}>{icon}<span className="text-xs text-[var(--text-muted)]">{ratio}</span></button>))}</div></div>
                <div><label htmlFor="num-images" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Number of Images: <span className="font-semibold text-[var(--text-primary)]">{numberOfImages}</span></label><input type="range" id="num-images" min="1" max="4" step="1" value={numberOfImages} onChange={(e) => setNumberOfImages(parseInt(e.target.value))} className="w-full h-2 bg-[var(--bg-interactive)] rounded-lg appearance-none cursor-pointer range-thumb" /></div>
                <div className="mt-auto"><button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? <SarLogoIcon className="w-5 h-5 animate-spin" /> : <GenerateIcon />}{isLoading ? 'Generating...' : 'Generate'}</button></div>
            </div>
            <div className="lg:col-span-2 bg-[var(--bg-tertiary)] rounded-2xl p-6 flex items-center justify-center">
                {isLoading ? <div className="flex flex-col items-center gap-4 text-purple-400"><SarLogoIcon className="w-12 h-12 animate-spin" /><p className="text-sm font-medium text-[var(--text-primary)]">Painting with pixels...</p></div>
                : error ? <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg"><h3 className="font-semibold mb-2">Generation Failed</h3><p className="text-sm">{error}</p></div>
                : generatedImages.length > 0 ? <div className={`grid gap-4 ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} w-full`}>{generatedImages.map((image, index) => (<div key={index} className="rounded-lg overflow-hidden border border-[var(--border-primary)]"><img src={`data:image/jpeg;base64,${image.base64}`} alt={`Generated image ${index + 1}`} className="w-full h-full object-contain" /></div>))}</div>
                : <div className="text-center text-[var(--text-muted)]"><GenerateIcon className="w-16 h-16 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-[var(--text-primary)]">Your creations will appear here</h3><p className="text-sm mt-1">Enter a prompt and click 'Generate' to begin.</p></div>}
            </div>
        </div>
    );
};

// ===================================================================================
// #endregion
// #region Video Generator Component
// ===================================================================================

interface VideoGeneratorProps {
  onVideoGenerated: (data: { blob: Blob, prompt: string }) => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onVideoGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoEngine, setVideoEngine] = useState<VideoEngine>('google-veo');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<{ url: string, blob: Blob } | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError("Please enter a prompt."); return; }
        setIsLoading(true); 
        setError(null); 
        setGeneratedVideo(null);
        setLoadingMessage('');
        try {
            let blob: Blob;
            if (videoEngine === 'sar-python') {
                blob = await generateRealisticVideoPy(prompt, imageFile, setLoadingMessage);
            } else {
                setLoadingMessage('Generating with Google VEO...');
                let image;
                if (imageFile) {
                    const imageBytes = await fileToBase64(imageFile);
                    image = { imageBytes, mimeType: imageFile.type };
                }
                blob = await generateVideo(prompt, image);
            }

            const url = URL.createObjectURL(blob);
            setGeneratedVideo({ url, blob });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [prompt, imageFile, videoEngine]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setImageFile(file);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div><label htmlFor="vid-prompt" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Prompt</label><textarea id="vid-prompt" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A majestic eagle soaring through a canyon" className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar" /></div>
                
                <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Generative Engine</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setVideoEngine('google-veo')} className={`p-3 border-2 rounded-lg text-left transition-colors ${videoEngine === 'google-veo' ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)]'}`}>
                            <h4 className="font-semibold text-[var(--text-primary)] text-sm">Google VEO</h4>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Ideal for creative and stylized video clips.</p>
                        </button>
                        <button onClick={() => setVideoEngine('sar-python')} className={`p-3 border-2 rounded-lg text-left transition-colors ${videoEngine === 'sar-python' ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)]'}`}>
                            <h4 className="font-semibold text-[var(--text-primary)] text-sm">SAR Realistic Engine</h4>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Powered by a custom Python backend for photorealistic results.</p>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Source Image (Optional)</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><PaperclipIcon /> {imageFile ? 'Change Image' : 'Upload Image'}</button>
                    {imageFile && <p className="text-xs text-center text-[var(--text-muted)] mt-2 truncate">Selected: {imageFile.name}</p>}
                </div>
                <div className="mt-auto space-y-3">
                  <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? <SarLogoIcon className="w-5 h-5 animate-spin" /> : <MovieIcon />}{isLoading ? 'Generating...' : 'Generate Video'}</button>
                  {generatedVideo && <button onClick={() => onVideoGenerated({ blob: generatedVideo.blob, prompt })} className="w-full bg-green-600/80 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Save to Gallery</button>}
                </div>
            </div>
            <div className="lg:col-span-2 bg-[var(--bg-tertiary)] rounded-2xl p-6 flex items-center justify-center">
                {isLoading 
                    ? <div className="flex flex-col items-center gap-4 text-purple-400 text-center">
                        <SarLogoIcon className="w-12 h-12 animate-spin" />
                        <p className="text-sm font-medium text-[var(--text-primary)]">{loadingMessage || 'Generating video...'}</p>
                        <p className="text-xs text-[var(--text-muted)]">{videoEngine === 'sar-python' ? "Realistic engine may take longer." : "This process can take several minutes."}</p>
                      </div>
                : error ? <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg"><h3 className="font-semibold mb-2">Generation Failed</h3><p className="text-sm">{error}</p></div>
                : generatedVideo ? <video src={generatedVideo.url} controls autoPlay muted loop className="max-w-full max-h-full rounded-lg" />
                : <div className="text-center text-[var(--text-muted)]"><MovieIcon className="w-16 h-16 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-[var(--text-primary)]">Your generated video will appear here</h3></div>}
            </div>
        </div>
    );
};

// ===================================================================================
// #endregion
// #region Website Generator Component
// ===================================================================================

interface WebsiteGeneratorProps {
  onProjectGenerated: (data: { projectPlan: ProjectPlan, files: GeneratedFile[] }) => void;
}

const processHtmlForPreview = (htmlContent: string, allFiles: GeneratedFile[]): string => {
    let processedHtml = htmlContent;
    const cssLinks = [...htmlContent.matchAll(/<link.+?href="([^"]+\.css)".*?>/g)];
    for (const match of cssLinks) {
        const cssFile = allFiles.find(f => f.filePath === match[1]);
        if (cssFile) processedHtml = processedHtml.replace(match[0], `<style>${cssFile.fileContent}</style>`);
    }
    const scriptTags = [...htmlContent.matchAll(/<script.+?src="([^"]+\.js)".*?><\/script>/g)];
    for (const match of scriptTags) {
        const jsFile = allFiles.find(f => f.filePath === match[1]);
        if (jsFile) processedHtml = processedHtml.replace(match[0], `<script>${jsFile.fileContent}<\/script>`);
    }
    return processedHtml;
};

const WebsiteGenerator: React.FC<WebsiteGeneratorProps> = ({ onProjectGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedProject, setGeneratedProject] = useState<{ projectPlan: ProjectPlan, files: GeneratedFile[] } | null>(null);

    const iframeContent = useMemo(() => {
        if (!generatedProject) return '';
        const indexHtml = generatedProject.files.find(f => f.filePath === 'index.html');
        return indexHtml ? processHtmlForPreview(indexHtml.fileContent, generatedProject.files) : '<html><body>index.html not found</body></html>';
    }, [generatedProject]);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError("Please enter a description for the website."); return; }
        setIsLoading(true); setError(null); setGeneratedProject(null);
        try {
            const project = await generateProject(prompt);
            setGeneratedProject(project);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    const handleDownloadZip = () => {
        if (!generatedProject) return;
        const zip = new (window as any).JSZip();
        generatedProject.files.forEach(file => { zip.file(file.filePath, file.fileContent); });
        zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${generatedProject.projectPlan.projectName.replace(/\s+/g, '_')}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div><label htmlFor="web-prompt" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Website Description</label><textarea id="web-prompt" rows={12} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A modern portfolio website for a photographer named Jane Doe, featuring a dark theme, a gallery section with a grid of photos, and a contact form." className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar" /></div>
                <div className="mt-auto space-y-3">
                  <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? <SarLogoIcon className="w-5 h-5 animate-spin" /> : <CubeIcon />}{isLoading ? 'Building...' : 'Build Website'}</button>
                  {generatedProject && (<div className="flex gap-3"><button onClick={handleDownloadZip} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] text-sm font-medium py-2 px-3 rounded-lg transition-colors"><ZipIcon />Download ZIP</button><button onClick={() => onProjectGenerated(generatedProject)} className="w-full bg-green-600/80 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Save to Gallery</button></div>)}
                </div>
            </div>
            <div className="lg:col-span-2 bg-[var(--bg-tertiary)] rounded-2xl p-2 flex flex-col items-center justify-center">
                {isLoading ? <div className="flex flex-col items-center gap-4 text-purple-400 text-center"><SarLogoIcon className="w-12 h-12 animate-spin" /><p className="text-sm font-medium text-[var(--text-primary)]">Constructing your website...</p></div>
                : error ? <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg"><h3 className="font-semibold mb-2">Build Failed</h3><p className="text-sm">{error}</p></div>
                : generatedProject ? <iframe srcDoc={iframeContent} title="Website Preview" className="w-full h-full bg-white rounded-lg border-4 border-[var(--bg-tertiary)]" />
                : <div className="text-center text-[var(--text-muted)]"><CubeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" /><h3 className="text-lg font-semibold text-[var(--text-primary)]">Your website preview will appear here</h3></div>}
            </div>
        </div>
    );
};

// ===================================================================================
// #endregion
// #region Main SarStudio Component
// ===================================================================================

interface SarStudioProps {
  onClose: () => void;
  onImagesGenerated: (images: GeneratedImageData[]) => void;
  onVideoGenerated: (data: { blob: Blob, prompt: string }) => void;
  onProjectGenerated: (data: { projectPlan: ProjectPlan, files: GeneratedFile[] }) => void;
}

type GeneratorType = 'image' | 'video' | 'website';

export const SarStudio: React.FC<SarStudioProps> = (props) => {
    const [activeGenerator, setActiveGenerator] = useState<GeneratorType>('image');

    const generators: { id: GeneratorType; name: string; icon: React.ReactNode }[] = [
        { id: 'image', name: 'Image Generator', icon: <GenerateIcon className="w-5 h-5" /> },
        { id: 'video', name: 'Video Generator', icon: <MovieIcon className="w-5 h-5" /> },
        { id: 'website', name: 'Website Generator', icon: <CubeIcon className="w-5 h-5" /> },
    ];
    
    const renderActiveGenerator = () => {
        switch (activeGenerator) {
            case 'image': return <ImageGenerator onImagesGenerated={props.onImagesGenerated} />;
            case 'video': return <VideoGenerator onVideoGenerated={props.onVideoGenerated} />;
            case 'website': return <WebsiteGenerator onProjectGenerated={props.onProjectGenerated} />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in-down">
            <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <SarLogoIcon className="w-8 h-8 text-purple-400" />
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">SAR Studio</h2>
                        <p className="text-[var(--text-muted)]">Your central hub for generative AI creation.</p>
                    </div>
                </div>
                <button onClick={props.onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] ml-4" aria-label="Close SAR Studio"><CloseIcon className="w-6 h-6" /></button>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                <nav className="flex flex-col gap-2">
                    {generators.map(gen => (
                        <button key={gen.id} onClick={() => setActiveGenerator(gen.id)}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeGenerator === gen.id ? 'bg-purple-600/20 text-purple-300' : 'text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'}`}>
                            {gen.icon}
                            <span>{gen.name}</span>
                        </button>
                    ))}
                </nav>
                <main className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                    {renderActiveGenerator()}
                </main>
            </div>
        </div>
    );
};
// #endregion