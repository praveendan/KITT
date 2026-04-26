export type ActionType =
  | "PLAY_MUSIC"
  | "NAVIGATE"
  | "CALL_CONTACT"
  | "REPORT_STATUS"
  | "NONE";

export interface ActionPayloadMap {
  PLAY_MUSIC: { query: string };
  NAVIGATE: { destination: string };
  CALL_CONTACT: { name: string };
  REPORT_STATUS: {};
  NONE: {};
}

export interface Action<T extends ActionType = ActionType> {
  type: T;
  payload: ActionPayloadMap[T];
}

export interface AgentOutput {
  text: string;
  action?: Action;
}