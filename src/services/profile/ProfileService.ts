import fs from "fs";
import { UserProfile } from "../../core/profile";

export class ProfileService {
  private filePath = "profile.json";

  load(): UserProfile {
    if (!fs.existsSync(this.filePath)) {
      return { habits: [], frequentDestinations: [] };
    }

    return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  save(profile: UserProfile) {
    fs.writeFileSync(this.filePath, JSON.stringify(profile, null, 2));
  }
}