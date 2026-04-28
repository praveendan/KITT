import fs from "fs";
import { Message } from "../../core/types";

export class MemoryService {
  private filePath = "memory.json";

  load(): Message[] {
    if (!fs.existsSync(this.filePath)) return [];

    const raw = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(raw);
  }

  save(messages: Message[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(messages, null, 2));
  }
}