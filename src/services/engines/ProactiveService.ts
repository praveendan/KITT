import { UserProfile } from "../../core/profile";
import { getTimeContext } from "../../utils/timeUtils";
import { CarTelemetry } from "../../core/telemetry";

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
        message: `Want me to navigate to ${habit.destination}? Based on your usual routine at this time.`,
        context: { destination: habit.destination }
      });
    }

    // Check for music preferences at certain times
    if (profile.musicPreference && (timeOfDay === "morning" || timeOfDay === "evening")) {
      suggestions.push({
        type: "music",
        message: `I could play some ${profile.musicPreference} music for you.`,
        context: { genre: profile.musicPreference }
      });
    }

    // Proactive status check on highway/long drives
    if (telemetry && telemetry.speed > 50) {
      suggestions.push({
        type: "status",
        message: `You're cruising at ${telemetry.speed.toFixed(0)} mph. Fuel is at ${telemetry.fuel.toFixed(0)}%, engine running smoothly at ${telemetry.engineTemp.toFixed(0)}°C.`,
        context: { telemetry }
      });
    }

    // Low fuel warning
    if (telemetry && telemetry.fuel < 20) {
      suggestions.push({
        type: "reminder",
        message: `⚠️ Fuel is running low at ${telemetry.fuel.toFixed(0)}%. You might want to refuel soon.`,
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