import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  }
  return aiInstance;
};

export async function generateCareerRecommendation(profile: any) {
  const ai = getAI();
  const prompt = `Based on the following profile of an engineering student:
  Name: ${profile.name}, Branch: ${profile.branch}, Year: ${profile.year}, Interests: ${profile.interests}, Skills: ${profile.skills}, Career Goals: ${profile.career_goals}
  Suggest the best career path and provide a brief justification and a 3-level roadmap.
  Return ONLY JSON in this format: { "path": "...", "justification": "...", "roadmap": [ { "level": "Level 1", "tasks": ["..."] }, ... ] }`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithMentor(message: string, history: any[] = []) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: "gemini-3.5-flash",
    config: {
      systemInstruction: "You are CareerOS Mentor, an AI career coach for engineering students. Be professional, encouraging, and provide actionable advice."
    }
  });

  // Convert history to format if needed, but sendMessage only takes message
  // If we want history, we should initialize chat with history
  const response = await chat.sendMessage({ message });
  return response.text;
}
