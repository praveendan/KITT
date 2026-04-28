import { AIService } from "../ai/AIService";
import { Message } from "../../core/types";

export class SummarizerService {
  constructor(private ai: AIService) {}

  async summarize(messages: Message[], existingSummary: string): Promise<string> {
    const content = `
Existing summary:
${existingSummary}

New messages:
${messages.map(m => `${m.role}: ${m.content}`).join("\n")}

Update the summary concisely. Keep key facts, preferences, and context.
`;

    const result = await this.ai.generateResponse({
      messages: [{ role: "system", content }]
    });

    return result.text;
  }
}