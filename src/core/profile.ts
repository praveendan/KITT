export interface UserProfile {
  musicPreference?: string;
  frequentDestinations: string[];
  drivingStyle?: string;
}

export type ExtractedUserProfileFromInput = Omit<UserProfile, "frequentDestinations"> & {
  frequentDestination: string; // for easier extraction, we ask for one destination at a time
}
