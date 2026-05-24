import { CarTelemetry } from "../../core/telemetry";
import { UserProfile } from "../../core/profile";

export class MessageGenerator {
  private static pickRandom<T>(items: T[]): T {
    if (items.length === 0) throw new Error("Cannot pick from empty array");
    return items[Math.floor(Math.random() * items.length)]!;
  }

  static generateLowFuelWarning(fuel: number): string {
    return `Fuel is running low at ${fuel.toFixed(0)}%`;
  }

  static generateStatusUpdate(telemetry: CarTelemetry): string {
    return `Speed: ${telemetry.speed.toFixed(0)} mph. Fuel: ${telemetry.fuel.toFixed(0)}%. Engine temp at ${telemetry.engineTemp.toFixed(0)}.`
  }

  static generateNavigationSuggestion(destination: string): string {
    return `Based on your schedule, shall I navigate to ${destination}?`;
  }

  static generateMusicSuggestion(genre: string): string {
    return `How about some ${genre} music`;
  }

  static generateRandomChatter(): string {
    const messages = [
      "All systems running smoothly. Ready for whatever you need.",
      "Traffic looks clear ahead. We're in good shape.",
      "Everything's working perfectly. You're in capable hands.",
      "Systems check complete. All green.",
      "Just making sure everything's running optimally.",
      "The roads are treating us well today.",
      "Ready to assist whenever you need me.",
    ];
    return this.pickRandom(messages);
  }
}
