// src/services/ai/OpenAIService.ts
import OpenAI from "openai";
import { AIService } from "./AIService";
import { AIContext, AIResponse } from "../../core/types";
import { config } from "../../core/config";
import { OPEN_API_MODAL, SYSTEM_MESSAGES } from "../../utils/constants";
import { AgentOutput } from "../../core/actions";

export class OpenAIService implements AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: config.openaiApiKey });
  }

  async generateResponse(context: AIContext): Promise<AgentOutput> {
    const res = await this.client.chat.completions.create({
      model: OPEN_API_MODAL,
      messages: [
        ...context.messages,
        ...SYSTEM_MESSAGES
      ],
    });

    const raw = res.choices[0]?.message.content || "{}";

    try {
      return JSON.parse(raw);
    } catch {
      return { text: raw };
    }
  }
}