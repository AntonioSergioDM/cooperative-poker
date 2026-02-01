import type { Card } from './Card';
import type { Chip } from './Chip';

export type Score = [number, number];

export type Table = [Card | null, Card | null, Card | null, Card | null, Card | null];

export type Hand = Array<Card>;

export type PlayerState = {
  index: number;
  hand: Hand;
  chip: Chip | null;
};

export type GameState = {
  hands: (Card | null)[][];
  chips: Chip[][];
  tableChips: Chip[];
  table: Table;
};

export const getPreviousPlayer = (idx: number) => {
  if (idx === 0) return 3;

  return idx - 1;
};

export const getNextPlayer = (idx: number) => {
  if (idx === 3) return 0;

  return idx + 1;
};

export enum PlayErrors {
  wrongRound = 'Not the chip from this round',
  holdingChip = 'You already have a chip for this round',
}
