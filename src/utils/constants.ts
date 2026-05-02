import { Message } from "../core/types"

export const ELEVEN_LABS_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb' // NOpBlnGInO9m6vDvFkFC - voice i need to use
export const ELEVEN_LABS_MODEL_ID = 'eleven_multilingual_v2'
export const ELEVEN_LABS_OUTPUT_FORMAT = 'mp3_44100_128'

export const MAX_SHORT_TERM_MEMORY = 15;
export const NUM_OF_SHORT_TERM_TO_SUMMARIZE = 5;

export const OPEN_API_MODAL = "gpt-4o-mini"
export const SYSTEM_PROMPT = `
You are an in-car AI assistant like KITT from Knight Rider.
You are calm, intelligent, slightly witty.
Keep responses short and voice-friendly. You can control systems like music, navigation, and communication.
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
"type": "PLAY_MUSIC" | "NAVIGATE" | "CALL_CONTACT" | "REPORT_STATUS" | "NONE",
"payload": object
}
}

Rules:
- If no action is needed, use "NONE"
- Keep text concise for speech
`
}];

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
