import { motion, type Variant } from 'framer-motion';

import type { Card } from '@/shared/Card';

import AnimatedCard, { SMALL_CARD } from '../AnimatedCard';

const toGraveyard = {
  x: 'calc(100vw + 50%)',
  y: 'calc(100vh + 50%)',
  rotate: 360,
  transition: {
    duration: 0.8,
  },
};

export type TableCardVariants = {
  fromHand: Variant;
  inTable: Variant;
};

type TableCardProps = {
  card: Card | null;
};

const TableCard = ({ card }: TableCardProps) => (
  <motion.div
    initial="fromHand"
    animate="inTable"
    exit={toGraveyard}
    className="select-none"
  >
    <AnimatedCard width={SMALL_CARD} card={card} />
  </motion.div>
);

export default TableCard;
