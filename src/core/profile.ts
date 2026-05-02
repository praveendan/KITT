import { DayType, TimeOfDay } from "../utils/timeUtils";

export interface Habit {
  destination: string;
  timeOfDay: TimeOfDay;
  dayType: DayType;
}

export interface UserProfile {
  habits: Habit[];
  drivingStyle?: string;
  musicPreference?: string;
  frequentDestinations: string[];
}

export interface ExtractedPreference {
  musicPreference?: { value: string; confidence: number };
  frequentDestination?: { value: string; confidence: number };
  drivingStyle?: { value: string; confidence: number };
}