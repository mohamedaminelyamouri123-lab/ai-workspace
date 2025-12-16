// Using blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const systemPrompt = `You are a helpful AI assistant in a Personal AI Workspace application. 
You help users with writing, coding, analysis, and general questions.
Be concise, helpful, and friendly. Format code with markdown code blocks when appropriate.`;

export async function generateChatResponse(
  userMessage: string,
  chatHistory: ChatMessage[]
): Promise<string> {
  try {
    // Build conversation history for context
    const historyContents = chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add the new user message
    const contents = [
      ...historyContents,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contents,
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI response");
  }
}
