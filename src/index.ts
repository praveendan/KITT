import "dotenv/config";
import { OpenAIService } from "./services/ai/OpenAIService";
import { ElevenLabsService } from "./services/tts/ElevenLabsService";
import { KittAgent } from "./agents/KittAgent";
import { VoiceOrchestrator } from "./orchestrator/VoiceOrchestrator";
import { ActionExecutor } from "./services/actions/ActionExecutor";
import { MemoryService } from "./services/memory/MemoryService";
import { SummarizerService } from "./services/memory/SummarizerService";
import { PreferenceExtractor } from "./services/profile/PreferenceExtractor";
import { ProfileService } from "./services/profile/ProfileService";
import { ProactiveService } from "./services/engines/ProactiveService";
import { SimulationTelemetryService } from "./services/telemetry/SimulationTelemetryService";
import { DrivingScenario } from "./core/telemetry";

async function main() {
  const ai = new OpenAIService();
  const tts = new ElevenLabsService();
  const memory = new MemoryService();
  const summarizer = new SummarizerService(ai);
  const profileService = new ProfileService();
  const preferenceExtractor = new PreferenceExtractor(ai);
  const proactive = new ProactiveService();

  // Initialize telemetry service with scenario from command line or default to 'city'
  const scenarioArg = process.argv.find(arg => arg.startsWith('scenario='));
  const scenario = (scenarioArg?.split('=')[1] || 'city') as DrivingScenario;
  const telemetry = new SimulationTelemetryService(scenario);

  const agent = new KittAgent(ai, memory, summarizer, profileService, preferenceExtractor, telemetry);
  const actions = new ActionExecutor(telemetry);

  const orchestrator = new VoiceOrchestrator(agent, tts, actions, proactive, telemetry);

  const input = process.argv.slice(2).filter(arg => !arg.startsWith('scenario=')).join(" ");

  // Start proactive suggestions every 30 seconds
  orchestrator.startProactiveTicking(30000);

  await orchestrator.handleInput(input);
}

main();