// src/services/stt/STTService.ts
import { STTResult } from "../../core/types";

export interface STTService {
  transcribe(filePath: string): Promise<STTResult>;
}