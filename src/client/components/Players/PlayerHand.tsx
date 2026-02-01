import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Card } from '@/shared/Card';

import AnimatedCard from '../AnimatedCard';

import getCardFanVariants from './getCardFanVariants';

type PlayerHandProps = {
  isRgb?: boolean;
  cardWidth: number;
  isPlayer?: boolean;
  cards: (Card | null)[];
  isPlaying?: boolean;
  name: string;
  onClick?: (card: Card) => void;
};

const PlayerHand = (props: PlayerHandProps) => {
  const {
    cards,
    isRgb,
    cardWidth,
    isPlaying,
    isPlayer,
    onClick,
  } = props;

  const handleOnClick = useCallback((card: Card | null) => () => {
    if (isPlayer && isPlaying && card && onClick) onClick(card);
  }, [isPlayer, isPlaying, onClick]);

  return (
    <AnimatePresence>

      {cards.map((card, idx) => (
        <motion.div
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          initial="fromDeck"
          animate="inHand"
          variants={getCardFanVariants(idx, cards.length)}
          className="absolute bottom-0 select-none"
          onClick={(isPlayer && handleOnClick(card)) || undefined}
        >
          <AnimatedCard
            rgb={isRgb}
            pulse={isPlaying}
            width={cardWidth}
            card={card || null}
            clickable={isPlayer && isPlaying}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default PlayerHand;
