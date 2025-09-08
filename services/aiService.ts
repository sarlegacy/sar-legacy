// Fix: Remove deprecated GenerateContentConfig from import
import { GoogleGenAI, Chat, Type, GenerateContentResponse, Part, Modality } from "@google/genai";
import { ChartData, CustomModel, ModelConfig, AspectRatio, GeneratedImageData, ProjectPlan, GeneratedFile, ApiKey } from "../types.ts";
import { createChatSession as createDeepseekChatSession, validateApiKey as validateDeepseekKey } from './deepseekService.ts';
import { createChatSession as createOpenAIChatSession, validateApiKey as validateOpenAIKey } from './openaiService.ts';
import { createChatSession as createAnthropicChatSession, validateApiKey as validateAnthropicKey } from './anthropicService.ts';


if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set for SAR LEGACY models");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chartDataSchema = {
    type: Type.OBJECT,
    properties: {
        chartType: { type: Type.STRING, enum: ['bar', 'line', 'pie'] },
        title: { type: Type.STRING },
        data: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    value: { type: Type.NUMBER },
                },
                 propertyOrdering: ["name", "value"],
            },
        },
        dataKey: { type: Type.STRING, enum: ['value'] },
        nameKey: { type: Type.STRING, enum: ['name'] },
    },
    required: ['chartType', 'data', 'dataKey', 'nameKey']
};

export async function generateChartData(prompt: string): Promise<ChartData> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following user request and generate the data for a chart. ${prompt}`,
            config: {
                systemInstruction: "You are a data visualization assistant. Based on the user's prompt, create data and configuration for a chart. Respond ONLY with a valid JSON object that adheres to the provided schema. For the data array, use 'name' for labels and 'value' for numerical data.",
                responseMimeType: "application/json",
                responseSchema: chartDataSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);
        
        if (!parsedData.chartType || !Array.isArray(parsedData.data)) {
            throw new Error("Invalid chart data structure received from API.");
        }
        return parsedData as ChartData;

    } catch (error) {
        console.error("Error generating chart data:", error);
        throw new Error("Failed to generate chart data. The model may not have been able to understand the request.");
    }
}

export async function generateImages(
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio,
  numberOfImages: number
): Promise<GeneratedImageData[]> {
  try {
    const fullPrompt = `${prompt}${negativePrompt ? `\n\nAvoid the following: ${negativePrompt}` : ''}`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: numberOfImages,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The model did not generate any images.");
    }

    return response.generatedImages.map(img => ({
        base64: img.image.imageBytes,
        prompt: fullPrompt,
        aspectRatio,
    }));
  } catch (error) {
      console.error("Error generating images:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      throw new Error(`Failed to generate images. ${errorMessage}`);
  }
}

export async function generateVideo(prompt: string, image?: { imageBytes: string, mimeType: string }): Promise<Blob> {
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt,
            image,
            config: { numberOfVideos: 1 }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation succeeded, but no download link was provided.");
        }

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download the generated video. Status: ${videoResponse.statusText}`);
        }
        return await videoResponse.blob();
    } catch (error) {
        console.error("Error generating video:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        throw new Error(`Failed to generate video. ${errorMessage}`);
    }
}

export async function generateProject(prompt: string): Promise<{ projectPlan: ProjectPlan, files: GeneratedFile[] }> {
    const projectSchema = {
        type: Type.OBJECT,
        properties: {
            projectPlan: {
                type: Type.OBJECT,
                properties: {
                    projectName: { type: Type.STRING, description: 'A catchy and descriptive name for the project.' },
                    technologyStack: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of technologies used (e.g., "HTML", "CSS", "JavaScript").' },
                    featureBreakdown: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A step-by-step breakdown of the features implemented.' },
                    fileList: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of all the file paths created for the project.' },
                },
                 propertyOrdering: ["projectName", "technologyStack", "featureBreakdown", "fileList"],
            },
            files: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        filePath: { type: Type.STRING, description: 'The name of the file (e.g., "index.html", "style.css").' },
                        fileContent: { type: Type.STRING, description: 'The complete code content of the file.' },
                    },
                    propertyOrdering: ["filePath", "fileContent"],
                },
            },
        },
        required: ['projectPlan', 'files'],
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a complete, functional, single-page website based on this user request: "${prompt}". The website should be visually appealing and interactive. It must consist of an index.html, a style.css, and a script.js file. Provide a project plan and the full code for each file.`,
            config: {
                systemInstruction: "You are an expert web developer AI. Your task is to generate a complete, production-ready, single-page website project from a user's prompt. You must generate all necessary HTML, CSS, and JavaScript files. The generated code should be modern, responsive, and follow best practices. Respond ONLY with a valid JSON object that adheres to the provided schema.",
                responseMimeType: "application/json",
                responseSchema: projectSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        if (!parsedData.projectPlan || !Array.isArray(parsedData.files) || parsedData.files.length === 0) {
            throw new Error("Invalid project data structure received from API.");
        }
        return parsedData;

    } catch (error) {
        console.error("Error generating project:", error);
        throw new Error("Failed to generate the website project. The model may have been unable to fulfill the request.");
    }
}

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<{ newImageBase64?: string; textResponse?: string; }> {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let newImageBase64: string | undefined;
    let textResponse: string | undefined;

    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        textResponse = part.text;
      } else if (part.inlineData) {
        newImageBase64 = part.inlineData.data;
      }
    }
    
    if (!newImageBase64 && !textResponse) {
        throw new Error("The model did not return an edited image or a text response.");
    }

    return { newImageBase64, textResponse };

  } catch (error) {
    console.error("Error editing image:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to edit image. ${errorMessage}`);
  }
}

export async function generateCodeModification(
  projectPlan: ProjectPlan,
  allFiles: GeneratedFile[],
  userRequest: string
): Promise<{ filePath: string; fileContent: string; reasoning: string; }> {
  const codeModificationSchema = {
    type: Type.OBJECT,
    properties: {
        filePath: { type: Type.STRING, description: 'The full path of the file that should be modified. This MUST be one of the files provided in the context.' },
        fileContent: { type: Type.STRING, description: 'The complete new content of the modified file.' },
        reasoning: { type: Type.STRING, description: 'A brief, user-friendly explanation of the changes made.' }
    },
    required: ['filePath', 'fileContent', 'reasoning']
  };

  try {
    const fileContext = allFiles.map(f => `--- FILE: ${f.filePath} ---\n${f.fileContent}`).join('\n\n');
    const prompt = `
      You are an expert AI programmer modifying a web project.
      Here is the project plan:
      ${JSON.stringify(projectPlan, null, 2)}

      Here are the current project files and their content:
      ${fileContext}

      The user wants to make the following change: "${userRequest}"

      Based on the user's request, identify the single most relevant file to modify.
      Then, provide the complete, updated content for that file. Do not provide diffs or partial code.
      Respond ONLY with a valid JSON object that adheres to the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: codeModificationSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    if (!parsedData.filePath || typeof parsedData.fileContent !== 'string' || !allFiles.some(f => f.filePath === parsedData.filePath)) {
      throw new Error("The model returned an invalid file path or did not return the required data.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error generating code modification:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while modifying the code.";
    throw new Error(`Failed to modify code. ${errorMessage}`);
  }
}


export async function generateContentWithGoogleSearch(prompt: string): Promise<GenerateContentResponse> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        return response;
    } catch (error) {
        console.error("Error performing Google Search grounding:", error);
        throw new Error("I was unable to search the web for that query. Please try again.");
    }
}

export async function performApiKeyHealthCheck(apiKey: ApiKey): Promise<{ status: 'valid' | 'invalid'; report: string }> {
    let validationResult: { isValid: boolean; error?: string };

    try {
        switch (apiKey.provider) {
            case 'OpenAI':
                validationResult = await validateOpenAIKey(apiKey.key);
                break;
            case 'Anthropic':
                validationResult = await validateAnthropicKey(apiKey.key);
                break;
            case 'Deepseek':
                validationResult = await validateDeepseekKey(apiKey.key);
                break;
            default:
                return { status: 'valid', report: 'SAR LEGACY keys do not require validation.' };
        }

        if (!validationResult.isValid) {
            return { status: 'invalid', report: `Validation failed: ${validationResult.error}` };
        }

        const prompt = `
            An API key for the provider "${apiKey.provider}" has been successfully validated.
            Please provide a concise security report and best practice recommendations for managing this new credential.
            The report should be brief, user-friendly, and in plain text.
            Example: "Your OpenAI key is valid. Recommendation: Set spending limits in your OpenAI dashboard and rotate the key every 90 days for enhanced security."
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { temperature: 0.5 }
        });

        return { status: 'valid', report: response.text };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { status: 'invalid', report: `An unexpected error occurred during the health check: ${errorMessage}` };
    }
}

export async function getApiKeyUsageAnalysis(apiKey: ApiKey): Promise<string> {
    try {
        const prompt = `
            Analyze the usage statistics for the following API key and provide actionable insights.
            The analysis should be concise, user-friendly, and in plain text.
            Focus on potential cost savings, unusual activity, or efficiency improvements.

            Key Details:
            - Provider: ${apiKey.provider}
            - Name: ${apiKey.name}
            - Request Count: ${apiKey.requestCount}
            - Total Tokens Used: ${apiKey.tokenUsage}
            - Last Used: ${apiKey.lastUsed || 'Never'}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { temperature: 0.7 }
        });
        
        return response.text;

    } catch (error) {
        console.error("Error getting usage analysis:", error);
        return "Failed to generate usage analysis. The AI assistant may be currently unavailable.";
    }
}

export function createChatSession(model: CustomModel, apiKey: string | undefined, config?: Partial<ModelConfig>, systemInstructionOverride?: string): Chat {
  switch (model.provider) {
    case 'SAR LEGACY': {
        const { thinkingBudget, ...restConfig } = config || {};
        const finalConfig: any = { ...restConfig };
        if (model.modelId === 'gemini-2.5-flash' && typeof thinkingBudget === 'number') {
            finalConfig.thinkingConfig = { thinkingBudget };
        }
        const instruction = systemInstructionOverride || model.systemInstruction;
        return ai.chats.create({
            model: model.modelId,
            config: { ...finalConfig, systemInstruction: instruction },
        });
    }
    case 'OpenAI':
        return createOpenAIChatSession(model, apiKey, config || {}, systemInstructionOverride);
    case 'Anthropic':
        return createAnthropicChatSession(model, apiKey, config || {}, systemInstructionOverride);
    case 'Deepseek':
        return createDeepseekChatSession(model, apiKey, config || {}, systemInstructionOverride);
    default:
        throw new Error(`Unsupported provider: ${model.provider}`);
  }
}