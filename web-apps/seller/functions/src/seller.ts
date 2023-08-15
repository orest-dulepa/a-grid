import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { JobMetadata } from '@google-cloud/bigquery';
import { nanoid } from 'nanoid';
import * as puppeteer from 'puppeteer';
import { Response, Request } from 'puppeteer';
import {
  MatchedAudiences,
  PublisherTraffic,
  AudienceRevenueRow,
  AudienceInfoQueryParams,
} from '../types';
import * as bq from './bigquery';
import { sendSlackMessage } from './integrations';
import { getAccountId } from './utils';

interface MatchedAudience {
  id: string;
  matchedAt: number;
  expiresAt: number;
  matchedOnCurrentPageView: boolean;
}

interface Audiences {
  matchedAudiences: MatchedAudiences[];
  publisherTraffic: PublisherTraffic[];
}

const app = admin.initializeApp();

const db = admin.firestore();

const isProd = app.options.projectId === 'ag-edgekit-prod';

const getMode = () => {
  return isProd ? 'prod' : 'dev';
};

// Creates the firestore documents for the newly created user
export const createUserInFirestore = functions
  .region('europe-west1')
  .https.onCall(async ({ fullName, orgWebsite }, context) => {
    let uid: string;

    if (context.auth) {
      uid = context.auth.uid;
    } else {
      return { type: 'error', message: 'Not authorized to run firebase function' };
    }

    await db.runTransaction(async (transaction) => {
      const idLength = 6;

      /* Create account */
      // Find a unique id to use
      let accountId = nanoid(idLength);
      let accountExists = false;
      let accountRef;
      while (!accountRef || accountExists) {
        accountId = nanoid(idLength);
        accountRef = db.doc(`accounts/${accountId.toString()}`);
        try {
          // eslint-disable-next-line no-await-in-loop
          const { exists } = await transaction.get(accountRef);
          accountExists = exists;
        } catch (e) {
          functions.logger.info("Account doesn't exist");
        }
      }

      functions.logger.info('Signup', { accountId, accountRef });

      await transaction.set(accountRef, {
        isSeller: true,
        isBuyer: false,
        orgWebsite,
        isIntegrationCheckSuccessful: false,
        isXandrIntegrationComplete: false,
        showCrawledFeatures: false,
        xandrId: null,
      });

      functions.logger.info('Signup, created account:', { orgWebsite });

      /* Create a default publisher */
      const publisherId = nanoid(idLength);
      const publisherRef = accountRef.collection('publishers').doc(publisherId);
      await transaction.set(publisherRef, {});

      functions.logger.info('Signup, created default publisher with id:', publisherId);

      /* Create a default api key */
      const apiKeyRef = publisherRef.collection('apiKeys').doc();
      await transaction.set(apiKeyRef, {});

      functions.logger.info('Signup, created default api key with id:', apiKeyRef.id);

      /* Create user */
      await transaction.set(db.doc(`users/${uid}`), { accountId, fullName });

      functions.logger.info('Signup, created user');
    });

    functions.logger.info('Successfully created user with uid ', uid);
    return { type: 'success', message: 'Successfully created user' };
  });

export const sendSlackUserSignUp = functions
  .region('europe-west1')
  .https.onCall(async ({ orgWebsite, email }, context) => {
    if (!context.auth) return undefined;
    await sendSlackMessage(
      '#alerts_app',
      `*${getMode()}*: User ${email} has signed up. Organization: ${orgWebsite}`
    );
    return { message: 'Successfully sent slack message' };
  });

export const sendSlackFlaggedUrl = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) return undefined;
    await sendSlackMessage(
      '#alerts_app',
      `*${getMode()}*: User ${data.email} has flagged url - ${data.url}`
    );
    return { message: 'Successfully flagged url' };
  });

export const sendSlackUnsupportedSSP = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) return undefined;
    await sendSlackMessage(
      '#alerts_app',
      `*${getMode()}*: User ${data.email} is using unsupported SSP - ${data.unsupportedSSP}`
    );
    return { message: 'Successfully sent unsupported SSP' };
  });

const formatSlackMessageParam = (param: string, value: string): string => {
  return `\`${param}\`: ${value}`;
};

export const sendSlackErrorNotification = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) return undefined;
    let message = `
      :exclamation: ${data.title} :exclamation:
      *${getMode()}*: User ${data.email} got an error.
      \`${data.message}\`
      `;
    if (data.accountId) message += formatSlackMessageParam('accountId', data.accountId);
    await sendSlackMessage('#alerts_app', message);
    return { message: 'Successfully sent error Notification' };
  });

export const sendSlackWarningNotification = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    if (!context.auth) return undefined;
    let message = `
      :warning: ${data.title} :warning:
      *${getMode()}*: User ${data.email} got a warning.
      \`${data.message}\`
      `;
    if (data.accountId) message += formatSlackMessageParam('accountId', data.accountId);
    await sendSlackMessage('#alerts_app', message);
    return { message: 'Successfully sent warning Notification' };
  });

export const getAudiences = functions.region('europe-west1').https.onCall(
  async (
    { audiencesIds, accountId, overNumberOfDays }: AudienceInfoQueryParams,
    context
  ): Promise<Audiences | undefined> => {
    functions.logger.info('Getting audiences');
    if (!context.auth) return undefined;

    const [resultMatchedAudiences, resultPublisherTraffic] = await Promise.all([
      bq.getMatchedAudiences(audiencesIds, accountId, overNumberOfDays),
      bq.getPublisherTraffic(accountId, overNumberOfDays),
    ]);

    const [matchedAudiences]: [MatchedAudiences[], JobMetadata] = resultMatchedAudiences;
    const [publisherTraffic]: [PublisherTraffic[], JobMetadata] = resultPublisherTraffic;

    return {
      matchedAudiences,
      publisherTraffic,
    };
  }
);

export const getRecentPageCrawls = functions
  .region('europe-west1')
  .https.onCall(async (options, context) => {
    functions.logger.info('Getting recent page crawls');
    if (!context.auth) return undefined;
    const accountId = await getAccountId(db, context.auth.uid);

    const recentPageCrawls = await bq.getRecentPageCrawls(
      accountId,
      options.crawlsOverNumberOfDays
    );
    const recentpageCrawlsStat = await bq.getRecentPageCrawlsStat(
      accountId,
      options.statisticOverNumberOfDays
    );
    return {
      crawls: recentPageCrawls[0] || [],
      stats: recentpageCrawlsStat[0] || [],
    };
  });

export const checkSiteIntegration = functions
  .runWith({ memory: '1GB', timeoutSeconds: 120 })
  .region('europe-west1')
  .https.onCall(async (site, context) => {
    if (!context.auth) return false;
    const cdnUrlRegEx = new RegExp('cdn.edkt.io');
    const edgeKitPreBidKeyword = 'edgekit';
    const matchedAudienceId = '243';
    let cdnScriptAdded = false;
    let preBidAudiencesAdded = false;

    if (!site) {
      functions.logger.error('Integration check: site url not provided');
      return {
        cdnScriptAdded,
        preBidAudiencesAdded,
        message: 'Error: site url not provided',
      };
    }

    try {
      // Init puppeteer browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setDefaultTimeout(120000);

      // First load and set local storage value.
      await page.goto(site);
      await page.evaluate(
        (audienceId) => {
          const nowTimestamp = Math.round(Date.now() / 1000);
          const timeoutSeconds = 120;
          const matchedAudiences: MatchedAudience[] = [
            {
              id: audienceId,
              matchedAt: nowTimestamp,
              expiresAt: nowTimestamp + timeoutSeconds,
              matchedOnCurrentPageView: true,
            },
          ];

          localStorage.setItem('edkt_matched_audience_ids', JSON.stringify([audienceId]));
          localStorage.setItem('edkt_matched_audiences', JSON.stringify(matchedAudiences));
        },
        [matchedAudienceId]
      );

      // Get loaded scripts and check is load success
      page.on('response', (response: Response) => {
        if (cdnUrlRegEx.test(response.url()) && response.status() === 200) {
          cdnScriptAdded = true;
        }
      });

      // Enable Request Interception
      await page.setRequestInterception(true);

      page.on('request', (interceptedRequest: Request) => {
        // Skip no needed resources to speed up.
        if (['image', 'media', 'font', 'stylesheet'].includes(interceptedRequest.resourceType())) {
          interceptedRequest.abort();
          return;
        }

        // Check adnxs resource response
        if (interceptedRequest.url() === 'https://ib.adnxs.com/ut/v3/prebid') {
          const postData = interceptedRequest.postData();
          const bidRequest = JSON.parse(postData ?? '');

          if (!bidRequest || !bidRequest.tags) {
            interceptedRequest.continue();
            return;
          }
          // Check all tags
          bidRequest.tags.forEach((tagObj: { keywords: [{ key: string; value: string[] }] }) => {
            if (!tagObj.keywords) {
              return;
            }

            // Check all keywords
            tagObj.keywords.forEach((keywordObj) => {
              if (
                keywordObj.key === edgeKitPreBidKeyword &&
                keywordObj.value.includes(matchedAudienceId)
              ) {
                preBidAudiencesAdded = true;
              }
            });
          });
        } else {
          interceptedRequest.continue();
        }
      });

      await page.goto(site, { waitUntil: 'networkidle0' });
      await browser.close();

      return {
        cdnScriptAdded,
        preBidAudiencesAdded,
      };
    } catch (e) {
      functions.logger.warn(e.toString());
      return false;
    }
  });

export const getRevenueByAudienceId = functions.region('europe-west1').https.onCall(
  async (options, context): Promise<AudienceRevenueRow[] | undefined> => {
    functions.logger.info('Getting audiences');
    if (!context.auth) return undefined;

    const resultRevenues = await bq.getRevenueByAudienceId(
      options.audiencesIds,
      options.xandrId,
      options.overNumberOfDays
    );

    const [revenues]: [AudienceRevenueRow[], JobMetadata] = resultRevenues;
    return revenues;
  }
);
