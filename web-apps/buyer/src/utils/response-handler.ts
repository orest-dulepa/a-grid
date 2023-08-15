import { ReturnResult } from '@/types';
import {
  AudienceSpendAndImpressions,
  PublisherTraffic,
} from '../../functions/types';

export default class ResponseHandler {
  static checkType = <T>(result: ReturnResult<T>): boolean => {
    return result.type === 'success' && !!result.data;
  };

  static isAudienceAnalyticsMissingData({
    data,
  }: {
    data?: {
      analytics: AudienceSpendAndImpressions[];
      traffic: PublisherTraffic[];
    };
  }): boolean {
    if (data === undefined) return false;

    const { analytics, traffic } = data;

    if (analytics === undefined || traffic === undefined) {
      return false;
    }

    const isSomeTrafficMissing = traffic.some((item) => {
      return (
        item.publisherId === null || item.day === null || item.traffic === null
      );
    });

    const isSomeMatchedAudienceMissing = analytics.some((item) => {
      return (
        item.id === null ||
        item.name === null ||
        item.pageViews === null ||
        item.uniques === null ||
        item.impressions === null ||
        item.uniques === null
      );
    });

    return !isSomeTrafficMissing && !isSomeMatchedAudienceMissing;
  }
}
