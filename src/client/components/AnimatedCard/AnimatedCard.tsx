/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Card } from '@/shared/Card';
import getCardId from '@/client/tools/getCardId';
import styles from './AnimatedCard.module.css';

export const SMALL_CARD = 100;
export const BIG_CARD = 140;

type AnimatedCardProps = {
  width: number;
  card?: Card | null;
  clickable?: boolean;
  pulse?: boolean;
  rgb?: boolean;
};

const AnimatedCard = (props: AnimatedCardProps) => {
  const {
    rgb, card, pulse, width, clickable,
  } = props;

  const cardId = useMemo(() => (card ? getCardId(card) : 'Cover'), [card]);

  const variants = useMemo<Variants>(() => ({
    tap: { scale: 1.1 },
    hover: { y: -35, scale: 1.2, cursor: 'pointer' },
  }), []);

  // Shared classes for both sides
  const cardClasses = clsx(
    'rounded-md outline outline-1 outline-black shadow-md bg-black absolute top-0 left-0',
    pulse && !rgb && styles.pulse,
    pulse && rgb && styles.pulseRgb,
  );

  return (
    <motion.div
      variants={variants}
      whileTap={clickable ? 'tap' : undefined}
      whileHover={clickable ? 'hover' : undefined}
      style={{
        width,
        height: 'auto',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* BACK SIDE (The "Cover") */}
      {cardId !== 'Cover' && (
        <img
          width={width}
          draggable={false}
          alt="Card Back"
          src="/images/cards/Cover.png" // Path to your card back image
          className={cardClasses}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)', // Faces the opposite way
            zIndex: 1,
          }}
        />
      )}

      {/* FRONT SIDE */}
      <img
        width={width}
        draggable={false}
        alt={`Card: ${cardId}`}
        src={`/images/cards/${cardId}.png`}
        className={cardClasses}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(0deg)', // Force it 1px "forward" to prevent flickering
          zIndex: 2,
        }}
      />

      {/* Spacer to maintain aspect ratio since children are absolute */}
      <div style={{ visibility: 'hidden' }}>
        <img width={width} src="/images/cards/Cover.png" alt="spacer" />
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
