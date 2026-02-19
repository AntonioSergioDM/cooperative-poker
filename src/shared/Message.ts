export enum MessageType {
  join,
  leave,
  challenge,
  advantage,
  chipSteal,
  chipSwitch,
  cardsAdded,
  specialEffect,
  result,
  message,
  whisper,
  reminder,
}

export type Message = {
  type: MessageType;
  timestamp: number;
  msg: string;
  from: 'System' | string;
  to?: string;
};
