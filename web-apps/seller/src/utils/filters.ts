export const capitalize = (s: string): string => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const roundNumber = (number: number, numDecimalPlaces = 2): number => {
  const delimiter = 10 ** numDecimalPlaces;
  return Math.floor(number * delimiter) / delimiter;
};

export const splitWithCommas = (string: string): string => {
  const splitted = string.split('.');
  splitted[0] = splitted[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return splitted.join('.');
};

/**
 * This method to format large numbers to be like:
 * 1,000 – 9,999
 • 10,000 – 99,999
 • 100k / 100.9k – 999k / 999.9k
 • 100m / 100.99m – 999m / 999.99m
 * @param number
 * @param numDecimalPlaces
 */
export const formatNumber = (number: number, numDecimalPlaces = 2): string => {
  const integerNumber = parseInt(`${number}`, 10);
  const thousand = 1000;
  const hundredThousand = 100000;
  const million = 1000000;
  let delimiter = 1;
  let suffix = '';

  if (integerNumber >= hundredThousand && integerNumber < million) {
    // Show thousands
    delimiter = thousand;
    suffix = 'k';
  } else if (integerNumber >= million) {
    // Show millions
    delimiter = million;
    suffix = 'm';
  }
  const formatted = splitWithCommas(roundNumber(number / delimiter, numDecimalPlaces).toString());
  return `${formatted}${suffix}`;
};

export const dashOnEmpty = (string: string): string => {
  if (string === '0') {
    return '-';
  }
  return string || '-';
};

export const currency = (currencyObject: { currency: string; value: number }): string => {
  if (!currencyObject.value) {
    return `${currencyObject.currency}-`;
  }
  return `${currencyObject.currency}${formatNumber(currencyObject.value)}`;
};

export const getFirstWord = (string: string): string => {
  const firstWord = string.split(' ', 1).shift();
  return firstWord || '';
};
