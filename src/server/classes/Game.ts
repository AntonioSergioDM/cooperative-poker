import { Suit } from '@/shared/Card';
import { sameChip } from '@/shared/Chip';
import type { Chip } from '@/shared/Chip';
import type { Card } from '@/shared/Card';
import { DenounceErrors, PlayErrors } from '@/shared/GameTypes';
import type { GameState, Score, Table } from '@/shared/GameTypes';

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

    // reset chips
    this.chips = Array(numPlayers)
      .fill([0, 0, 0, 0]);

    // reset table
    this.resetTableChips('white');

    // reset cards
    this.shuffleAndDistribute();
  }

  stealChip(player: number, chip: Chip): PlayErrors | true {
    if (this.tableChips[0]?.color !== chip.color) {
      return true; // TODO not true
    }

    // Already has a chip
    if (this.chips[player].find((playerChip) => playerChip.color === chip.color)) {
      return true; // TODO not true
    }

    // Find the chip

    const inTableIdx = this.tableChips.findIndex((tableChip) => sameChip(tableChip, chip));
    // chip is in the table
    if (inTableIdx !== -1) {
      this.tableChips.splice(inTableIdx, 1);
      this.chips[player].push(this.tableChips.splice(inTableIdx, 1)[0]);
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

  play(player: number, card: Card, allowRenounce = false): PlayErrors | true {
    if (player !== this.currPlayer) {
      return PlayErrors.wrongTurn;
    }

    const { tableSuit } = this;
    let canAssist = false;
    let foundIdx = -1;

    this.decks[player].forEach((playerCard, cardIdx) => {
      if (playerCard.suit === tableSuit) {
        canAssist = true;
      }

      if ((card.value === playerCard.value) && (card.suit === playerCard.suit)) {
        foundIdx = cardIdx;
      }

      if (card.suit === this.trump && card.value === this.trumpCard?.value) {
        // We are playing the trump card... no more trump card
        this.trumpCard = null;
      }
    });

    if (foundIdx === -1) {
      return PlayErrors.invalidCard;
    }

    // First card of the round
    if (!this.tableSuit) {
      this.tableSuit = card.suit;
    }

    // One must always assist
    if ((card.suit !== this.tableSuit) && canAssist) {
      if (!allowRenounce) {
        return PlayErrors.mustAssist;
      }

      this.renounce[player] = true;
    }

    // From the hand to the table

    if (this.tableChips.findIndex((val) => val === null) !== -1) {
      // missing some cards on the table
      this.currPlayer = this.getNextPlayer();
    } else {
      // Everyone placed a card, let's see who wins
      this.currPlayer = -1;
    }
    return true;
  }

  getState(): GameState {
    return {
      trumpCard: this.trumpCard,
      tableChips: this.tableChips,
      table: this.table,
      currentPlayer: this.currPlayer,
      shufflePlayer: this.shufflePlayer,
      hands: this.decks.map((hand) => hand.length),
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
    this.tableChips = Array(Game.cardsPerPlayer)
      .fill(1)
      .map((_, value) => ({
        value,
        color,
        reverse: false,
      }));
  }

  isEnded() {
    return this.currPlayer === -1 && !this.decks[0].length;
  }

  denounce(playerIdx: number, denounceIdx: number): boolean | DenounceErrors {
    if (playerIdx % Game.numTeams === denounceIdx % Game.numTeams) {
      return DenounceErrors.sameTeam;
    }

    const score: Score = [0, 0];

    // You are wrong - Lose 1 Game and keep playing
    if (!this.renounce[denounceIdx]) {
      score[playerIdx % Game.numTeams] = 50;
      score[denounceIdx % Game.numTeams] = Game.maxPoints - 50;
      this.gameScore.push(score);
      return false;
    }

    // You are right - Win 4 Games
    this.roundScore = [0, 0];
    this.bandeira = playerIdx % Game.numTeams;
    this.roundScore[playerIdx % Game.numTeams] = Game.maxPoints;
    this.end();

    return true;
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
