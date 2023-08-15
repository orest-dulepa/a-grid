/* eslint-disable camelcase */
import { BigQuery, JobMetadata } from '@google-cloud/bigquery';

import {
  MatchedAudiences,
  PublisherTraffic,
  PageCrawlsStat,
  PageCrawlsRow,
  AudienceRevenueRow,
} from '../../types';

const bq = process.env.GCP_PROJECT
  ? new BigQuery({ projectId: process.env.GCP_PROJECT })
  : new BigQuery();

export const getMatchedAudiences = async (
  audiencesIds: string[],
  accountId: string,
  overNumberOfDays = 30
): Promise<[MatchedAudiences[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
        account_id AS accountId, audience_id as audienceId,
        DATETIME_DIFF(CURRENT_DATETIME(), date_hour, DAY) AS daysAgo,
        SUM(page_views) AS pageViews,
        SUM(uniques) AS uniques
      FROM app.matched_audiences
      WHERE date_hour > DATETIME_SUB(CURRENT_DATETIME(), INTERVAL @overNumberOfDays DAY)
        AND audience_id IN UNNEST(@audiencesIds)
        AND account_id = @accountId
      GROUP BY accountId, audienceId, daysAgo
      ORDER BY accountId, audienceId, daysAgo ASC
    `,
    params: { audiencesIds, accountId, overNumberOfDays },
  });
};

export const getPublisherTraffic = async (
  accountId: string,
  overNumberOfDays = 30
): Promise<[PublisherTraffic[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
        account_id AS accountId,
        DATETIME_DIFF(CURRENT_DATETIME(),
          date_hour,
          DAY) AS daysAgo,
        SUM(traffic) AS traffic,
        SUM(eligible_traffic) AS eligibleTraffic,
        SUM(ads_supported) AS adsSupported,
        SUM(cookies_supported) AS cookiesSupported,
        SUM(consent_granted) AS consentGranted
      FROM app.publisher_traffic
      WHERE date_hour > DATETIME_SUB(CURRENT_DATETIME(), INTERVAL @overNumberOfDays DAY)
      GROUP BY accountId, daysAgo
      HAVING account_id = @accountId and daysAgo < @overNumberOfDays
      ORDER BY daysAgo DESC
    `,
    params: { accountId, overNumberOfDays },
  });
};

// TODO: Use overNumberOfHours after _PARTITIONTIME changed to hours.
export const getRecentPageCrawls = async (
  accountId: string,
  overNumberOfDays: number
): Promise<[PageCrawlsRow[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
        UNIX_MILLIS(timestamp) AS timestamp,
        url,
        page_title AS pageTitle,
        keywords AS pageKeywords
      FROM
        crawler.raw_feed
      WHERE
        success = TRUE
        AND page_title IS NOT NULL
        AND account_id = @accountId
        AND ( _PARTITIONTIME IS NULL
          OR DATETIME(_PARTITIONTIME) > DATETIME_SUB(CURRENT_DATETIME(),
            INTERVAL 1 DAY) )
      ORDER BY
        timestamp DESC
      LIMIT
        30;
  `,
    params: { accountId, overNumberOfDays },
  });
};

export const getRecentPageCrawlsStat = async (
  accountId: string,
  overNumberOfDays: number
): Promise<[PageCrawlsStat[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
        COUNT( DISTINCT(rawFeed.key) ) AS pagesCrawled,
        DATE_DIFF(CURRENT_DATE(), _PARTITIONDATE, DAY) AS daysAgo
      FROM
        crawler.raw_feed AS rawFeed
      WHERE
        success = TRUE
        AND account_id = @accountId
        AND ( _PARTITIONDATE IS NULL
          OR _PARTITIONDATE > DATE_SUB(CURRENT_DATE(), INTERVAL @overNumberOfDays DAY) )
      GROUP BY
        _PARTITIONDATE
      ORDER BY
        _PARTITIONDATE ASC;
  `,
    params: { accountId, overNumberOfDays },
  });
};

export const getRevenueByAudienceId = async (
  audiencesIds: string[],
  xandrId: string,
  overNumberOfDays = 30
): Promise<[AudienceRevenueRow[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
       SUM(curator_revenue) as revenue,
       SUM(imps) as impressions,
       DATETIME_DIFF(CURRENT_DATETIME(), hour, DAY) AS daysAgo,
       audience_id as audienceId
      FROM xandr.curator_analytics
      WHERE
        seller_member_id = CAST(@xandrId AS INT64)
        AND hour > DATETIME_SUB(CURRENT_DATETIME(), INTERVAL @overNumberOfDays DAY)
        AND audience_id IN UNNEST(@audiencesIds)
      GROUP BY
        audience_id, seller_member_id, daysAgo
      HAVING daysAgo < @overNumberOfDays
      ORDER BY
        daysAgo
    `,
    params: { audiencesIds, xandrId, overNumberOfDays },
  });
};
