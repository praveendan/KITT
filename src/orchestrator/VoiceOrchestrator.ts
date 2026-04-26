import { KittAgent } from "../agents/KittAgent";
import { ActionExecutor } from "../services/actions/ActionExecutor";
import { TTSService } from "../services/tts/TTSService";

export class VoiceOrchestrator {
  constructor(
    private agent: KittAgent,
    private tts: TTSService,
    private actions: ActionExecutor
  ) {}

  async handleInput(input: string) {
    const result = await this.agent.handleUserInput(input);

    console.log("KITT:", result.text);

    await this.tts.speak(result.text);

    await this.actions.execute(result.action);
  }
}