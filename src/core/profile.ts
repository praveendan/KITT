export interface UserProfile {
  musicPreference?: string;
  frequentDestinations: string[];
  drivingStyle?: string;
}

export interface ExtractedPreference {
  musicPreference?: { value: string; confidence: number };
  frequentDestination?: { value: string; confidence: number };
  drivingStyle?: { value: string; confidence: number };
}