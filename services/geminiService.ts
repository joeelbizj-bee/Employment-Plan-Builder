
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateEmploymentSuggestions(interest: string) {
  const prompt = `Provide 3 specific job titles, a typical hiring company website URL, and 5 key requirements for a person interested in: ${interest}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobTitles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3 job titles."
          },
          companyUrl: {
            type: Type.STRING,
            description: "A valid website URL of a company in this field."
          },
          requirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 5 requirements."
          }
        },
        required: ["jobTitles", "companyUrl", "requirements"]
      }
    }
  });

  return JSON.parse(response.text);
}
