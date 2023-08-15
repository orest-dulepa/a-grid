export const isProd = process.env.CONTEXT === 'production';
export const isDev = !isProd;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Memorizes a function to be run only once
export const once = <A, R>(fn: (...any: A[]) => Promise<R>): ((...args: A[]) => Promise<R>) => {
  let cache!: R;

  return async (...args: A[]): Promise<R> => {
    if (!cache) cache = await fn(...args);
    return cache;
  };
};

// Displays a custom validation message for an element
export const showCustomValidity = (element: HTMLInputElement, message: string): void => {
  element.setCustomValidity(message);
  element.reportValidity();
  element.setCustomValidity(''); // Resets it for other validation messages to show
};

export const round = (n: number, precision = 1): number => {
  const m = 10 ** precision;
  return Math.round(n * m) / m;
};

export const sumArray = (values: number[]): number => {
  return values.reduce((acc, e) => acc + e, 0);
};

export const averageValueByKey = (values: any[], key: string): number => {
  return values.reduce((acc, value) => acc + parseFloat(value[key]), 0) / values.length;
};

export const selectElementContents = (el: HTMLElement): Selection | null => {
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
  return selection;
};

const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const minuteInMilliseconds = 1000 * 60;
export const hourInMilliseconds = 1000 * 60 * 60;
export const dayInMilliseconds = 1000 * 60 * 60 * 24;

// Format ex: 'May 12', and 'May 12, 2020' for long form
export const formatDate = (date: Date, longForm = false): string =>
  `${month[date.getMonth()]} ${date.getDate()}${longForm ? `, ${date.getFullYear()}` : ''}`;

export const formatDaysAgo = (daysAgo: number, longForm = false): string =>
  formatDate(new Date(Date.now() - dayInMilliseconds * daysAgo), longForm);

export const scrollToPosition = (y: number, x = 0): void => {
  window.scrollTo({
    top: y,
    left: x,
    behavior: 'smooth',
  });
};

export const scrollToElement = (el: Element): void => {
  const refElementMarginTop = 80;
  scrollToPosition(el.getBoundingClientRect().top + window.scrollY - refElementMarginTop);
};

export const scrollTop = (): void => {
  scrollToPosition(0, 0);
};

export const isPassAtLeastOkay = (p: string): boolean => p.length >= 8;

export const addHttpToUrl = (site: string): string => {
  let siteUrl = site;
  if (site.indexOf('http') === -1) {
    siteUrl = `https://${siteUrl}`;
  }
  return siteUrl;
};

export const copyDeep = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

type ValueOrObject<T> = T | { [index: string]: ValueOrObject<T> };

export const viewNestedValue = <K>(
  defaultValue: K,
  cursor: string[],
  obj: unknown
): ValueOrObject<K> => {
  return cursor.reduce((item, key: string) => {
    try {
      return (item as { [index: string]: ValueOrObject<K> })[key];
    } catch {
      return defaultValue;
    }
  }, obj) as ValueOrObject<K>;
};

export const deduplicateArray = <T>(arr: T[]): T[] =>
  arr.filter((v, i, self) => self.indexOf(v) === i);

export const capitalizeFirstLetter = (string: string): string => {
  const word = string.charAt(0).toUpperCase() + string.slice(1);
  return word || '';
};
