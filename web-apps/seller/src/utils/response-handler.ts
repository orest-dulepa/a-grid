import { Result } from '@/types';
import { AudienceStats, PageCrawls } from '@/store/types';

export default class ResponseHandler {
  static checkType = <T>(result: Result<T>): boolean => {
    return result.type === 'success' && !!result.data;
  };

  static isAudienceStatsMissingData(audienceStats: AudienceStats | undefined): boolean {
    if (typeof audienceStats === 'undefined') {
      return false;
    }

    const { publisherTraffic, matchedAudiences, currency } = audienceStats;

    const isSomeTrafficMissing = publisherTraffic.some((traffic) => {
      return (
        traffic.accountId === null ||
        traffic.publisherId === null ||
        traffic.daysAgo === null ||
        traffic.traffic === null
      );
    });

    const isSomeMatchedAudienceMissing = matchedAudiences.some((matchedAudience) => {
      return (
        matchedAudience.accountId === null ||
        matchedAudience.audienceId === null ||
        matchedAudience.name === null ||
        matchedAudience.pageViews === null ||
        matchedAudience.uniques === null ||
        matchedAudience.revenue.currency === null ||
        matchedAudience.revenue.value === null
      );
    });

    return !isSomeTrafficMissing && !isSomeMatchedAudienceMissing && currency !== null;
  }

  static isAudienceStatsMissingRecentTraffic(
    audienceStats: AudienceStats | undefined,
    daysForCheck: number
  ): boolean {
    if (typeof audienceStats === 'undefined') {
      return false;
    }

    const { publisherTraffic } = audienceStats;

    const lastDaysTraffic = publisherTraffic.reduce((a, traffic) => {
      return a + (traffic.daysAgo <= daysForCheck ? traffic.traffic : 0);
    }, 0);
    const totalTraffic = publisherTraffic.reduce((a, traffic) => {
      return a + traffic.traffic;
    }, 0);
    return lastDaysTraffic === 0 && totalTraffic !== 0;
  }

  static isPageCrawlsMissingData(pageCrawls: PageCrawls | undefined): boolean {
    if (typeof pageCrawls === 'undefined') {
      return false;
    }

    const { stats, crawls } = pageCrawls;

    const isStatsMissing =
      stats.some((stat) => {
        return stat.daysAgo === null || stat.pagesCrawled === null;
      }) || stats.length === 0;

    const isPageCrawlsMissing =
      crawls.some((pageCrawl) => {
        return (
          pageCrawl.pageTitle === null || pageCrawl.timestamp === null || pageCrawl.url === null
        );
      }) || crawls.length === 0;

    return !isStatsMissing && !isPageCrawlsMissing;
  }

  static isPageCrawlsMissingRecentCrawls(
    pageCrawls: PageCrawls | undefined,
    daysForCheck: number
  ): boolean {
    if (typeof pageCrawls === 'undefined') {
      return false;
    }

    const { stats } = pageCrawls;

    const lastDaysCrawls = stats.reduce((a, stat) => {
      return a + (stat.daysAgo <= daysForCheck ? stat.pagesCrawled : 0);
    }, 0);
    const totalCrawls = stats.reduce((a, stat) => {
      return a + stat.pagesCrawled;
    }, 0);

    return lastDaysCrawls === 0 && totalCrawls !== 0;
  }
}
