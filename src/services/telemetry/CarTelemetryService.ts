import { CarTelemetry } from "../../core/telemetry";

export interface CarTelemetryService {
  getCurrentTelemetry(): Promise<CarTelemetry>;
}
