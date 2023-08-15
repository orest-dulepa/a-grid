export type Result<T> =
  | { type: 'success'; message: string; data?: T }
  | { type: 'error'; message: string; error?: Error; code?: string; data?: undefined };
