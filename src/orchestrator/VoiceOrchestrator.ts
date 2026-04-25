import { KittAgent } from "../agents/KittAgent";
import { TTSService } from "../services/tts/TTSService";

export class VoiceOrchestrator {
  constructor(
    private agent: KittAgent,
    private tts: TTSService
  ) {}

  async handleInput(input: string) {
    const response = await this.agent.handleUserInput(input);

    console.log("KITT:", response);

    await this.tts.speak(response);
  }
}