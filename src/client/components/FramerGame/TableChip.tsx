import type { Chip } from '@/shared/Chip';
import { getChipColorCode } from '@/shared/Chip';
import { useCallback } from 'react';
import { motion } from 'framer-motion';

type TableCardProps = {
  chip: Chip;
  onClick: (chip: Chip) => void;
  key?: string;
};

const TableChip = (props: TableCardProps) => {
  const {
    chip,
    onClick,
    key,
  } = props;

  const handleOnClick = useCallback(() => () => {
    onClick(chip);
  }, [onClick, chip]);

  const color = getChipColorCode(chip);

  const style = {
    backgroundColor: color,
  };

  const style2 = {
    borderColor: chip.reverse ? color : 'black',
    backgroundColor: chip.reverse ? 'black' : color,
  };
  const style3 = {
    backgroundColor: chip.reverse ? 'black' : color,
    borderColor: 'black',
    color: chip.reverse ? 'white' : 'black',
    fontWeight: chip.reverse ? 'normal' : 'bold',
  };

  return (
    <motion.div
      className="cursor-pointer rounded-full w-12 h-12 p-1 z-10"
      style={style}
      onClick={handleOnClick()}
      key={key}
      whileHover={{ scale: 1.2 }}
    >
      <div className="rounded-full w-full h-full border-4 border-dashed" style={style2}>
        <div className="rounded-full w-full h-full flex justify-center items-center border-2 border-solid" style={style3}>
          <span>{chip.value}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TableChip;
