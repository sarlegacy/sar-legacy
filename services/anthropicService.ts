import { Chat, GenerateContentResponse, Part } from '@google/genai';
import { CustomModel, ModelConfig } from '../types.ts';

// Anthropic API types (simplified)
interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string;
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        // Anthropic doesn't have a simple "list models" endpoint. We make a low-cost, minimal API call to check credentials.
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-haiku-20240307',
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 1
            })
        });

        if (response.status === 401) {
            return { isValid: false, error: 'Authentication failed. The provided API key is invalid.' };
        }
        if (response.ok) {
            return { isValid: true };
        }
        const errorData = await response.json();
        return { isValid: false, error: errorData.error?.message || `API Error (Status: ${response.status})` };

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
    const history: AnthropicMessage[] = [];

    const sendMessageStream = async (request: { message: string | Part[] }) => {
        if (!apiKey) {
            throw new Error(`API Key for Anthropic is missing. Please add one in the Admin Panel.`);
        }

        const textMessage = Array.isArray(request.message)
            ? request.message.find((p): p is { text: string } => typeof p === 'object' && 'text' in p && !!p.text)?.text ?? ''
            : request.message;
        
        // Anthropic requires history to alternate user/assistant. We'll just send the current message with history management.
        // For a full implementation, you'd manage the history array properly.
        const currentMessages: AnthropicMessage[] = [...history, { role: 'user', content: textMessage }];

        const body = {
            model: model.modelId,
            system: systemInstruction || model.systemInstruction,
            messages: currentMessages,
            stream: true,
            temperature: config.temperature,
            top_p: config.topP,
            top_k: config.topK,
            max_tokens: config.maxOutputTokens || 4096 // Anthropic requires max_tokens
        };

        Object.keys(body).forEach(key => (body as any)[key] === undefined && delete (body as any)[key]);
        
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Anthropic API Error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Could not get response reader');
        
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
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.type === 'content_block_delta' && parsed.delta.type === 'text_delta') {
                                    const content = parsed.delta.text;
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
                history.push({ role: 'user', content: textMessage });
                history.push({ role: 'assistant', content: accumulatedResponse });
                reader.releaseLock();
            }
        }
        
        return streamGenerator();
    };
    
    const sendMessage = async (request: { message: string | Part[] }) => {
         throw new Error("Non-streaming chat is not implemented for Anthropic.");
    };

    return { sendMessageStream, sendMessage } as unknown as Chat;
}
