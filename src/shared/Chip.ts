export type Chip = {
  value: number;
  color: 'white' | 'yellow' | 'orange' | 'red' | 'lime';
  reverse: boolean;
};

export const sameChip = (chip1: Chip, chip2: Chip): boolean => (
  chip1.color === chip2.color && chip1.value === chip2.value && chip1.reverse === chip2.reverse
);
