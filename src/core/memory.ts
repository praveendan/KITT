import { Message } from "./types";

export interface MemoryState {
  shortTerm: Message[];
  summary: string; // long-term compressed memory
}