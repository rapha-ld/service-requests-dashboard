
/**
 * Formats a number by adding commas as thousand separators
 * @param num The number to format
 * @returns A string representation of the number with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString('en-US');
};
