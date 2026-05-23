import { KittAgent } from "../agents/KittAgent";
import { ActionExecutor } from "../services/actions/ActionExecutor";
import { ProactiveService } from "../services/engines/ProactiveService";
import { TTSService } from "../services/tts/TTSService";

export class VoiceOrchestrator {
  private cooldowns = new Map<string, number>();

  constructor(
    private agent: KittAgent,
    private tts: TTSService,
    private actions: ActionExecutor,
    private proactive: ProactiveService
  ) { }

  async handleInput(input: string) {
    const result = await this.agent.handleUserInput(input);

    console.log("KITT:", result.text);

    await this.tts.speak(result.text);

    await this.actions.execute(result.action);
  }

  async tick() {
    const TEN_MINUTES = 10 * 60 * 1000;

    const suggestion = this.proactive.shouldSuggestNavigation(
      this.agent.getProfile()
    );

    if (!suggestion) return;

    /**
     * Cooldown to avoid spamming suggestions
     * this stores defferent cooldowns for different suggestions, so if one is triggered, it doesn't block others
     * the key is in format "nav:destination" to allow for future expansion (e.g. "music:genre")
     */
    const key = `nav:${suggestion}`;
    const last = this.cooldowns.get(key) || 0;

    if (Date.now() - last < TEN_MINUTES) {
      return;
    }
    //cooldowns end

    const text = `Want me to navigate to ${suggestion}?`;

    console.log("KITT (proactive):", text);

    await this.tts.speak(text);

    this.cooldowns.set(key, Date.now());
  }
}