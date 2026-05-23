import { UserProfile } from "../../core/profile";
import { getTimeContext } from "../../utils/timeUtils";

export class ProactiveService {
  shouldSuggestNavigation(profile: UserProfile): string | null {
    const { timeOfDay, dayType } = getTimeContext();

    const habit = profile.habits.find(
      h => h.timeOfDay === timeOfDay && h.dayType === dayType
    );

    return habit?.destination || null;
  }
}