export type Chip = {
  value: number;
  color: 'white' | 'yellow' | 'orange' | 'red' | 'green';
  reverse: boolean;
};

export const getChipColorCode = (chip: Chip): string => {
  switch (chip.color) {
    case 'yellow':
      return '#f2be49';
    case 'green':
      return '#21cb97';
    case 'red':
      return '#fe6868';
    case 'orange':
      return '#f29d49';
    default:
      return chip.color;
  }
};

export const sameChip = (chip1: Chip, chip2: Chip): boolean => (
  chip1.color === chip2.color && chip1.value === chip2.value && chip1.reverse === chip2.reverse
);
