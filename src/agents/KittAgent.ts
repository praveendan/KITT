import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";

export class KittAgent {
  private ai: AIService;
  private history: Message[] = [];

  constructor(ai: AIService) {
    this.ai = ai;

    this.history.push({
      role: "system",
      content: `
You are an in-car AI assistant like KITT from Knight Rider.
You are calm, intelligent, slightly witty.
Keep responses short and voice-friendly.
      `,
    });
  }

  async handleUserInput(input: string): Promise<string> {
    this.history.push({ role: "user", content: input });

    const response = await this.ai.generateResponse({
      messages: this.history,
    });

    this.history.push({
      role: "assistant",
      content: response.text,
    });

    return response.text;
  }
}