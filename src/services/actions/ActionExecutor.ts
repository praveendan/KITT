import { Action, ActionPayloadMap } from "../../core/actions";
import { CarTelemetryService } from "../telemetry/CarTelemetryService";

export class ActionExecutor {
  constructor(private telemetry?: CarTelemetryService) {}

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

      case "GET_CAR_STATUS":
        if (this.telemetry) {
          const telemetry = await this.telemetry.getCurrentTelemetry();
          const detail = (action.payload as ActionPayloadMap['GET_CAR_STATUS']).detail;

          if (detail === 'quick') {
            console.log(`🚗 Speed: ${telemetry.speed.toFixed(1)} mph | Fuel: ${telemetry.fuel.toFixed(1)}% | Temp: ${telemetry.engineTemp.toFixed(1)}°C`);
          } else {
            console.log("🚗 Detailed Car Status:");
            console.log(`  Speed: ${telemetry.speed.toFixed(1)} mph`);
            console.log(`  Fuel: ${telemetry.fuel.toFixed(1)}%`);
            console.log(`  Engine Temp: ${telemetry.engineTemp.toFixed(1)}°C`);
            console.log(`  Location: ${telemetry.location.lat.toFixed(4)}, ${telemetry.location.lng.toFixed(4)}`);
            console.log(`  Odometer: ${telemetry.odometer.toFixed(1)} km`);
          }
        }
        break;

      default:
        console.warn("Unknown action:", action);
    }
  }
}