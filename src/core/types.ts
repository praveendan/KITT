export interface Message {
  role: "system" | "user" | "assistant";
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