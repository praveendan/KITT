// src/services/ai/AIService.ts
import { AIContext } from "../../core/types";
import { AgentOutput } from "../../core/actions";

export interface AIService {
  generateResponse(context: AIContext): Promise<AgentOutput>;
}