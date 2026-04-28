import fs from "fs";
import { MemoryState } from "../../core/memory";

export class MemoryService {
  private filePath = "memory.json";

  load(): MemoryState {
    if (!fs.existsSync(this.filePath)) {
      return { shortTerm: [], summary: "" };
    }

    return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
  }

  save(state: MemoryState) {
    fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2));
  }
}