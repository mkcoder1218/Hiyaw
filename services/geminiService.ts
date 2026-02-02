
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiAmbassador = async (userPrompt: string, history: { role: 'user' | 'model', text: string }[]) => {
  if (!API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are the AI Ambassador for "Hiyaw Technology's", a premier tech company based in Ethiopia and powered by talented Ethiopian engineers. 
    Your tone is professional, innovative, and proud of Ethiopian heritage. 
    Key company info:
    - Specializations: AI/ML, FinTech (Zemen Pay), AgriTech (Gebere Connect), and Custom Enterprise Software.
    - Values: Excellence, Ethiopian Innovation, Global Impact, Integrity.
    - Location: Addis Ababa, Ethiopia.
    - Our team is 100% Ethiopian-led and powered.
    Respond concisely and encourage users to contact our sales team at hello@hiyaw.tech if they have specific business inquiries.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 400,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. How else can I help you learn about Hiyaw Technology's?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Hiyaw AI is currently undergoing maintenance. Please reach out via our contact form!";
  }
};
