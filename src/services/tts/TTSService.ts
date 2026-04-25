// src/services/tts/TTSService.ts
export interface TTSService {
  speak(text: string): Promise<void>;
}