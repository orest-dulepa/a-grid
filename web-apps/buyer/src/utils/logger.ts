import { isDev } from './env';

const makeLogger = (logFn: (...data: any[]) => void) => (...data: any[]) => {
  if (isDev) logFn(...data);
};

export const logger = {
  log: makeLogger(console.log),
  info: makeLogger(console.info),
  warn: makeLogger(console.warn),
  error: makeLogger(console.error),
};
