import type { Chip } from '@/shared/Chip';
import { getChipColorCode } from '@/shared/Chip';
import { useCallback } from 'react';
import { motion } from 'framer-motion';

type TableCardProps = {
  chip: Chip;
  onClick: (chip: Chip) => void;
  /** Diameter in px. Defaults to the desktop size (48px = w-12). */
  size?: number;
  key?: string;
};

const TableChip = (props: TableCardProps) => {
  const {
    chip,
    onClick,
    size = 48,
    key,
  } = props;

  const handleOnClick = useCallback(() => () => {
    onClick(chip);
  }, [onClick, chip]);

  const color = getChipColorCode(chip);

  const style = {
    backgroundColor: color,
    width: size,
    height: size,
    padding: Math.max(2, Math.round(size * 0.08)),
    fontSize: Math.max(10, Math.round(size * 0.36)),
  };

  const style2 = {
    borderColor: chip.reverse ? color : 'black',
    backgroundColor: chip.reverse ? 'black' : color,
    borderWidth: Math.max(2, Math.round(size * 0.08)),
  };
  const style3 = {
    backgroundColor: chip.reverse ? 'black' : color,
    borderColor: 'black',
    color: chip.reverse ? 'white' : 'black',
    fontWeight: chip.reverse ? 'normal' : 'bold',
  };

  return (
    <motion.div
      className="relative cursor-pointer rounded-full z-10 touch-manipulation"
      style={style}
      onClick={handleOnClick()}
      key={key}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 1.15 }}
    >
      <div className="rounded-full w-full h-full border-dashed" style={style2}>
        <div className="rounded-full w-full h-full flex justify-center items-center border-2 border-solid leading-none" style={style3}>
          <span>{chip.value}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TableChip;
