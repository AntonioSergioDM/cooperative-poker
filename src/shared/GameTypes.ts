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
  numFigures?: number[];
  handValue?: number[];
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
  // Challenges
  noSwitching, // You can take from other players or the table only when you don't have a chip
  lowestReversed, // Lowest chips are reversed
  highestReversed, // Highest chips are reversed
  skipWhite, // Skip white chips
  skipYellow, // Skip yellow chips
  skipOrange, // Skip Orange chips
  noHistory, // No chip history
  lowestWhiteSwitch, // Switch hand if...
  highestWhiteSwitch, // Switch hand if...
  lowestYellowSwitch, // Switch hand if...
  highestYellowSwitch, // Switch hand if...
  lowestOrangeSwitch, // Switch hand if...
  highestOrangeSwitch, // Switch hand if...

  // guessHighRedRank, // Need to guess the rank of the higher red chip
  // guessHighRedCard, // Need to guess a card value of the higher red chip
  // extraCard, // Everyone has an extra card in their hand

  // This needs to be the last challenge on the enum
  randomChallenge,

  // Advantages
  allowRankTie,
  howManyFigures,
  handValue,

  // switchOneCard,
  // shareRank,
  // shareValue,
  // showOne,
  // redistribute,
  // passCard,
  // extraJack,

  // This needs to be the last advantage on the enum
  randomAdvantage,
}

// This needs to follow the Enum
export const getOptionDescription = (option: GameOption) => [
  // Challenges
  'Can steal, but not switch chips',
  'Lowest chips are reversed',
  'Highest chips are reversed',
  'Skip white chips',
  'Skip yellow chips',
  'Skip orange chips',
  'No chip history',
  'Switch lower hand if no figure on flop',
  'Switch higher hand if figure on flop',
  'Switch lower hand if no figure on turn',
  'Switch higher hand if figure on turn',
  'Switch lower hand if no figure on river',
  'Switch higher hand if figure on river',

  // 'Need to guess the rank of the higher red chip',
  // 'Need to guess one card value of the higher red chip',
  // 'Everyone has an extra card in their hand',

  'Random Challenge',

  // Advantages
  'Allow rank ties',
  'How many K, Q and J in hand',
  'Hand value (A, K, Q & J are 10 points)',

  // 'One player switches one card',
  // 'One player shares the current rank',
  // 'One player shares one card value',
  // 'One player shows one card to another',
  // 'Redistribute the dealt cards',
  // 'Give one card to the left player',
  // 'One player can get a J with no suit',

  'Random Advantage',
][option];
