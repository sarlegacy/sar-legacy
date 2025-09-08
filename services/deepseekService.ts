// Fix: Correctly import types from @google/genai instead of ../types.ts
import { Chat, GenerateContentResponse, Part } from '@google/genai';
import { CustomModel, ModelConfig } from '../types.ts';

// Deepseek API types (simplified for our use case)
interface DeepseekMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface DeepseekStreamChunk {
    choices: {
        delta: {
            content?: string;
        };
    }[];
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODELS_URL = 'https://api.deepseek.com/v1/models';

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        const response = await fetch(DEEPSEEK_MODELS_URL, {
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
    const history: DeepseekMessage[] = [];
    if (systemInstruction || model.systemInstruction) {
        history.push({ role: 'system', content: systemInstruction || model.systemInstruction });
    }

    const sendMessageStream = async (request: { message: string | Part[] }) => {
        if (!apiKey) {
            throw new Error(`API Key for Deepseek is missing. Please add one in the Admin Panel.`);
        }

        const textMessage = Array.isArray(request.message)
            ? request.message.find((p): p is { text: string } => typeof p === 'object' && 'text' in p && !!p.text)?.text ?? ''
            : request.message;
        
        // Add user message to history before making the call
        history.push({ role: 'user', content: textMessage });

        const body: { [key: string]: any } = {
            model: model.modelId,
            messages: history,
            stream: true,
            temperature: config.temperature,
            top_p: config.topP,
            max_tokens: config.maxOutputTokens
        };

        // Remove undefined keys from the body
        Object.keys(body).forEach(key => body[key] === undefined && delete body[key]);

        let response;
        try {
            response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            // On network failure, remove the optimistic user message from history
            history.pop();
            if (error instanceof TypeError) {
                 throw new Error('Network request failed. This may be due to a CORS policy issue, as Deepseek API is not designed for direct browser-side calls. A backend proxy is typically required.');
            }
            throw error;
        }

        if (!response.ok) {
             // Also remove on API error
            history.pop();
            const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
            throw new Error(`Deepseek API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            history.pop(); // The request failed in a way, revert history
            throw new Error('Could not get response reader');
        }
        
        const decoder = new TextDecoder();

        async function* streamGenerator(): AsyncGenerator<GenerateContentResponse> {
            let buffer = '';
            let accumulatedResponse = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.substring(6);
                            if (data.trim() === '[DONE]') {
                                // End of stream signal
                                return;
                            }
                            try {
                                const chunk: DeepseekStreamChunk = JSON.parse(data);
                                const content = chunk.choices[0]?.delta?.content;
                                if (content) {
                                    accumulatedResponse += content;
                                    yield { text: content } as unknown as GenerateContentResponse;
                                }
                            } catch (e) {
                                console.error("Error parsing Deepseek stream chunk:", data);
                            }
                        }
                    }
                }
            } finally {
                // Once the stream is fully consumed, add the complete assistant response to the history.
                if (accumulatedResponse) {
                     history.push({ role: 'assistant', content: accumulatedResponse });
                }
                reader.releaseLock();
            }
        }
        
        return streamGenerator();
    };
    
    const sendMessage = async (request: { message: string | Part[] }) => {
         throw new Error("Non-streaming chat is not implemented for Deepseek.");
    };

    return { sendMessageStream, sendMessage } as unknown as Chat;
}