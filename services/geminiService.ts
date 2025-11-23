import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IntakeData, StyleDNA, ProposalPackage, ProposalMode, ProposalSection } from "../types";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is defined. 
// We handle missing keys gracefully in the UI if this throws.
const apiKey = process.env.API_KEY || 'MISSING_KEY';
const ai = new GoogleGenAI({ apiKey });

// --- Schemas ---

const StyleDNASchema: Schema = {
  type: Type.OBJECT,
  properties: {
    palette: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of 5 hex color codes representing the wedding palette."
    },
    adjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 sophisticated adjectives describing the vibe (e.g., Ethereal, Timeless)."
    },
    motifs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 design motifs (e.g., Trailing Ivy, Brass Accents)."
    },
    venueTypes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 suggested venue types (e.g., Historic Estate, Modern Loft)."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-sentence executive summary of the design vision."
    }
  },
  required: ["palette", "adjectives", "motifs", "venueTypes", "summary"]
};

// --- Service Functions ---

export const generateStyleDNA = async (intake: IntakeData): Promise<StyleDNA> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are a luxury wedding planner assistant. Analyze the following client intake and generate a "Style DNA".
    
    Client: ${intake.coupleName}
    Location: ${intake.location}
    Vibe Tags: ${intake.vibeTags.join(", ")}
    Notes: ${intake.notes}
    Season/Date: ${intake.eventDate}

    Create a cohesive, calm, and luxurious design profile.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: StyleDNASchema,
        systemInstruction: "You are a senior wedding designer for SayYes.ai. Your output must be calm, luxurious, and confidence-building."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as StyleDNA;
  } catch (error) {
    console.error("Gemini Style DNA Error:", error);
    // Fallback for demo if API fails/key missing
    return {
      palette: ["#F5E6E8", "#D5C0C2", "#9A8C98", "#4A4E69", "#22223B"],
      adjectives: ["Timeless", "Romantic", "Intimate"],
      motifs: ["Soft Candlelight", "Organic Florals", "Silk Textures"],
      venueTypes: ["Botanical Garden", "Historic Villa", "Private Estate"],
      summary: "A harmonious blend of organic elegance and modern sophistication, focusing on intimacy and warmth."
    };
  }
};

export const generateProposalSections = async (
  intake: IntakeData, 
  styleDNA: StyleDNA, 
  mode: ProposalMode
): Promise<ProposalSection[]> => {
  const model = "gemini-2.5-flash";
  
  // We will ask Gemini to generate the text content for sections.
  // We structure the JSON request to get section content.
  
  const isLight = mode === ProposalMode.LIGHT;
  
  const systemPrompt = isLight 
    ? "You are generating a 'Light Proposal' for a potential client. This is a sales tool. Keep it high-level, conceptual, and visionary. Do NOT be specific about logistics or vendor costs. Use estimated bands."
    : "You are generating a 'Full Proposal' for a signed client. Be precise, detailed, and authoritative. Assume the contract is signed.";

  const prompt = `
    Client: ${intake.coupleName}
    Style Summary: ${styleDNA.summary}
    Budget: ${intake.budgetBand}
    Guests: ${intake.guestCount}
    
    Generate 3 paragraphs of text for the "Vision Overview" section.
    Generate 3 specific bullet points for "Why We Love This Direction".
  `;

  try {
    // For this demo, we'll use a simpler text generation and wrap it in our structure
    // to ensure reliability without complex schema definitions for dynamic sections
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt
      }
    });

    const text = response.text || "Vision content unavailable.";
    
    // Construct sections programmatically based on AI text + Logic
    const sections: ProposalSection[] = [
      {
        id: "cover",
        title: "Cover",
        type: "text",
        content: `Prepared for ${intake.coupleName}`
      },
      {
        id: "vision",
        title: "The Vision",
        type: "text",
        content: text
      },
      {
        id: "moodboard",
        title: "Mood & Atmosphere",
        type: "gallery",
        content: "Curated inspiration for your unique celebration."
      },
      {
        id: "budget",
        title: isLight ? "Estimated Investment" : "Budget Breakdown",
        type: "budget_chart",
        content: isLight ? "Based on your guest count and preferences, we project the following investment bands." : "Detailed allocation of funds based on signed vendor contracts."
      }
    ];

    return sections;

  } catch (error) {
    console.error("Gemini Proposal Error:", error);
    return [
      { id: "error", title: "Error", type: "text", content: "Could not generate proposal content. Please check API configuration." }
    ];
  }
};
