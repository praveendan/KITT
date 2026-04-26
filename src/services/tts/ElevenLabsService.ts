// src/services/tts/ElevenLabsService.ts
import { TTSService } from "./TTSService";
import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
import { ELEVEN_LABS_MODEL_ID, ELEVEN_LABS_OUTPUT_FORMAT, ELEVEN_LABS_VOICE_ID } from "../../utils/constants";

export class ElevenLabsService implements TTSService { 
  private client: ElevenLabsClient;

  constructor() {
    this.client = new ElevenLabsClient();
  }

  async speak(text: string): Promise<void> {
    const audio = await this.client.textToSpeech.convert(
      ELEVEN_LABS_VOICE_ID,
      {
        text: text,
        modelId: ELEVEN_LABS_MODEL_ID,
        outputFormat: ELEVEN_LABS_OUTPUT_FORMAT,
      }
    );
    await play(audio);
    

   }
}