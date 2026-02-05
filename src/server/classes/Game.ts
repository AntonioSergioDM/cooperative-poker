import type { Card } from '@/shared/Card';
import { getPokerCode, Suit } from '@/shared/Card';
import type { Chip } from '@/shared/Chip';
import { sameChip } from '@/shared/Chip';
import type {
  GameResults,
  GameState,
  GameStatus,
  Score,
  Table,
} from '@/shared/GameTypes';
import { PlayErrors } from '@/shared/GameTypes';
import { evaluate } from 'poker-utils/build/module/lib/evaluate';
import { boardToInts, iso } from 'poker-utils';
import { IN_DEV } from '@/globals';

const getRandom = (range: number) => Math.floor(Math.random() * range);

export default class Game {
  // Adjust this to 1 for a very fast game!
  static cardsPerPlayer = 2;

  static maxPlayers = 23;

  static minPlayers = 3;

  /** Number of players */
  numPlayers = 0;

  /** each 'deck' corresponds to a player hand */
  decks: Card[][] = [];

  chips: Chip[][] = [];

  /** Cards that will appear later */
  flop: Card[] = [];

  turn: Card | null = null;

  river: Card | null = null;

  tableChips: Chip[] = [];

  table: Table = [null, null, null, null, null];

  showHands = false;

  // TODO add the cards required for special effects

  /**
   * Totals
   * 0: losses; 1: Wins
   * */
  gameScore: Score = [0, 0];

  result: GameStatus = 'inProgress';

  start(numPlayers: number) {
    this.result = 'inProgress';
    this.numPlayers = numPlayers;

    // hide cards
    this.showHands = false;

    // reset chips
    this.chips = Array(numPlayers)
      .fill(1)
      .map(() => []);

    // reset table
    this.resetTableChips('white');

    // reset cards
    this.shuffleAndDistribute();
  }

  stealChip(player: number, chip: Chip): PlayErrors | true {
    if (this.tableChips[0]?.color !== chip.color) {
      return PlayErrors.wrongRound;
    }

    // Already has a chip - TODO make this a game option
    if (this.chips[player].find((playerChip) => playerChip.color === chip.color)) {
      // return PlayErrors.holdingChip;

      this.tableChips.push(this.chips[player].pop()!);
    }

    // Find the chip //

    const inTableIdx = this.tableChips.findIndex((tableChip) => sameChip(tableChip, chip));
    // chip is in the table
    if (inTableIdx !== -1) {
      this.chips[player].push(this.tableChips.splice(inTableIdx, 1)[0]);

      if (this.tableChips.length === 0) {
        this.nextPhase();
        return true;
      }

      return true;
    }

    const inHandIdx = this.chips.findIndex((playerChips) => (
      playerChips.find((playerChip) => playerChip && sameChip(playerChip, chip))
    ));

    // chip is in the possession of another player
    if (inHandIdx !== -1) {
      this.chips[player].push(this.chips[inHandIdx].pop()!);
      return true;
    }

    return PlayErrors.somethingWrong;
  }

  getState(): GameState {
    return {
      tableChips: this.tableChips,
      table: this.table,
      hands: this.showHands ? this.decks : this.decks.map((hand) => hand.map(() => null)),
      chips: this.chips,
    };
  }

  resetTableChips(color: Chip['color'] = 'white') {
    this.tableChips = Array(this.numPlayers)
      .fill(1)
      .map((_, value) => ({
        value: value + 1,
        color,
        reverse: false,
      }));
  }

  isEnded() {
    return this.showHands;
  }

  getResults(): GameResults {
    return {
      score: this.gameScore,
      round: this.result,
      table: this.table.filter((card) => !!card),
      players: this.decks.map((hand, index) => ({
        index,
        hand,
        chip: this.chips[index][this.chips[0].length - 1],
        ...(this.chips[index].length ? { rank: this.getPokerHands(hand) } : {}),
      })),
    };
  }

  // --------------- Private Methods --------------- //

  private shuffleAndDistribute() {
    const fullDeck = Game.getFullDeck();

    const getCard = () => fullDeck.splice(getRandom(fullDeck.length), 1)[0];

    this.decks = [];
    for (let i = 0; i < this.numPlayers; i++) {
      this.decks.push(Array(Game.cardsPerPlayer)
        .fill(1)
        .map(getCard));
    }

    this.table = [null, null, null, null, null];
    this.flop = [1, 1, 1].map(getCard);
    this.turn = getCard();
    this.river = getCard();
  }

  private nextPhase() {
    const cardsOnTable = this.table.reduce((count, card) => count + +!!card, 0);
    if (cardsOnTable < 3) {
      this.flop.forEach((card, idx) => {
        this.table[idx] = card;
      });

      this.resetTableChips('yellow');
      return;
    }

    if (cardsOnTable < 4) {
      this.table[3] = this.turn;
      this.resetTableChips('orange');
      return;
    }

    if (cardsOnTable < 5) {
      this.table[4] = this.river;
      this.resetTableChips('red');
      return;
    }

    this.end();
  }

  private end() {
    this.showHands = true;

    const hands = this.decks.map((deck) => this.getPokerHands(deck));

    const playerChoice = Array(this.numPlayers)
      .fill(1)
      .map((_, idx) => idx)
      .sort((playerA, playerB) => this.chips[playerB][this.chips[0].length - 1].value - this.chips[playerA][this.chips[0].length - 1].value);

    const compare = (playerA: number, playerB: number) => hands[playerB].value - hands[playerA].value;
    const playerOrder = Array(this.numPlayers)
      .fill(1)
      .map((_, idx) => idx)
      .sort(compare);

    if (IN_DEV) {
      console.info('hands:', hands);
      console.info('playerChoice:', playerChoice);
      console.info('playerOrder:', playerOrder);
    }

    const incorrectOrder = playerChoice.some((player, idx) => {
      if (player === playerOrder[idx]) {
        return false;
      }

      // in case of ties the order may be 'wrong'
      if (idx - 1 >= 0 && playerOrder[idx - 1] !== player && hands[playerOrder[idx - 1]].value === hands[player].value) {
        return false;
      }

      if (idx + 1 < this.numPlayers && playerOrder[idx + 1] !== player && hands[playerOrder[idx + 1]].value === hands[player].value) {
        return false;
      }

      return true;
    });

    if (incorrectOrder) {
      this.result = 'lose';
      this.gameScore[0]++;
      if (IN_DEV) {
        console.info('Lose - incorrect order');
      }

      return;
    }

    this.result = 'win';
    this.gameScore[1]++;
  }

  private getPokerHands(deck: Card[]) {
    const {
      board,
      hand,
    } = iso({
      board: boardToInts(
        this.table.filter((card) => !!card)
          .map(getPokerCode),
      ),
      hand: boardToInts(deck.map(getPokerCode)),
    });
    return evaluate([...board, ...hand]);
  }

  // -------------- Private Static Methods -------------- //

  // eslint-disable-next-line class-methods-use-this
  private static getFullDeck() {
    const fullDeck: Array<Card> = [];

    [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs].forEach((suit) => {
      let i: number = 13;
      while (i) {
        fullDeck.push({
          suit,
          value: i,
        });

        i--;
      }
    });

    return fullDeck;
  }
}
