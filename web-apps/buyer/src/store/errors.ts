export class MissingAnalyticsDataError extends Error {
  constructor() {
    super('Audiences analytics not loaded successfully');
    this.name = 'MissingAnalyticsDataError';
  }
}
