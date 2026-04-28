export type Role = "system" | "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export interface AIContext {
  messages: Message[];
}

export interface AIResponse {
  text: string;
}

export interface TTSOptions {
  voiceId?: string;
}

export interface STTResult {
  text: string;
}