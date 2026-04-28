import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";
import { AgentOutput } from "../core/actions";
import { SYSTEM_PROMPT } from "../utils/constants";
import { MemoryService } from "../services/memory/MemoryService";

const MAX_HISTORY = 20;

export class KittAgent {
  private ai: AIService;
  private history: Message[] = [];

  constructor(ai: AIService, private memory: MemoryService) {
    const saved = this.memory.load();
    this.ai = ai;

    this.history = [
      {
        role: "system",
        content: `You are KITT...`
      },
      ...saved
    ];
    this.history = this.history.slice(-MAX_HISTORY);
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

    // persist after every turn
    this.memory.save(this.history);
    return response;
  }
}