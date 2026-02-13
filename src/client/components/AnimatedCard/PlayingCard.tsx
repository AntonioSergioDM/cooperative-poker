/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

import type { Card } from '@/shared/Card';
import getCardId from '@/client/tools/getCardId';

import styles from './AnimatedCard.module.css';

export const SMALL_CARD = 80;
export const BIG_CARD = 100;

type PlayingCardProps = {
  /** Card width in pixels */
  width: number;
  /** Card data (rank and suit). If null, shows card back */
  card?: Card | null;
  /** Whether the card is face up (showing front) */
  isFaceUp?: boolean;
  /** Whether the card is highlighted (selected, active, cooperative signal) */
  isHighlighted?: boolean;
  /** Whether the card is disabled (non-interactive) */
  isDisabled?: boolean;
  /** Whether the card is clickable (enables hover effects) */
  clickable?: boolean;
  /** Pulse animation (yellow glow) */
  pulse?: boolean;
  /** RGB pulse animation (multi-color glow) */
  rgb?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Deal animation trigger - change this value to re-trigger deal animation */
  dealTrigger?: number | string;
};

const PlayingCard = (props: PlayingCardProps) => {
  const {
    rgb,
    card,
    pulse,
    width,
    clickable,
    isFaceUp = true,
    isHighlighted = false,
    isDisabled = false,
    onClick,
    dealTrigger,
  } = props;

  const cardId = useMemo(() => (card ? getCardId(card) : 'Cover'), [card]);
  const height = useMemo(() => width * 1.4, [width]); // Standard playing card ratio

  // Deal animation - triggers when dealTrigger changes
  const dealAnimation = useMemo(() => ({
    initial: {
      scale: 0.8,
      x: 100,
      y: -50,
      opacity: 0,
    },
    animate: {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  }), []);

  // Flip animation - smooth 3D rotation
  const flipRotation = isFaceUp ? 0 : 180;

  return (
    <motion.div
      key={dealTrigger}
      initial={dealAnimation.initial}
      animate={dealAnimation.animate}
      className="relative select-none"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        perspective: '1000px',
      }}
      onClick={!isDisabled ? onClick : undefined}
    >
      {/* Card container with flip animation */}
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          cursor: (() => {
            if (isDisabled) return 'not-allowed';
            if (clickable) return 'pointer';
            return 'default';
          })(),
        }}
        animate={{
          rotateY: flipRotation,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        whileHover={
          clickable && !isDisabled ? {
            y: -8,
            scale: 1.05,
            transition: { duration: 0.2 },
          } : undefined
        }
        whileTap={
          clickable && !isDisabled ? {
            scale: 0.98,
            transition: { duration: 0.1 },
          } : undefined
        }
      >
        {/* Front face */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <img
            width={width}
            height={height}
            draggable={false}
            alt={`Card: ${cardId}`}
            src={`/images/cards/${cardId}.png`}
            className={clsx(
              'rounded-md outline outline-1 outline-black shadow-md bg-black w-full h-full object-cover',
              pulse && !rgb && styles.pulse,
              pulse && rgb && styles.pulseRgb,
              isHighlighted && !isDisabled && 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/50',
              isDisabled && 'opacity-50 grayscale',
            )}
          />
        </div>

        {/* Back face - rotated 180 degrees */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <img
            width={width}
            height={height}
            draggable={false}
            alt="Card back"
            src="/images/cards/Cover.png"
            className={clsx(
              'rounded-md outline outline-1 outline-black shadow-md bg-black w-full h-full object-cover',
              isDisabled && 'opacity-50 grayscale',
            )}
          />
        </div>
      </motion.div>

      {/* Highlight glow effect overlay */}
      {isHighlighted && !isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            boxShadow: '0 0 20px rgba(250, 204, 21, 0.6)',
          }}
        />
      )}
    </motion.div>
  );
};

export default PlayingCard;
