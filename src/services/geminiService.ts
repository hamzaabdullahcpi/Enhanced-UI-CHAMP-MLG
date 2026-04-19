import { GoogleGenAI, Type, Schema } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. If you've just deployed to GitHub, ensure you added the secret and re-ran the build.");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = "You are an expert Multilevel Governance Strategy Assistant based on the CHAMP initiative and the CCFLA/Urban-Act Enabling Framework Conditions. Your exclusive function is to deeply analyze and contextualize climate finance recommendations. Reject any query unrelated to urban climate finance.\n\nSTAKEHOLDER MAPPING RULES:\n- Identify all relevant urban, climate, and finance stakeholders needed to implement a recommendation. \n- Account for fragmented governance: delineate between state/provincial and city-level responsibilities if applicable.\n- Broaden the search deeply, mapping across NGOs, expert organizations, policy research institutions, MDBs, Project Preparation Facilities (PPFs), and National Development Banks (NDBs) that operate in or can work with the specific country/city.\n- Double-check that your stakeholder suggestions are contextually accurate for the specific geography.\n\nTONE AND ACCURACY CONSTRAINTS:\n- Do not prescribe rigid, fictional roles. Use phrases like 'could provide', 'likely can support', or 'might facilitate' instead of 'will do' or 'is responsible for', unless you are absolutely certain of an official, legally established mandate.\n- Only use definitive/certain language if you have high confidence based on established facts.";

export interface AiContextData {
  country?: string;
  city?: string;
  partnerType?: string;
}

export interface FileData {
  inlineData: {
    mimeType: string;
    data: string;
  }
}

export async function identifyStakeholders(
  recommendationPoints: string[],
  actor: string,
  contextData: AiContextData
): Promise<string[]> {
  const ai = getGeminiClient();
  const entityName = contextData.country 
    ? contextData.city ? `${contextData.city}, ${contextData.country}` : contextData.country
    : contextData.partnerType || "the entity";

  const targetRecommendation = recommendationPoints.join(' ');

  const prompt = `Actor: ${actor}
Country: ${contextData.country || "Not specified"}
City: ${contextData.city || "Not specified"}
Partner Type: ${contextData.partnerType || "Not specified"}
Target Recommendation: ${targetRecommendation}

CRITICAL VALIDATION STEP:
If a City and Country are both provided, you MUST first verify if the City is actually located within the Country. If it is NOT, abort and reply exactly with:
LOCATION_MISMATCH: The city of ${contextData.city} is not located in ${contextData.country}.
Do not output any other text whatsoever if there is a mismatch.

STAKEHOLDER IDENTIFICATION:
If the location is valid (or if no city was provided), deeply analyze the recommendation. Identify 4 to 8 specific, highly relevant institutional stakeholders that the actor must engage to operationalize this in the specified location.
Output a strict, comma-separated list of these specific stakeholder names. Provide only the tags in the comma-separated list.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response. This might be due to safety filters.");
    }
    
    const trimmedText = text.trim();
    if (trimmedText.startsWith("LOCATION_MISMATCH:")) {
      throw new Error(trimmedText.replace("LOCATION_MISMATCH:", "").trim());
    }

    return trimmedText.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error: any) {
    console.error("Error calling Gemini API for stakeholders:", error);
    const message = error?.message || "Unknown error";
    throw new Error(`Failed to identify stakeholders: ${message}`);
  }
}

export async function generateContextualizedPlan(
  recommendationPoints: string[],
  actor: string,
  contextData: AiContextData,
  stakeholders: string[]
): Promise<string> {
  const ai = getGeminiClient();
  const entityName = contextData.country 
    ? contextData.city ? `${contextData.city}, ${contextData.country}` : contextData.country
    : contextData.partnerType || "the entity";

  const formattedRecommendations = recommendationPoints.map((rec, i) => `Recommendation ${i + 1}: ${rec}`).join('\n');
  const finalizedStakeholders = stakeholders.join(', ');

  const prompt = `Actor: ${actor}. Entity: ${entityName}.
Provided Recommendations:
${formattedRecommendations}

Candidate Stakeholders: ${finalizedStakeholders}

Generate a strategic implementation plan for ${entityName}. For EVERY recommendation provided above, you MUST structure your response EXACTLY as follows:

### [Restate the exact recommendation text here]

[From the Candidate Stakeholders list, select ONLY the specific stakeholders who are in a position to contribute to implementing THIS specific recommendation. For each selected stakeholder, provide a bullet point formatted exactly like this:]
* **[Stakeholder Name]**: [One-sentence summary of their operational role in regular text.]

[Leave a blank line and repeat this exact block for the next recommendation.]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI returned an empty response.");
    }

    return text;
  } catch (error: any) {
    console.error("Error calling Gemini API for plan generation:", error);
    const message = error?.message || "Unknown error";
    throw new Error(`Failed to generate contextualized plan: ${message}`);
  }
}

