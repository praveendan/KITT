import { AIService } from "../ai/AIService";
import { ExtractedPreference } from "../../core/profile";
import { PREFERENCE_EXTRACTION_PROMPT } from "../../utils/constants";

export class PreferenceExtractor {
  constructor(private ai: AIService) { }

  async extract(input: string): Promise<Partial<ExtractedPreference>> {
    const prompt = PREFERENCE_EXTRACTION_PROMPT

    const result = await this.ai.generateResponse({
      messages: [{ role: "system", content: prompt }]
    });

    try {
      return JSON.parse(result.text);
    } catch {
      return {};
    }
  }
}