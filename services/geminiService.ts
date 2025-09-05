
// FIX: Replace deprecated `GenerationConfig` with `GenerateContentConfig` as per the coding guidelines.
import { GoogleGenAI, Chat, GenerateContentConfig, Type } from "@google/genai";
import { ChartData } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chartDataSchema = {
    type: Type.OBJECT,
    properties: {
        chartType: {
            type: Type.STRING,
            enum: ['bar', 'line', 'pie'],
            description: 'The type of chart to render.'
        },
        title: {
            type: Type.STRING,
            description: 'The title of the chart.'
        },
        data: {
            type: Type.ARRAY,
            description: 'The data for the chart. Must be an array of objects.',
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: 'The label for a data point (e.g., a month, a category).' },
                    value: { type: Type.NUMBER, description: 'The numerical value for a data point.' },
                },
                propertyOrdering: ["name", "value"],
            },
        },
        dataKey: {
            type: Type.STRING,
            description: 'The key in the data objects that holds the numerical value. Should usually be "value".',
            enum: ['value']
        },
        nameKey: {
            type: Type.STRING,
            description: 'The key in the data objects that holds the label. Should usually be "name".',
            enum: ['name']
        },
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


export function createChatSession(config?: Partial<GenerateContentConfig>): Chat {
  const model = 'gemini-2.5-flash';
  return ai.chats.create({
    model,
    config: {
      systemInstruction: 'You are SAR LEGACY, a helpful and friendly AI assistant. Provide clear, concise, and helpful responses. Your personality is professional yet approachable. Do not respond with JSON for chart data unless specifically asked via a function call.',
      ...config,
    },
  });
}