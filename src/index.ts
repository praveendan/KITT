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

async function main() {
  const ai = new OpenAIService();
  const tts = new ElevenLabsService();
  const memory = new MemoryService();
  const summarizer = new SummarizerService(ai);
  const profileService = new ProfileService();
  const preferenceExtractor = new PreferenceExtractor(ai);

  const agent = new KittAgent(ai, memory, summarizer, profileService, preferenceExtractor);
  const actions = new ActionExecutor();

  const orchestrator = new VoiceOrchestrator(agent, tts, actions);

  const input = process.argv.slice(2).join(" ");

  await orchestrator.handleInput(input);
}

main();