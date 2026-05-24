import { UserProfile } from "../../core/profile";
import { CarTelemetry } from "../../core/telemetry";
import { SYSTEM_PROMPT } from "../../utils/constants";

export class PromptBuilder {
  static buildBasePrompt(): string {
    return SYSTEM_PROMPT;
  }

  static buildContextPrompt(params: {
    summary?: string;
    profile?: UserProfile;
    telemetry?: CarTelemetry;
    likelyDestination?: string | undefined;
  }): string {
    return `
Summary of past interactions:
${params.summary || "None"}

User profile:
${JSON.stringify(params.profile || {}, null, 2)}

Current vehicle telemetry:
${JSON.stringify(params.telemetry || {}, null, 2)}

Likely destination:
${params.likelyDestination || "unknown"}
`;
  }
}