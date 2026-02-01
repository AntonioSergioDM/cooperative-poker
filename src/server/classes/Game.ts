import type { Card } from '@/shared/Card';
import { Suit } from '@/shared/Card';
import type { Chip } from '@/shared/Chip';
import { sameChip } from '@/shared/Chip';
import type { GameState, Score, Table } from '@/shared/GameTypes';
import { PlayErrors } from '@/shared/GameTypes';

const getRandom = (range: number) => Math.floor(Math.random() * range);

export default class Game {
  // Adjust this to 1 for a very fast game!
  static cardsPerPlayer = 2;

  static maxPlayers = 23;

  static minPlayers = 3;

  static numTeams = 0;

  static maxPoints = 120; // +1 if the team wins all turns

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

  /** [even team, odd team] */
  roundScore: Score = [0, 0];

  gameScore: Score[] = [];

  /** stars as -1, switches to winnning team idx, until another teams wins an hand. Then it becomes numTeams */
  bandeira = -1;

  /** renounce */
  renounce: boolean[] = [false, false];

  trump: Suit | `${Suit}` | null = null;

  trumpCard: Card | null = null;

  shufflePlayer: number = 0;

  currPlayer: number = -1;

  /** each Card is related by id to the player */

  tableSuit: Suit | `${Suit}` | null = null;

  start(numPlayers: number) {
    this.numPlayers = numPlayers;

    // hide cards
    this.showHands = false;

    // reset chips
    this.chips = Array(numPlayers)
      .fill(1).map(() => []);

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
        return this.nextPhase() || true; // TODO not true
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

    return true; // TODO not true
  }

  getState(): GameState {
    return {
      tableChips: this.tableChips,
      table: this.table,
      hands: this.showHands ? this.decks : this.decks.map((hand) => hand.map(() => null)),
      chips: this.chips,
    };
  }

  clearTable() {
    const winnerTeam = 1;

    if (this.bandeira === -1) {
      this.bandeira = winnerTeam;
    } else if (this.bandeira !== winnerTeam) {
      this.bandeira = Game.numTeams;
    }

    // Reset the table
    this.resetTableChips();

    if (!this.decks[0].length) {
      this.end();
    }
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

  private nextPhase(): boolean {
    const cardsOnTable = this.table.reduce((count, card) => count + +!!card, 0);
    if (cardsOnTable < 3) {
      this.flop.forEach((card, idx) => {
        this.table[idx] = card;
      });

      this.resetTableChips('yellow');
      return true;
    }

    if (cardsOnTable < 4) {
      this.table[3] = this.turn;
      this.resetTableChips('orange');
      return true;
    }

    if (cardsOnTable < 5) {
      this.table[4] = this.river;
      this.resetTableChips('red');
      return true;
    }

    this.showHands = true;

    // TODO deal with endgame (probably should call end() and let the lobby show the results and eventually up/down the difficulty)

    return false;
  }

  private getNextPlayer(player = this.currPlayer) {
    if (player === this.numPlayers - 1) {
      return 0;
    }

    return player + 1;
  }

  private isBiggerThan(card1: Card, card2: Card): boolean {
    if (card1.suit === card2.suit) {
      return card1.value > card2.value;
    }

    if (card1.suit === this.trump) {
      return true;
    }

    if (card1.suit === this.tableSuit && card2.suit !== this.trump) {
      return true;
    }

    return false;
  }

  private end() {
    // end game no one can play
    this.currPlayer = -1;
    // all cards go away
    this.decks = [[], [], [], []];
    // The table is cleaned
    this.resetTableChips();

    // Check for "bandeira"
    let i = 0;
    while (i < Game.numTeams) {
      if (this.roundScore[i] === Game.maxPoints && this.bandeira === i) {
        this.roundScore[i]++;
      }
      i++;
    }

    this.gameScore.push(this.roundScore);
    this.shufflePlayer = this.getNextPlayer(this.shufflePlayer);
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
