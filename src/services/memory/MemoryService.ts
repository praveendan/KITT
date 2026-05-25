import fs from "fs";
import { MemoryState } from "../../core/memory";

export class MemoryService {
  private filePath = "memory.json";

  private isValidMemoryState(state: any): boolean {
    return state &&
      Array.isArray(state.shortTerm) &&
      typeof state.summary === 'string' &&
      state.shortTerm.every((msg: any) =>
        typeof msg.role === 'string' &&
        typeof msg.content === 'string'
      );
  }

  private getDefaultMemoryState(): MemoryState {
    return {
      shortTerm: [],
      summary: ""
    };
  }

  load(): MemoryState {
    if (!fs.existsSync(this.filePath)) {
      return { shortTerm: [], summary: "" };
    }

    const loadedState = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    return this.isValidMemoryState(loadedState) ? loadedState : this.getDefaultMemoryState();
  }

  save(state: MemoryState) {
    fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2));
  }
}