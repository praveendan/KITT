import { AIService } from "../services/ai/AIService";
import { Message } from "../core/types";
import { AgentOutput } from "../core/actions";
import { CONFIDENCE_THRESHOLD, conversationalTasks, MAX_SHORT_TERM_MEMORY, NUM_OF_SHORT_TERM_TO_SUMMARIZE } from "../utils/constants";
import { MemoryService } from "../services/memory/MemoryService";
import { SummarizerService } from "../services/memory/SummarizerService";
import { MemoryState } from "../core/memory";
import { PreferenceExtractor } from "../services/profile/PreferenceExtractor";
import { ProfileService } from "../services/profile/ProfileService";
import { UserProfile } from "../core/profile";
import { getLikelyDestination, getTimeContext } from "../utils/timeUtils";
import { CarTelemetryService } from "../services/telemetry/CarTelemetryService";
import { CarTelemetry } from "../core/telemetry";
import { ProactiveSuggestion } from "../services/engines/ProactiveService";
import { PromptBuilder } from "../services/prompts/PromptBuilder";
import { Logger } from "../core/logger";

export class KittAgent {
  private state: MemoryState;
  private profile: UserProfile;
  private cachedTelemetry: CarTelemetry | null = null;
  private lastTelemetryFetchTime: number = 0;
  private readonly TELEMETRY_CACHE_MS = 200;

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
    private logger: Logger,
  ) {
    this.state = this.memory.load();
    this.profile = this.profileService.load();
    this.logger.info("KittAgent", "Agent initialized", {
      memorySize: this.state.shortTerm.length,
      destinations: this.profile.frequentDestinations.length
    });
  }

  private updateProfileIfChanged(
    extractedPrefs: Awaited<ReturnType<typeof this.preferenceExtractor.extract>>,
    timeOfDay: ReturnType<typeof getTimeContext>["timeOfDay"],
    dayType: ReturnType<typeof getTimeContext>["dayType"]
  ): boolean {
    let changed = false;

    if (
      extractedPrefs.musicPreference &&
      extractedPrefs.musicPreference.confidence >= CONFIDENCE_THRESHOLD &&
      this.profile.musicPreference !== extractedPrefs.musicPreference.value
    ) {
      this.profile.musicPreference = extractedPrefs.musicPreference.value;
      changed = true;
    }

    if (
      extractedPrefs.frequentDestination &&
      extractedPrefs.frequentDestination.confidence >= CONFIDENCE_THRESHOLD &&
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
      changed = true;
    }

    return changed;
  }

  private async getCachedTelemetry(): Promise<CarTelemetry> {
    const now = Date.now();
    if (this.cachedTelemetry && now - this.lastTelemetryFetchTime < this.TELEMETRY_CACHE_MS) {
      return this.cachedTelemetry;
    }
    this.cachedTelemetry = await this.telemetry.getCurrentTelemetry();
    this.lastTelemetryFetchTime = now;
    return this.cachedTelemetry;
  }

  async handleUserInput(input: string): Promise<AgentOutput> {
    this.logger.debug("KittAgent", "Processing user input", { inputLength: input.length });

    const { timeOfDay, dayType } = getTimeContext();
    const likelyDestination = getLikelyDestination(this.profile);
    const carTelemetry = await this.getCachedTelemetry();

    this.state.shortTerm.push({ role: "user", content: input });

    const extractedPrefs = await this.preferenceExtractor.extract(input);
    const profileChanged = this.updateProfileIfChanged(extractedPrefs, timeOfDay, dayType);

    if (profileChanged) {
      this.profileService.save(this.profile);
      this.logger.info("KittAgent", "User profile updated", {
        musicPreference: extractedPrefs.musicPreference?.value,
        newDestination: extractedPrefs.frequentDestination?.value
      });
    }

    const contextMessages: Message[] = [
      {
        role: "system",
        content: [
          PromptBuilder.buildBasePrompt(),
          PromptBuilder.buildContextPrompt({
            summary: this.state.summary,
            profile: this.profile,
            telemetry: carTelemetry,
            likelyDestination
          }),
          `Task: ${conversationalTasks.RESPOND_TO_USER}`
        ].join("\n")
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
      this.logger.info("KittAgent", "Summarizing short-term memory", {
        beforeLength: this.state.shortTerm.length,
        summarizing: NUM_OF_SHORT_TERM_TO_SUMMARIZE
      });

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
    this.logger.debug("KittAgent", "Generating proactive message", { type: suggestion.type });

    const likelyDestination = getLikelyDestination(this.profile);
    const carTelemetry = await this.getCachedTelemetry();

    const systemPrompt = [
      PromptBuilder.buildBasePrompt(),
      PromptBuilder.buildContextPrompt({
        profile: this.profile,
        telemetry: carTelemetry,
        likelyDestination
      }),
      `Task: ${conversationalTasks.GENERATE_PROACTIVE_MESSAGE}`
    ].join("\n");

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

    this.logger.info("KittAgent", "Proactive message generated", { type: suggestion.type });
    return response.text.trim();
  }
}