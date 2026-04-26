import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";
import { AgentOutput } from "../core/actions";
import { SYSTEM_PROMPT } from "../utils/constants";

export class KittAgent {
  private ai: AIService;
  private history: Message[] = [];

  constructor(ai: AIService) {
    this.ai = ai;

    this.history.push({
      role: "system",
      content:SYSTEM_PROMPT,
    });
  }

  async handleUserInput(input: string): Promise<AgentOutput> {
    this.history.push({ role: "user", content: input });

    const response = await this.ai.generateResponse({
      messages: this.history,
    });

    this.history.push({
      role: "assistant",
      content: response.text,
    });

    return response;
  }
}