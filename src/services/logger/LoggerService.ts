import fs from "fs";
import path from "path";
import { Logger, LogEntry, LogLevel } from "../../core/logger";

export class LoggerService implements Logger {
  private logFilePath: string;
  private readonly logsDir = "logs";

  constructor(filename: string = "app.log") {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
    this.logFilePath = path.join(this.logsDir, filename);
  }

  private formatEntry(entry: LogEntry): string {
    const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : "";
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}${dataStr}`;
  }

  private writeLog(level: LogLevel, module: string, message: string, data?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data
    };

    const formatted = this.formatEntry(entry);
    console.log(formatted);

    try {
      fs.appendFileSync(this.logFilePath, formatted + "\n");
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  }

  debug(module: string, message: string, data?: Record<string, any>): void {
    this.writeLog("debug", module, message, data);
  }

  info(module: string, message: string, data?: Record<string, any>): void {
    this.writeLog("info", module, message, data);
  }

  warn(module: string, message: string, data?: Record<string, any>): void {
    this.writeLog("warn", module, message, data);
  }

  error(module: string, message: string, data?: Record<string, any>): void {
    this.writeLog("error", module, message, data);
  }
}
