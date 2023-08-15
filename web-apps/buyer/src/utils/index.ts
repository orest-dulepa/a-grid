export * from './env';
export * from './logger';

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const copyDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const viewNestedValue = <K>(
  defaultValue: K,
  cursor: string[],
  obj: any
): K => {
  let item = obj;
  for (const key of cursor) {
    try {
      item = item[key];
    } catch {
      return defaultValue;
    }
  }
  return item as K;
};

export const deduplicateArray = <T>(arr: T[]): T[] =>
  arr.filter((v, i, self) => self.indexOf(v) === i);

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

// Format ex: 'May 12', and 'May 12, 2020' for long form
export const formatDate = (date: Date, longForm = false): string =>
  `${MONTHS[date.getMonth()]} ${date.getDate()}${
    longForm ? `, ${date.getFullYear()}` : ''
  }`;

export const formatDateString = (date: string, longForm = false): string => {
  return formatDate(new Date(date), longForm);
};

export const formatDaysAgo = (daysAgo: number, longForm = false): string =>
  formatDate(new Date(Date.now() - DAY_IN_MILLISECONDS * daysAgo), longForm);

export const round = (n: number, precision = 1): number => {
  const m = 10 ** precision;
  return Math.round(n * m) / m;
};

// Displays a custom validation message for an element
export const showCustomValidity = (
  element: HTMLInputElement,
  message: string
): void => {
  element.setCustomValidity(message);
  element.reportValidity();
  element.setCustomValidity(''); // Resets it for other validation messages to show
};

export const scrollToPosition = (y: number, x = 0): void => {
  window.scrollTo({
    top: y,
    left: x,
    behavior: 'smooth',
  });
};

export const scrollToElement = (el: Element): void => {
  const refElementMarginTop = 80;
  scrollToPosition(
    el.getBoundingClientRect().top + window.scrollY - refElementMarginTop
  );
};
