import { BigQuery, JobMetadata } from '@google-cloud/bigquery';
import {
  AudienceSpend,
  AudienceOverlap,
  PublisherTraffic,
  MatchedAudiences,
  AudienceSpendAndImpressions,
} from '../../types';

const bq = process.env.GCP_PROJECT
  ? new BigQuery({ projectId: process.env.GCP_PROJECT })
  : new BigQuery();

export const getAudiencesSpendsById = async (
  xandrId: string,
  audienceIds: string[],
  overNumberOfDays = 30
): Promise<[AudienceSpend[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
       SUM(curator_revenue) AS spend,
       audience_id AS id
      FROM xandr.curator_analytics
      WHERE buyer_member_id = CAST(@xandrId AS INT64)
        AND audience_id IN UNNEST(@audienceIds)
      GROUP BY id
    `,
    params: { xandrId, audienceIds, overNumberOfDays },
  });
};

export const getMatchedAudiencesImpressions = async (
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

export const getAudiencesSpendAndImpressions = async (
  audiencesIds: string[],
  buyerMemberId: number
): Promise<[AudienceSpendAndImpressions[], JobMetadata]> => {
  return bq.query({
    query: `
    WITH
      audience_lookup AS (
        SELECT
          id,
          name
        FROM
          firestore_export.audiences_schema_meta_latest
      ),
      audience_stats AS (
        SELECT
          DATE(date_hour) AS day,
          audience_id,
          SUM(page_views) AS page_views,
          SUM(uniques) AS uniques
        FROM
          app.matched_audiences
        WHERE
          date_hour >= DATETIME_SUB(CURRENT_DATE(),
            INTERVAL 30 DAY)
        GROUP BY
          1,
          2
      ),
      audience_spend AS (
        SELECT
          DATE(hour) AS day,
          audience_id,
          SUM(imps) AS impressions,
          SUM(curator_revenue) AS curator_revenue
        FROM
          xandr.curator_analytics
        WHERE
          hour >= DATETIME_SUB(CURRENT_DATE(),
            INTERVAL 30 DAY)
          AND buyer_member_id = @buyerMemberId
        GROUP BY
          1,
          2
      )
    SELECT
      STRING(t1.day) as day,
      t1.audience_id AS id,
      t3.name AS name,
      t1.uniques,
      t1.page_views AS pageViews,
      t2.impressions,
      ROUND(t2.curator_revenue, 2) AS spend
    FROM
      audience_stats t1
    FULL OUTER JOIN
      audience_spend t2
    ON
      t1.audience_id = t2.audience_id
      AND t1.day = t2.day
    JOIN
      audience_lookup t3
    ON
      t1.audience_id = t3.id
    WHERE
      t1.audience_id IN UNNEST(@audiencesIds)
    ORDER BY t1.day
    `,
    params: { audiencesIds, buyerMemberId },
  });
};

export const getPublisherTraffic = async (): Promise<
  [PublisherTraffic[], JobMetadata]
> => {
  return bq.query({
    query: `
      SELECT
        STRING(DATE(date_hour)) as day,
        SUM(traffic) AS traffic,
        SUM(eligible_traffic) AS eligibleTraffic,
        SUM(ads_supported) AS adsSupported,
        SUM(cookies_supported) AS cookiesSupported,
        SUM(consent_granted) AS consentGranted
      FROM app.publisher_traffic
      WHERE
        date_hour >= DATETIME_SUB(CURRENT_DATE(),
          INTERVAL 30 DAY)
      GROUP BY day
      ORDER BY day
    `,
  });
};

export const getAudienceOverlap = async (
  audienceId: string
): Promise<[AudienceOverlap[], JobMetadata]> => {
  return bq.query({
    query: `
      SELECT
        overlap_audience_name as name,
        count/(
          SELECT MAX(count)
          FROM app.audience_overlap
          WHERE audience_id = @audienceId
          AND overlap_audience_type = 'IAB'
        ) as overlap
      FROM app.audience_overlap
      WHERE audience_id = @audienceId
      AND overlap_audience_type = 'IAB'
      ORDER BY count DESC
    `,
    params: { audienceId },
  });
};
