import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";
import { AgentOutput } from "../core/actions";
import { MAX_SHORT_TERM_MEMORY, NUM_OF_SHORT_TERM_TO_SUMMARIZE } from "../utils/constants";
import { MemoryService } from "../services/memory/MemoryService";
import { SummarizerService } from "../services/memory/SummarizerService";
import { MemoryState } from "../core/memory";

export class KittAgent {
  private state: MemoryState;

  constructor(
    private ai: AIService,
    private memory: MemoryService,
    private summarizer: SummarizerService
  ) {
    this.state = this.memory.load();
  }

  async handleUserInput(input: string): Promise<AgentOutput> {
    this.state.shortTerm.push({ role: "user", content: input });

    const contextMessages: Message[] = [
      {
        role: "system",
        content: `You are KITT... Summary of past interactions: ${this.state.summary}`
      },
      ...this.state.shortTerm
    ];

    const response = await this.ai.generateResponse({
      messages: contextMessages
    });

    this.state.shortTerm.push({
      role: "assistant",
      content: response.text
    });

    // summarize if too long
    if (this.state.shortTerm.length > MAX_SHORT_TERM_MEMORY) {
      const toSummarize = this.state.shortTerm.slice(0, NUM_OF_SHORT_TERM_TO_SUMMARIZE);

      this.state.summary = await this.summarizer.summarize(
        toSummarize,
        this.state.summary
      );

      this.state.shortTerm = this.state.shortTerm.slice(NUM_OF_SHORT_TERM_TO_SUMMARIZE);
    }

    this.memory.save(this.state);

    return response;
  }
}