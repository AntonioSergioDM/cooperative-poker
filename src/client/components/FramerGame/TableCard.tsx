import { motion, AnimatePresence } from 'framer-motion';
import type { Card } from '@/shared/Card';
import AnimatedCard, { SMALL_CARD } from '../AnimatedCard';

const flipVariants = {
  fromHand: {
    rotateY: 180,
    scale: 0.8,
  },
  inTable: {
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

type TableCardProps = {
  card: Card | null;
};

const TableCard = ({ card }: TableCardProps) => (
  // Perspective wrapper is key for 3D effects
  <div style={{ perspective: '1000px' }}>
    <AnimatePresence mode="wait">
      <motion.div
        key={card?.value || 'cover'} // Forces re-mount and animation when card changes
        variants={flipVariants}
        initial="fromHand"
        animate="inTable"
        whileHover={{
          scale: 1.1,
          zIndex: 10,
        }}
        className="select-none"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatedCard width={SMALL_CARD} card={card} />
      </motion.div>
    </AnimatePresence>
  </div>
  );

export default TableCard;
