import "dotenv/config";
import { OpenAIService } from "./services/ai/OpenAIService";
import { ElevenLabsService } from "./services/tts/ElevenLabsService";
import { KittAgent } from "./agents/KittAgent";
import { VoiceOrchestrator } from "./orchestrator/VoiceOrchestrator";

async function main() {
  const ai = new OpenAIService();
  const tts = new ElevenLabsService();
  const agent = new KittAgent(ai);

  const orchestrator = new VoiceOrchestrator(agent, tts);

  const input = process.argv.slice(2).join(" ");

  await orchestrator.handleInput(input);
}

main();