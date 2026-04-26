import { Action, ActionPayloadMap } from "../../core/actions";

export class ActionExecutor {
  async execute(action?: Action): Promise<void> {
    if (!action || action.type === "NONE") return;

    switch (action.type) {
      case "PLAY_MUSIC":
        console.log("🎵 Playing:", (action.payload as ActionPayloadMap['PLAY_MUSIC']).query );
        break;

      case "NAVIGATE":
        console.log("🗺 Navigating to:", (action.payload as ActionPayloadMap['NAVIGATE']).destination);
        break;

      case "CALL_CONTACT":
        console.log("📞 Calling:", (action.payload as ActionPayloadMap['CALL_CONTACT']).name);
        break;

      case "REPORT_STATUS":
        console.log("🚗 Reporting car status...");
        break;

      default:
        console.warn("Unknown action:", action);
    }
  }
}