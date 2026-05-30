export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: Record<string, any> | undefined;
}

export interface Logger {
  debug(module: string, message: string, data?: Record<string, any>): void;
  info(module: string, message: string, data?: Record<string, any>): void;
  warn(module: string, message: string, data?: Record<string, any>): void;
  error(module: string, message: string, data?: Record<string, any>): void;
}
