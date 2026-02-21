export enum MessageType {
  join,
  leave,
  challenge,
  advantage,
  chipSteal,
  specialEffect,
  result,
  message,
  whisper,
  reminder,
}

export type Message = {
  type: MessageType;
  msg: string;
  timestamp?: number;
  from?: string;
  to?: string;
};
