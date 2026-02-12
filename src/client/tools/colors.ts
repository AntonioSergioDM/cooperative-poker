export type ColorNames = 'red' | 'green';

// TODO apply to chips?
export const getColorHex = (color: ColorNames) => ({
  red: '#fe6868',
  green: '#21cb97',
}[color]);
