import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY || '';

type ChatHistoryItem = {
  role: 'user' | 'model';
  text: string;
};

export const getGeminiAmbassador = async (
  userPrompt: string,
  history: ChatHistoryItem[],
) => {
  if (!API_KEY) {
    throw new Error('API Key not found');
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const systemInstruction = `
You are the AI Ambassador for Hyaw, an Ethiopian technology team based in Addis Ababa.

Hyaw builds modern digital products, websites, business platforms, and software solutions.

Featured work includes:
- RedSea Mart — e-commerce
- Little Paris Restaurant — restaurant website and digital customer experience
- Glam Nest — beauty and salon digital experience
- Vita Food Complex — corporate food and product website
- Vick Burger & Pizza — restaurant and ordering platform

Core team:
- Biruk Birhanu
- Mikeyas Derje

Tone:
- Professional, friendly, clear, and concise
- Confident without exaggerating capabilities or inventing company facts
- Proudly Ethiopian while remaining globally focused

For specific business inquiries, encourage visitors to contact hello@hyaw.tech.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map((item) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        })),
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 400,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. How else can I help you learn about Hyaw?";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'The Hyaw AI is currently unavailable. Please reach out through our contact form.';
  }
};
