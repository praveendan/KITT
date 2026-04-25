// src/services/tts/ElevenLabsService.ts
import { TTSService } from "./TTSService";
import fetch from "node-fetch";
import fs from "fs";
import { exec } from "child_process";
import { config } from "../../core/config";

export class ElevenLabsService implements TTSService {
  async speak(text: string): Promise<void> {
    const res = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/NOpBlnGInO9m6vDvFkFC",
      {
        method: "POST",
        headers: {
          "xi-api-key": config.elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync("output.mp3", buffer);

    exec("afplay output.mp3"); // macOS
  }
}