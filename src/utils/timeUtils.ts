import { UserProfile } from "../core/profile";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
export type DayType = "weekday" | "weekend";

export const getTimeContext = (date = new Date()) => {
  const hour = date.getHours();
  const day = date.getDay();

  const timeOfDay: TimeOfDay =
    hour < 12 ? "morning" :
      hour < 17 ? "afternoon" :
        hour < 21 ? "evening" : "night";

  const dayType: DayType = day === 0 || day === 6 ? "weekend" : "weekday";

  return { timeOfDay, dayType };
}

export const getLikelyDestination = (profile: UserProfile) => {
  const { timeOfDay, dayType } = getTimeContext();

  const match = profile.habits.find(
    h => h.timeOfDay === timeOfDay && h.dayType === dayType
  );

  return match?.destination;
}