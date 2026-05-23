import { CarTelemetry, DrivingScenario } from "../../core/telemetry";
import { CarTelemetryService } from "./CarTelemetryService";
import {
  TELEMETRY_IDLE_SPEED_RANGE,
  TELEMETRY_CITY_SPEED_RANGE,
  TELEMETRY_HIGHWAY_SPEED_RANGE,
  TELEMETRY_FUEL_CONSUMPTION_IDLE,
  TELEMETRY_FUEL_CONSUMPTION_CITY,
  TELEMETRY_FUEL_CONSUMPTION_HIGHWAY,
  TELEMETRY_ENGINE_IDLE_TEMP,
  TELEMETRY_ENGINE_CITY_TEMP,
  TELEMETRY_ENGINE_HIGHWAY_TEMP,
  TELEMETRY_ENGINE_COOL_RATE,
  TELEMETRY_ENGINE_HEAT_RATE,
} from "../../utils/constants";

export class SimulationTelemetryService implements CarTelemetryService {
  private currentTelemetry: CarTelemetry;
  private scenario: DrivingScenario;

  constructor(initialScenario: DrivingScenario = "city") {
    this.scenario = initialScenario;
    this.currentTelemetry = this.initializeTelemetry();
  }

  private initializeTelemetry(): CarTelemetry {
    return {
      speed: 0,
      fuel: 75,
      engineTemp: 20,
      location: { lat: 37.7749, lng: -122.4194 }, // San Francisco
      odometer: 42000,
      timestamp: Date.now(),
    };
  }

  setScenario(scenario: DrivingScenario): void {
    this.scenario = scenario;
  }

  async getCurrentTelemetry(): Promise<CarTelemetry> {
    this.updateTelemetry();
    return { ...this.currentTelemetry };
  }

  private updateTelemetry(): void {
    const speedRange = this.getSpeedRange();
    const fuelConsumption = this.getFuelConsumption();
    const targetEngineTemp = this.getTargetEngineTemp();

    // Update speed with some variance
    const speedVariance = (Math.random() - 0.5) * 10;
    this.currentTelemetry.speed = Math.max(
      speedRange[0],
      Math.min(speedRange[1], this.currentTelemetry.speed + speedVariance)
    );

    // Update fuel (slight consumption per call)
    this.currentTelemetry.fuel = Math.max(
      0,
      this.currentTelemetry.fuel - fuelConsumption
    );

    // Update engine temperature towards target
    if (this.currentTelemetry.engineTemp < targetEngineTemp) {
      this.currentTelemetry.engineTemp += TELEMETRY_ENGINE_HEAT_RATE;
    } else if (this.currentTelemetry.engineTemp > targetEngineTemp) {
      this.currentTelemetry.engineTemp -= TELEMETRY_ENGINE_COOL_RATE;
    }

    // Update location slightly (simulate movement)
    if (this.currentTelemetry.speed > 0) {
      const speedKmh = this.currentTelemetry.speed * 1.60934;
      const metersPerSecond = speedKmh / 3.6;
      const metersPerUpdate = metersPerSecond * 0.01; // Assume ~0.01 second per update
      const degreesPerMeter = 1 / 111000; // Rough conversion

      this.currentTelemetry.location.lat +=
        (Math.random() - 0.5) * degreesPerMeter * metersPerUpdate * 10;
      this.currentTelemetry.location.lng +=
        (Math.random() - 0.5) * degreesPerMeter * metersPerUpdate * 10;

      // Update odometer
      this.currentTelemetry.odometer += metersPerUpdate / 1000;
    }

    this.currentTelemetry.timestamp = Date.now();
  }

  private getSpeedRange(): [number, number] {
    switch (this.scenario) {
      case "idle":
        return TELEMETRY_IDLE_SPEED_RANGE;
      case "city":
        return TELEMETRY_CITY_SPEED_RANGE;
      case "highway":
        return TELEMETRY_HIGHWAY_SPEED_RANGE;
    }
  }

  private getFuelConsumption(): number {
    switch (this.scenario) {
      case "idle":
        return TELEMETRY_FUEL_CONSUMPTION_IDLE;
      case "city":
        return TELEMETRY_FUEL_CONSUMPTION_CITY;
      case "highway":
        return TELEMETRY_FUEL_CONSUMPTION_HIGHWAY;
    }
  }

  private getTargetEngineTemp(): number {
    switch (this.scenario) {
      case "idle":
        return TELEMETRY_ENGINE_IDLE_TEMP;
      case "city":
        return TELEMETRY_ENGINE_CITY_TEMP;
      case "highway":
        return TELEMETRY_ENGINE_HIGHWAY_TEMP;
    }
  }
}
