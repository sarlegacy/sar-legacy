import { Chat, GenerateContentResponse, Part } from '@google/genai';
import { CustomModel, ModelConfig } from '../types.ts';

// OpenAI API types (simplified)
interface OpenAIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OpenAIStreamChunk {
    choices: {
        delta: {
            content?: string;
        };
    }[];
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODELS_URL = 'https://api.openai.com/v1/models';

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        const response = await fetch(OPENAI_MODELS_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (response.ok) {
            return { isValid: true };
        } else {
            const errorData = await response.json();
            return { isValid: false, error: errorData.error?.message || `Invalid API Key (Status: ${response.status})` };
        }
    } catch (error) {
        if (error instanceof Error) {
            return { isValid: false, error: `Network error: ${error.message}` };
        }
        return { isValid: false, error: 'An unknown error occurred during validation.' };
    }
}

export function createChatSession(
    model: CustomModel,
    apiKey: string | undefined,
    config: Partial<ModelConfig>,
    systemInstruction?: string
): Chat {
    const history: OpenAIMessage[] = [];
    if (systemInstruction || model.systemInstruction) {
        history.push({ role: 'system', content: systemInstruction || model.systemInstruction });
    }

    const sendMessageStream = async (request: { message: string | Part[] }) => {
        if (!apiKey) {
            throw new Error(`API Key for OpenAI is missing. Please add one in the Admin Panel.`);
        }

        const textMessage = Array.isArray(request.message)
            ? request.message.find((p): p is { text: string } => typeof p === 'object' && 'text' in p && !!p.text)?.text ?? ''
            : request.message;
        
        history.push({ role: 'user', content: textMessage });

        const body = {
            model: model.modelId,
            messages: history,
            stream: true,
            temperature: config.temperature,
            top_p: config.topP,
            max_tokens: config.maxOutputTokens
        };

        Object.keys(body).forEach(key => (body as any)[key] === undefined && delete (body as any)[key]);

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            history.pop();
            const errorData = await response.json();
            throw new Error(`OpenAI API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            history.pop();
            throw new Error('Could not get response reader');
        }
        
        const decoder = new TextDecoder();
        let accumulatedResponse = '';

        async function* streamGenerator(): AsyncGenerator<GenerateContentResponse> {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunkText = decoder.decode(value, { stream: true });
                    const lines = chunkText.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            if (data.trim() === '[DONE]') return;
                            try {
                                const chunk: OpenAIStreamChunk = JSON.parse(data);
                                const content = chunk.choices[0]?.delta?.content;
                                if (content) {
                                    accumulatedResponse += content;
                                    yield { text: content } as unknown as GenerateContentResponse;
                                }
                            } catch (e) {
                                // Ignore non-JSON lines
                            }
                        }
                    }
                }
            } finally {
                if (accumulatedResponse) {
                     history.push({ role: 'assistant', content: accumulatedResponse });
                }
                reader.releaseLock();
            }
        }
        
        return streamGenerator();
    };
    
    const sendMessage = async (request: { message: string | Part[] }) => {
         throw new Error("Non-streaming chat is not implemented for OpenAI.");
    };

    return { sendMessageStream, sendMessage } as unknown as Chat;
}
