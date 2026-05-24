import { KittAgent } from "../agents/KittAgent";
import { ActionExecutor } from "../services/actions/ActionExecutor";
import { ProactiveService } from "../services/engines/ProactiveService";
import { TTSService } from "../services/tts/TTSService";
import { CarTelemetryService } from "../services/telemetry/CarTelemetryService";

export class VoiceOrchestrator {
  private cooldowns = new Map<string, number>();
  private tickInterval: NodeJS.Timeout | null = null;

  constructor(
    private agent: KittAgent,
    private tts: TTSService,
    private actions: ActionExecutor,
    private proactive: ProactiveService,
    private telemetry?: CarTelemetryService
  ) { }

  async handleInput(input: string) {
    const result = await this.agent.handleUserInput(input);

    console.log("KITT:", result.text);

    await this.tts.speak(result.text);

    await this.actions.execute(result.action);
  }

  startProactiveTicking(intervalMs: number = 30000) {
    if (this.tickInterval) return;

    this.tickInterval = setInterval(async () => {
      await this.tick();
    }, intervalMs);
  }

  stopProactiveTicking() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  async tick() {
    const TEN_MINUTES = 10 * 60 * 1000;

    const carTelemetry = this.telemetry ? await this.telemetry.getCurrentTelemetry() : undefined;
    const suggestions = this.proactive.getProactiveSuggestions(
      this.agent.getProfile(),
      carTelemetry
    );

    for (const suggestion of suggestions) {
      const key = `${suggestion.type}:${JSON.stringify(suggestion.context || {})}`;
      const last = this.cooldowns.get(key) || 0;

      if (Date.now() - last < TEN_MINUTES) {
        continue;
      }

      const naturalMessage = await this.agent.generateProactiveMessage(suggestion);
      console.log("KITT (proactive):", naturalMessage);
      await this.tts.speak(naturalMessage);
      this.cooldowns.set(key, Date.now());
    }
  }
}