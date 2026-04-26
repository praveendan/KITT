import "dotenv/config";
import { OpenAIService } from "./services/ai/OpenAIService";
import { ElevenLabsService } from "./services/tts/ElevenLabsService";
import { KittAgent } from "./agents/KittAgent";
import { VoiceOrchestrator } from "./orchestrator/VoiceOrchestrator";
import { ActionExecutor } from "./services/actions/ActionExecutor";

async function main() {
  const ai = new OpenAIService();
  const tts = new ElevenLabsService();
  const agent = new KittAgent(ai);
  const actions = new ActionExecutor();

  const orchestrator = new VoiceOrchestrator(agent, tts, actions);

  const input = process.argv.slice(2).join(" ");

  await orchestrator.handleInput(input);
}

main();