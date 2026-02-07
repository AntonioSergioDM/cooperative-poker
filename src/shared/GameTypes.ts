import type { EvaluatedHand } from 'poker-utils';
import type { Card } from './Card';
import type { Chip } from './Chip';

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
  options: GameOption[];
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
  reversedChip = 'Reversed chips cannot be exchanged',
  somethingWrong = 'Something went wrong',
}

export enum GameOption {
  noSwitching, // You can take from other players or the table only when you don't have a chip
  lowestReversed, // Lowest chips are reversed
  highestReversed, // Highest chips are reversed
  skipWhite, // Skip white chips
  skipYellow, // Skip yellow chips
  skipOrange, // Skip Orange chips
  noHistory, // No chip history
  lowestWhiteSwitch, // Switch hand if...
  highestWhiteSwitch, // Switch hand if...
  // guessHighRedRank, // Need to guess the rank of the higher red chip
  // guessHighRedCard, // Need to guess a card value of the higher red chip
  // extraCard, // Everyone has an extra card in their hand
}

export const getOptionDescription = (option: GameOption) => [
  "You can take from other players or the table only when you don't have a chip",
  'Lowest chips are reversed',
  'Highest chips are reversed',
  'Skip white chips',
  'Skip yellow chips',
  'Skip orange chips',
  'No chip history',
  'Switch lower hand if no figure on flop',
  'Switch higher hand if figure on flop',
  'Need to guess the rank of the higher red chip',
  'Need to guess a card value of the higher red chip',
  'Everyone has an extra card in their hand',
][option];
