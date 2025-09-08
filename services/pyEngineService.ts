// This service now provides a real video generation implementation using Google's VEO model.
import { FrameRate, MotionBlur } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set for SAR LEGACY models");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export async function generateRealisticVideoPy(
    prompt: string, 
    image: { imageBytes: string, mimeType: string } | null | undefined, 
    onStatusUpdate: (status: string) => void,
    config: {
        videoLength: number;
        frameRate: FrameRate;
        motionBlur: MotionBlur;
    }
): Promise<Blob> {
    console.log("Calling SAR Realistic Engine (VEO implementation)...");
    console.log(`Prompt: ${prompt}`);
    console.log(`Config:`, config);
    if (image) {
        console.log(`Image attached: mimeType=${image.mimeType}, size=${image.imageBytes.length} bytes`);
    }

    // VEO API does not support these advanced settings. Log a warning.
    if (config.videoLength !== 4 || config.frameRate !== 24 || config.motionBlur !== 0) {
        console.warn("SAR Realistic Engine (VEO implementation) does not support custom video length, frame rate, or motion blur. These settings will be ignored.");
    }

    try {
        onStatusUpdate("Submitting job to video generation engine...");
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt,
            image: image || undefined, // Pass image if it exists
            config: { numberOfVideos: 1 }
        });
        
        onStatusUpdate("Video generation in progress... this can take a few minutes.");

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            onStatusUpdate("Checking generation status...");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        onStatusUpdate("Generation complete. Retrieving video...");

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation succeeded, but no download link was provided.");
        }

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download the generated video. Status: ${videoResponse.statusText}`);
        }

        const blob = await videoResponse.blob();
        onStatusUpdate("Download complete.");
        return blob;

    } catch (error) {
        console.error("Error in realistic video generation:", error);
        let userFriendlyMessage = "An unknown error occurred during video generation.";

        if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();
            if (errorMessage.includes('resource_exhausted') || errorMessage.includes('429')) {
                userFriendlyMessage = "Video generation failed due to high demand. You've exceeded the current usage quota. Please try again later or check your API plan and billing details.";
            } else {
                userFriendlyMessage = error.message;
            }
        }
        
        onStatusUpdate(`An error occurred: ${userFriendlyMessage}`);
        throw new Error(`Failed to generate realistic video. ${userFriendlyMessage}`);
    }
}