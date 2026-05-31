import { Message } from "../core/types"

export const ELEVEN_LABS_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb' // NOpBlnGInO9m6vDvFkFC - voice i need to use
export const ELEVEN_LABS_MODEL_ID = 'eleven_multilingual_v2'
export const ELEVEN_LABS_OUTPUT_FORMAT = 'mp3_44100_128'

export const MAX_SHORT_TERM_MEMORY = 15;
export const NUM_OF_SHORT_TERM_TO_SUMMARIZE = 5;

export const OPEN_API_MODAL = "gpt-4o-mini"

export const SYSTEM_PROMPT = `
You are KITT, intelligent in-car AI assistant inspired by Knight Rider.

Personality:
- Calm
- Intelligent
- Sarcastic
- witty
- Voice-friendly

Behavior:
- Prioritize driver safety
- Be proactive when helpful
You can control systems like music, navigation, and communication.
When appropriate, trigger actions instead of just describing them.
Act like a proactive driving assistant.`

export const SYSTEM_MESSAGES: Message[] = [{
  role: "system",
  content: `
Respond ONLY in valid JSON.

Format:
{
"text": string,
"action": {
"type": "PLAY_MUSIC" | "NAVIGATE" | "CALL_CONTACT" | "REPORT_STATUS" | "GET_CAR_STATUS" | "NONE",
"payload": object
}
}

Rules:
- If no action is needed, use "NONE"
- Keep text concise for speech
`
}];

export const conversationalTasks = {
  RESPOND_TO_USER: "Respond conversationally to the user.",
  GENERATE_PROACTIVE_MESSAGE: "Generate a brief proactive driving assistant message"
}

// Telemetry Simulation
export const TELEMETRY_IDLE_SPEED_RANGE: [number, number] = [0, 5];
export const TELEMETRY_CITY_SPEED_RANGE: [number, number] = [5, 35];
export const TELEMETRY_HIGHWAY_SPEED_RANGE: [number, number] = [40, 70];

export const TELEMETRY_FUEL_CONSUMPTION_IDLE = 60;
export const TELEMETRY_FUEL_CONSUMPTION_CITY = 60;
export const TELEMETRY_FUEL_CONSUMPTION_HIGHWAY = 60;

export const TELEMETRY_ENGINE_IDLE_TEMP = 60;
export const TELEMETRY_ENGINE_CITY_TEMP = 85;
export const TELEMETRY_ENGINE_HIGHWAY_TEMP = 95;

export const TELEMETRY_ENGINE_HEAT_RATE = 1;
export const TELEMETRY_ENGINE_COOL_RATE = 0.5;

// Preferences
export const CONFIDENCE_THRESHOLD = 0.8;
export const PREFERENCE_EXTRACTION_PROMPT = `
Extract user preferences from this message.

Return JSON:
{
  "musicPreference": { "value": string, "confidence": number } | null,
  "frequentDestination": { "value": string, "confidence": number } | null,
  "drivingStyle": { "value": string, "confidence": number } | null
}

Confidence rules:
- 0.9–1.0 = explicitly stated ("I love hip-hop")
- 0.7–0.9 = strong implication
- <0.7 = weak guess → ignore
`;
