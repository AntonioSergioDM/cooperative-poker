import type { Chip } from '@/shared/Chip';
import { useCallback } from 'react';

type TableCardProps = {
  chip: Chip;
  onClick: (chip: Chip) => void;
  key?: string;
};

const TableChip = (props: TableCardProps) => {
  const { chip, onClick, key } = props;

  const handleOnClick = useCallback(() => () => {
    onClick(chip);
  }, [onClick, chip]);

  const style = {
    backgroundColor: chip.color,
  };

  const style2 = {
    borderColor: chip.reverse ? chip.color : 'black',
    backgroundColor: chip.reverse ? 'black' : chip.color,
  };
  const style3 = {
    backgroundColor: chip.reverse ? 'black' : chip.color,
    borderColor: 'black',
    color: chip.reverse ? 'white' : 'black',
    fontWeight: chip.reverse ? 'normal' : 'bold',
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className="cursor-pointer rounded-full w-14 h-14 p-1" style={style} onClick={handleOnClick()} key={key}>
      <div className="rounded-full w-full h-full border-4 border-dashed" style={style2}>
        <div className="rounded-full w-full h-full flex justify-center items-center border-2 border-solid" style={style3}>
          <span>{chip.value}</span>
        </div>
      </div>
    </div>
  );
};

export default TableChip;
