// src/services/ai/AIService.ts
import { AIContext, AIResponse } from "../../core/types";

export interface AIService {
  generateResponse(context: AIContext): Promise<AIResponse>;
}