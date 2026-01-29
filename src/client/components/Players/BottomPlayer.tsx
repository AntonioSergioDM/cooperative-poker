/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';

import type { Card } from '@/shared/Card';
import { BIG_CARD } from '@/client/components/AnimatedCard';

import PlayerHand from './PlayerHand';

type PlayerProps = {
  cards: Card[];
  isRgb?: boolean;
  isPlaying?: boolean;
  name: string;
};

const Player = (props: PlayerProps) => {
  const {
    cards,
    isRgb,
    isPlaying,
    name,
  } = props;

  const cardsInHand = useMemo(() => {
    if (!cards.length) return []; // or the only card available to this player is the trump card
    return cards;
  }, [cards]);

  return (
    <div className="fixed bottom-0 left-1/2 flex row justify-center">
      <PlayerHand
        isPlayer
        isRgb={isRgb}
        cards={cardsInHand}
        cardWidth={BIG_CARD}
        isPlaying={isPlaying}
        name={name}
      />
    </div>
  );
};

export default Player;
