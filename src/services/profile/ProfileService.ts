import fs from "fs";
import { UserProfile } from "../../core/profile";

export class ProfileService {
  private filePath = "profile.json";

  private isValidProfile(profile: any): boolean {
    return profile &&
      Array.isArray(profile.habits) &&
      Array.isArray(profile.frequentDestinations) &&
      profile.habits.every((habit: any) =>
        typeof habit.destination === 'string' &&
        typeof habit.timeOfDay === 'string' &&
        typeof habit.dayType === 'string'
      );
  }

  private getDefaultProfile(): UserProfile {
    return {
      habits: [],
      frequentDestinations: []
    };
  }

  load(): UserProfile {
    if (!fs.existsSync(this.filePath)) {
      return { habits: [], frequentDestinations: [] };
    }

    const loadedProfile = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    return this.isValidProfile(loadedProfile) ? loadedProfile : this.getDefaultProfile();
  }

  save(profile: UserProfile) {
    fs.writeFileSync(this.filePath, JSON.stringify(profile, null, 2));
  }
}