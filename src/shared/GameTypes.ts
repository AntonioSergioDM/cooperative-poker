import type { Card } from './Card';
import type { Chip } from './Chip';
import { EvaluatedHand } from 'poker-utils';

export type Score = [number, number];

export type Table = [Card | null, Card | null, Card | null, Card | null, Card | null];

export type Hand = Array<Card>;

export type PlayerState = {
  index: number;
  hand: Hand;
  chip: Chip | null;
  rank?: EvaluatedHand;
};

export type GameStatus = 'win' | 'lose' | 'inProgress';

export type GameState = {
  hands: (Card | null)[][];
  chips: Chip[][];
  tableChips: Chip[];
  table: Table;
};

export type GameResults = {
  score: Score;
  round: GameStatus;
  table: Card[];
  players: PlayerState[];
};

export enum PlayErrors {
  wrongRound = 'Not the chip from this round',
  holdingChip = 'You already have a chip for this round', // commented in code
  somethingWrong = 'Something went wrong',
}
