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
import { LoggerService } from "./services/logger/LoggerService";
import { Logger } from "./core/logger";

async function main() {
  const logger = new LoggerService();
  logger.info("Main", "Initializing KITT...");

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

  const agent = new KittAgent(ai, memory, summarizer, profileService, preferenceExtractor, telemetry, logger);
  const actions = new ActionExecutor(telemetry);

  const orchestrator = new VoiceOrchestrator(agent, tts, actions, proactive, telemetry);

  // Start proactive suggestions every 30 seconds
  orchestrator.startProactiveTicking(30000);

  // If there's initial input from command line, handle it first
  const input = process.argv.slice(2).filter(arg => !arg.startsWith('scenario=')).join(" ");
  if (input.trim()) {
    await orchestrator.handleInput(input);
  }

  // Start continuous listening loop
  await startListeningLoop(orchestrator, logger);
}

async function startListeningLoop(orchestrator: VoiceOrchestrator, logger: Logger) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  console.log("\n🚗 KITT is online and listening. Speak your command (or type 'exit' to quit)...\n");

  rl.on("line", async (input: string) => {
    if (input.toLowerCase() === "exit") {
      orchestrator.stopProactiveTicking();
      console.log("KITT: Signing off. Safe travels!");
      logger.info("Main", "KITT is shutting down");
      rl.close();
      process.exit(0);
    }

    if (input.trim()) {
      try {
        await orchestrator.handleInput(input);
      } catch (error) {
        logger.error("Main", "Error handling user input", { error: error instanceof Error ? error.message : String(error) });
      }
    }
  });

  rl.on("close", () => {
    orchestrator.stopProactiveTicking();
    process.exit(0);
  });
}

main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});