import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";
import { AgentOutput } from "../core/actions";
import { CONFIDENCE_THRESHOLD, MAX_SHORT_TERM_MEMORY, NUM_OF_SHORT_TERM_TO_SUMMARIZE } from "../utils/constants";
import { MemoryService } from "../services/memory/MemoryService";
import { SummarizerService } from "../services/memory/SummarizerService";
import { MemoryState } from "../core/memory";
import { PreferenceExtractor } from "../services/profile/PreferenceExtractor";
import { ProfileService } from "../services/profile/ProfileService";
import { UserProfile } from "../core/profile";
import { getLikelyDestination, getTimeContext } from "../utils/timeUtils";
import { CarTelemetryService } from "../services/telemetry/CarTelemetryService";
import { ProactiveSuggestion } from "../services/engines/ProactiveService";
import { PromptBuilder } from "../services/prompts/PromptBuilder";

export class KittAgent {
  private state: MemoryState;
  private profile: UserProfile;

  getProfile(): UserProfile {
    return this.profile;
  }

  constructor(
    private ai: AIService,
    private memory: MemoryService,
    private summarizer: SummarizerService,
    private profileService: ProfileService,
    private preferenceExtractor: PreferenceExtractor,
    private telemetry: CarTelemetryService,
  ) {
    this.state = this.memory.load();
    this.profile = this.profileService.load();
  }

  async handleUserInput(input: string): Promise<AgentOutput> {
    const { timeOfDay, dayType } = getTimeContext();
    const likelyDestination = getLikelyDestination(this.profile);
    const carTelemetry = await this.telemetry.getCurrentTelemetry();

    this.state.shortTerm.push({ role: "user", content: input });

    // extract preferences from user input and update profile
    const extractedPrefs = await this.preferenceExtractor.extract(input);

    if (
      extractedPrefs.musicPreference &&
      extractedPrefs.musicPreference.confidence >= CONFIDENCE_THRESHOLD
    ) {
      this.profile.musicPreference = extractedPrefs.musicPreference.value;
    }

    if (
      extractedPrefs.frequentDestination &&
      extractedPrefs.frequentDestination.confidence >= CONFIDENCE_THRESHOLD
    ) {
      if (
        !this.profile.frequentDestinations.includes(
          extractedPrefs.frequentDestination.value
        )
      ) {
        this.profile.frequentDestinations.push(
          extractedPrefs.frequentDestination.value
        );
        this.profile.habits.push({
          destination: extractedPrefs.frequentDestination.value,
          timeOfDay,
          dayType
        });
      }
    }

    this.profileService.save(this.profile);
    // Extraction ends here

    const contextMessages: Message[] = [
      {
        role: "system",
        content: `
        ${PromptBuilder.buildBasePrompt()}
        ${PromptBuilder.buildContextPrompt({
          summary: this.state.summary,
          profile: this.profile,
          telemetry: carTelemetry,
          likelyDestination
        })}
        Task: Respond conversationally to the user.
        `
      },
      ...this.state.shortTerm
    ];

    const response = await this.ai.generateResponse({
      messages: contextMessages
    });

    this.state.shortTerm.push({
      role: "assistant",
      content: response.text
    });

    // summarize if too long
    if (this.state.shortTerm.length > MAX_SHORT_TERM_MEMORY) {
      const toSummarize = this.state.shortTerm.slice(0, NUM_OF_SHORT_TERM_TO_SUMMARIZE);

      this.state.summary = await this.summarizer.summarize(
        toSummarize,
        this.state.summary
      );

      this.state.shortTerm = this.state.shortTerm.slice(NUM_OF_SHORT_TERM_TO_SUMMARIZE);
    }

    this.memory.save(this.state);

    return response;
  }

  async generateProactiveMessage(suggestion: ProactiveSuggestion): Promise<string> {
    const likelyDestination = getLikelyDestination(this.profile);
    const carTelemetry = await this.telemetry.getCurrentTelemetry();

    const systemPrompt = `
    ${PromptBuilder.buildBasePrompt()}
    ${PromptBuilder.buildContextPrompt({
      profile: this.profile,
      telemetry: carTelemetry,
      likelyDestination
    })}
    `;

    const response = await this.ai.generateResponse({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate a proactive message for this suggestion: ${JSON.stringify(suggestion)}`
        }
      ]
    });

    return response.text.trim();
  }
}