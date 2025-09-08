import React, { useState, useCallback, useMemo, useRef, useEffect, FC, ChangeEvent } from 'react';
import { GeneratedImageData, GeneratedFile, ProjectPlan, VideoEngine, FrameRate, MotionBlur } from '../../types.ts';
import { generateVideo, generateProject } from '../../services/aiService.ts';
import { generateRealisticVideoPy } from '../../services/pyEngineService.ts';
import { ImageGenerator } from './ImageStudio.tsx';
import { CloseIcon, GenerateIcon, MovieIcon, CubeIcon, SarLogoIcon, DownloadIcon, ZipIcon, PaperclipIcon, MenuIcon, ChevronDownIcon } from './icons.tsx';

// ===================================================================================
// #region Helper Components
// ===================================================================================

const Slider: FC<{ label: string; name: string; value: number; min: number; max: number; step: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; displayValue?: string; }> = ({ label, name, value, min, max, step, onChange, displayValue }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--text-muted)]">{label}</label>
            <span className="text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-interactive)] px-2 py-0.5 rounded-full">{displayValue || value}</span>
        </div>
        <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-[var(--bg-interactive)] rounded-lg appearance-none cursor-pointer range-thumb"
        />
    </div>
);

const SegmentedControl: FC<{ options: { label: string, value: string }[], value: string, onChange: (value: string) => void }> = ({ options, value, onChange }) => (
    <div className="flex bg-[var(--bg-interactive)] rounded-lg p-1">
        {options.map(option => (
            <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`flex-1 text-center text-sm py-1.5 rounded-md transition-colors ${
                    value === option.value
                        ? 'bg-[var(--bg-secondary)] shadow text-[var(--text-primary)] font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
            >
                {option.label}
            </button>
        ))}
    </div>
);


// ===================================================================================
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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoEngine, setVideoEngine] = useState<VideoEngine>('google-veo');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<{ url: string, blob: Blob } | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Settings
    const [advancedVideoSettingsOpen, setAdvancedVideoSettingsOpen] = useState(false);
    const [videoLength, setVideoLength] = useState(4); // seconds
    const [frameRate, setFrameRate] = useState<FrameRate>(24);
    const [motionBlur, setMotionBlur] = useState<MotionBlur>(0); // 0-10 intensity

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) { setError("Please enter a prompt."); return; }
        setIsLoading(true); 
        setError(null); 
        setGeneratedVideo(null);
        setLoadingMessage('');
        try {
            let blob: Blob;
            if (videoEngine === 'sar-python') {
                const config = { videoLength, frameRate, motionBlur };
                let image;
                if (imageFile) {
                    const imageBytes = await fileToBase64(imageFile);
                    image = { imageBytes, mimeType: imageFile.type };
                }
                blob = await generateRealisticVideoPy(prompt, image, setLoadingMessage, config);
            } else {
                setLoadingMessage('Submitting to Google VEO...');
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
    }, [prompt, imageFile, videoEngine, videoLength, frameRate, motionBlur]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            if (generatedVideo) URL.revokeObjectURL(generatedVideo.url);
        };
    }, [imagePreview, generatedVideo]);

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
                    
                    {imagePreview ? (
                        <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden border border-[var(--border-primary)]">
                            <img src={imagePreview} alt="Source image preview" className="w-full h-full object-contain" />
                            <button onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80">
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] border border-[var(--border-primary)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-colors"><PaperclipIcon /> Upload Image</button>
                    )}
                </div>
                
                <div className="border-t border-[var(--border-primary)] pt-4">
                    <button onClick={() => setAdvancedVideoSettingsOpen(p => !p)} className="flex items-center justify-between w-full text-left">
                        <label className="text-sm font-medium text-[var(--text-muted)] cursor-pointer">Advanced Video Settings</label>
                        <ChevronDownIcon className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${advancedVideoSettingsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {advancedVideoSettingsOpen && (
                        <div className={`mt-4 space-y-4 transition-opacity opacity-50 pointer-events-none`}>
                             <div title={"Advanced settings like video length, frame rate, and motion blur are not currently supported by the video generation model."}>
                                <Slider label="Video Length" name="videoLength" value={videoLength} min={1} max={10} step={1} onChange={(e) => setVideoLength(parseInt(e.target.value))} displayValue={`${videoLength}s`} />
                                <div className="mt-4">
                                    <label className="text-sm text-[var(--text-muted)] mb-2 block">Frame Rate</label>
                                    <SegmentedControl value={String(frameRate)} onChange={(val) => setFrameRate(Number(val) as FrameRate)} options={[{ label: '24 fps', value: '24' }, { label: '30 fps', value: '30' }]} />
                                </div>
                                <div className="mt-4">
                                  <Slider label="Motion Blur" name="motionBlur" value={motionBlur} min={0} max={10} step={1} onChange={(e) => setMotionBlur(parseInt(e.target.value))} displayValue={`${motionBlur}/10`} />
                                </div>
                             </div>
                        </div>
                    )}
                </div>


                <div className="mt-auto space-y-3">
                  <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? <SarLogoIcon className="w-5 h-5 animate-spin" /> : <MovieIcon className="w-5 h-5"/>}{isLoading ? 'Generating...' : 'Generate Video'}</button>
                  {generatedVideo && <button onClick={() => onVideoGenerated({ blob: generatedVideo.blob, prompt })} className="w-full bg-green-600/80 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Save to Gallery</button>}
                </div>
            </div>
            <div className="lg:col-span-2 bg-[var(--bg-tertiary)] rounded-2xl p-6 flex items-center justify-center">
                {isLoading 
                    ? <div className="flex flex-col items-center gap-4 text-purple-400 text-center">
                        <SarLogoIcon className="w-12 h-12 animate-spin" />
                        <p className="text-sm font-medium text-[var(--text-primary)]">{loadingMessage || 'Initializing generation...'}</p>
                        <p className="text-xs text-[var(--text-muted)]">{videoEngine === 'sar-python' ? "Realistic engine may take several minutes." : "This process can take a few minutes."}</p>
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
  onMenuClick: () => void;
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
            <header className="flex items-start sm:items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                     <button onClick={props.onMenuClick} className="lg:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <MenuIcon />
                    </button>
                    <SarLogoIcon className="w-8 h-8 text-purple-400 hidden sm:block" />
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">SAR Studio</h2>
                        <p className="text-[var(--text-muted)]">Your central hub for generative AI creation.</p>
                    </div>
                </div>
                <button onClick={props.onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] ml-4" aria-label="Close SAR Studio"><CloseIcon className="w-6 h-6" /></button>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                <nav className="flex flex-row lg:flex-col gap-2 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto custom-scrollbar">
                    {generators.map(gen => (
                        <button key={gen.id} onClick={() => setActiveGenerator(gen.id)}
                            className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium flex-shrink-0 ${activeGenerator === gen.id ? 'bg-purple-600/20 text-purple-300' : 'text-[var(--text-muted)] hover:bg-[var(--bg-interactive-hover)] hover:text-[var(--text-primary)]'}`}>
                            {gen.icon}
                            <span className="whitespace-nowrap">{gen.name}</span>
                        </button>
                    ))}
                </nav>
                <main className="flex-1 overflow-y-auto custom-scrollbar lg:-mr-4 lg:pr-4">
                    {renderActiveGenerator()}
                </main>
            </div>
        </div>
    );
};
// #endregion