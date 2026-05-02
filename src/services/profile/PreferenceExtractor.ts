import { AIService } from "../ai/AIService";
import { ExtractedUserProfileFromInput } from "../../core/profile";

export class PreferenceExtractor {
  constructor(private ai: AIService) { }

  async extract(input: string): Promise<Partial<ExtractedUserProfileFromInput>> {
    const prompt = `
Extract user preferences from this message.
Message:
"${input}"

Return JSON only:
{
  "musicPreference": string | null,
  "frequentDestination": string | null,
  "drivingStyle": string | null
}
`;

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