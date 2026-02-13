import { GoogleGenAI, Type, FunctionDeclaration, Schema } from "@google/genai";
import { SeoResult, SeoStrategy, ChatMessage } from "../types";

// Initialize Gemini Client
// NOTE: Process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STRATEGY_MODEL = 'gemini-3-pro-preview';
const DRAFTING_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';
const CHAT_MODEL = 'gemini-3-pro-preview';

/**
 * Stage 1: Analyze input using the Thinking model to determine SEO strategy.
 */
export const generateSeoStrategy = async (
  input: string, 
  mode: string, 
  context?: string
): Promise<SeoStrategy> => {
  const prompt = `
    Analyze the following YouTube video ${mode.toLowerCase()}. 
    Context/Constraints: ${context || 'None'}
    
    Determine the optimal SEO strategy.
    Identify:
    1. The single most effective Primary Keyword.
    2. 5-10 Secondary Keywords (long-tail and short-tail).
    3. The Search Intent (Informational, Transactional, Entertainment).
    4. 3 distinct Hook angles for titles.
    5. Key Entities mentioned.

    IMPORTANT: Detect the language of the Input Data below. The Primary Keyword, Secondary Keywords, and Hooks MUST be in that same language.

    Input Data:
    ${input.substring(0, 20000)}
  `;

  const response = await ai.models.generateContent({
    model: STRATEGY_MODEL,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 16000 }, // Allocate thinking budget for analysis
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primaryKeyword: { type: Type.STRING },
          secondaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          searchIntent: { type: Type.STRING },
          hooks: { type: Type.ARRAY, items: { type: Type.STRING } },
          entities: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['primaryKeyword', 'secondaryKeywords', 'searchIntent', 'hooks'],
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as SeoStrategy;
  }
  throw new Error("Failed to generate SEO strategy");
};

/**
 * Stage 2: Draft content based on strategy using Flash model.
 */
export const generateSeoContent = async (
  strategy: SeoStrategy,
  originalInput: string
): Promise<SeoResult> => {
  const prompt = `
    Create YouTube SEO metadata based on this strategy:
    ${JSON.stringify(strategy)}

    Original Context (excerpt): ${originalInput.substring(0, 1000)}...

    Requirements:
    1. Titles: 3 variants. 55-70 chars. High CTR. Include primary keyword near start.
    2. Descriptions: 3 variants. Highly descriptive, engaging, and comprehensive summaries of the video content (approx 150-200 words). 
       - The first 2 lines must contain the hook + primary keyword.
       - Include a clear Call to Action (CTA).
       - Ensure natural keyword insertion throughout the text.
    3. Tags: 20 mixed tags (broad/niche).
    4. Hashtags: 3-5 relevant hashtags.
    5. Thumbnail Prompt: Detailed Art Director instruction for an AI image generator. Subject, composition, lighting, colors. Aspect Ratio 16:9. Keep this in English.

    IMPORTANT: Detect the language of the "Original Context". Generate Titles, Descriptions, Tags, and Hashtags in that SAME language.

    Strictly adhere to character limits.
  `;

  const response = await ai.models.generateContent({
    model: DRAFTING_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: { type: Type.ARRAY, items: { type: Type.STRING } },
          descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          thumbnailPrompt: { type: Type.STRING },
        },
        required: ['titles', 'descriptions', 'tags', 'thumbnailPrompt'],
      }
    }
  });

  if (response.text) {
    return { ...JSON.parse(response.text), strategy };
  }
  throw new Error("Failed to draft SEO content");
};

/**
 * Search Grounding: Research competitors or trends.
 */
export const researchCompetitors = async (keyword: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find top performing YouTube video titles and gaps for the keyword: "${keyword}". List 3 competitors and 1 opportunity gap.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return response.text || "No research data available.";
};

/**
 * Image Generation: Generate thumbnail variations.
 */
export const generateThumbnailImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string[]> => {
  // Using gemini-3-pro-image-preview for high quality text rendering capabilities in thumbnails
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      }
    });

    const images: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }
    return images;
  } catch (e) {
    console.error("Image generation failed", e);
    return [];
  }
};

/**
 * Chat Assistant
 */
export const sendChatMessage = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const chat = ai.chats.create({
    model: CHAT_MODEL,
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "";
};