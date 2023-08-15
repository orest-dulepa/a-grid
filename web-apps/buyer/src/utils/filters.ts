export const capitalizeFirstLetter = (string: string): string => {
  const word = string.charAt(0).toUpperCase() + string.slice(1);
  return word || '';
};

export const roundNumber = (number: number, numDecimalPlaces = 2): number => {
  const delimiter = 10 ** numDecimalPlaces;
  return Math.floor(number * delimiter) / delimiter;
};

export const getSplittedWithCommasNumber = (string: string): string => {
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
export const getFormattedNumber = (
  number: number,
  numDecimalPlaces = 2
): string => {
  const integerNumber = parseInt(`${number}`, 10);
  const THOUSAND = 1000;
  const HUNDRED_THOUSAND = 100000;
  const MILLION = 1000000;
  let delimiter = 1;
  let suffix = '';

  if (integerNumber >= HUNDRED_THOUSAND && integerNumber < MILLION) {
    // Show thousands
    delimiter = THOUSAND;
    suffix = 'k';
  } else if (integerNumber >= MILLION) {
    // Show millions
    delimiter = MILLION;
    suffix = 'm';
  }
  const formatted = getSplittedWithCommasNumber(
    roundNumber(number / delimiter, numDecimalPlaces).toString()
  );
  return `${formatted}${suffix}`;
};

export const getFirstWord = (string: string): string => {
  if (string) {
    const firstWord = string.split(' ', 1).shift();
    return firstWord || '';
  }

  return '';
};

export const getCurrency = (currencyObject: {
  currency: string;
  value: number;
}): string => {
  if (!currencyObject.value) {
    return `${currencyObject.currency}-`;
  }
  return `${currencyObject.currency}${getFormattedNumber(
    currencyObject.value
  )}`;
};

export const dashOnEmpty = (string: string): string => {
  if (string === '0') {
    return '-';
  }
  return string || '-';
};

export const formatCurrency = (amount: number): string | number => {
  if (!amount) {
    return 0;
  }
  const formattedAmount = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  });
  return formattedAmount.format(amount).replace(',', '');
};
