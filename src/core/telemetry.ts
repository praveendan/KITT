export interface CarTelemetry {
  speed: number;
  fuel: number;
  engineTemp: number;
  batteryLevel?: number;
  location: { lat: number; lng: number };
  odometer: number;
  timestamp: number;
}

export type DrivingScenario = 'idle' | 'city' | 'highway';
