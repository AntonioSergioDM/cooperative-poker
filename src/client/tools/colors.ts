export type ColorNames = 'red' | 'green';

// TODO apply to chips?
export const getColorHex = (color: ColorNames) => ({
  // TODO replace with hex codes
  red: 'red',
  green: 'green',
}[color]);
