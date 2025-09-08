import React, { useState, useCallback } from 'react';
import { AspectRatio, GeneratedImageData } from '../../types.ts';
import { generateImages } from '../../services/aiService.ts';
import { SarLogoIcon, GenerateIcon, AspectRatio11Icon, AspectRatio169Icon, AspectRatio916Icon, AspectRatio43Icon, AspectRatio34Icon } from './icons.tsx';

interface ImageGeneratorProps {
  onImagesGenerated: (images: GeneratedImageData[]) => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImagesGenerated }) => {
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