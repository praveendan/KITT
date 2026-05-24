import { UserProfile } from "../../core/profile";
import { getTimeContext } from "../../utils/timeUtils";
import { CarTelemetry } from "../../core/telemetry";
import { MessageGenerator } from "./MessageGenerator";

export type ProactiveTrigger = "navigation" | "music" | "reminder" | "weather" | "status";

export interface ProactiveSuggestion {
  type: ProactiveTrigger;
  message: string;
  context?: any;
}

export class ProactiveService {
  getProactiveSuggestions(profile: UserProfile, telemetry?: CarTelemetry): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = [];
    const { timeOfDay, dayType } = getTimeContext();

    // Check for navigation based on habits
    const habit = profile.habits.find(
      h => h.timeOfDay === timeOfDay && h.dayType === dayType
    );

    if (habit?.destination) {
      suggestions.push({
        type: "navigation",
        message: MessageGenerator.generateNavigationSuggestion(habit.destination),
        context: { destination: habit.destination }
      });
    }

    // Check for music preferences at certain times
    if (profile.musicPreference && (timeOfDay === "morning" || timeOfDay === "evening")) {
      suggestions.push({
        type: "music",
        message: MessageGenerator.generateMusicSuggestion(profile.musicPreference),
        context: { genre: profile.musicPreference }
      });
    }

    // Proactive status check on highway/long drives
    if (telemetry && telemetry.speed > 50) {
      suggestions.push({
        type: "status",
        message: MessageGenerator.generateStatusUpdate(telemetry),
        context: { telemetry }
      });
    }

    // Low fuel warning
    if (telemetry && telemetry.fuel < 20) {
      suggestions.push({
        type: "reminder",
        message: MessageGenerator.generateLowFuelWarning(telemetry.fuel),
        context: { fuel: telemetry.fuel }
      });
    }

    return suggestions;
  }

  shouldSuggestNavigation(profile: UserProfile): string | null {
    const { timeOfDay, dayType } = getTimeContext();

    const habit = profile.habits.find(
      h => h.timeOfDay === timeOfDay && h.dayType === dayType
    );

    return habit?.destination || null;
  }
}
