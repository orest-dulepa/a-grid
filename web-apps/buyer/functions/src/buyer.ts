import * as functions from 'firebase-functions';
import { nanoid } from 'nanoid';
import * as admin from 'firebase-admin';
import * as bq from './bigquery';
import {
  AudienceSpendAndImpressions,
  AudienceOverlap,
  PublisherTraffic,
} from '../types';
import axios from 'axios';

const app = admin.initializeApp();

const db = admin.firestore();

const isProd = app.options.projectId === 'ag-edgekit-prod';
const getMode = () => {
  return isProd ? 'prod' : 'dev';
};

const getOrgEmailDomain = (email: string): string | null => {
  const domainRegExp = /(?<=@)[^.]+(?=\.).*/g;
  const orgDomainMatches = email.match(domainRegExp);
  return orgDomainMatches && orgDomainMatches[0];
};

export const checkUserEmailBelongsToOrganization = functions
  .region('europe-west1')
  .https.onCall(async ({ email }: { email: string }) => {
    const orgEmailDomain = getOrgEmailDomain(email);

    const accountsRef = await db
      .collection('accounts')
      .where('orgEmailDomain', '==', orgEmailDomain)
      .get();

    if (accountsRef.size === 0)
      return { hasOrg: false, orgName: undefined, orgEmailDomain };
    else if (accountsRef.size > 1)
      throw new Error('More than one organization found for the domain');

    const { orgName } = accountsRef.docs[0].data();

    return { hasOrg: true, orgName, orgEmailDomain };
  });

export const sendSlackMessage = async (
  channel: string,
  message: string
): Promise<void> => {
  functions.logger.info(`Sending slack message: "${message}"`);

  try {
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel,
        text: message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${functions.config().slack.api_key}`,
        },
      }
    );
  } catch (e) {
    functions.logger.error('Failed to send slack message', e);
  }
};

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

export const createUserInFirestore = functions
  .region('europe-west1')
  .https.onCall(async ({ fullName, email }, context) => {
    let uid: string;

    if (context.auth && !!email && !!fullName) {
      uid = context.auth.uid;
    } else {
      return {
        type: 'error',
        message: 'Not authorized to run firebase function',
      };
    }

    const orgEmailDomain = getOrgEmailDomain(email);

    let accountId = null;
    const accountsRef = await db
      .collection('accounts')
      .where('orgEmailDomain', '==', orgEmailDomain)
      .get();

    if (accountsRef.size > 1)
      throw new Error('More than one organization found for the domain');
    if (accountsRef.size === 1) accountId = accountsRef.docs[0].id;

    await db.doc(`users/${uid}`).set({ accountId, fullName });

    return { type: 'success', message: 'Successfully created user' };
  });

export const createOrganization = functions
  .region('europe-west1')
  .https.onCall(
    async (
      { orgName, orgWebsite, orgEmailDomain, accountType, platforms },
      context
    ) => {
      let uid: string;

      if (context.auth) {
        uid = context.auth.uid;
      } else {
        return {
          type: 'error',
          message: 'Not authorized to run firebase function',
        };
      }

      await db.runTransaction(async (transaction) => {
        const idLength = 6;
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

        const isBuyer = accountType === 'buyer';
        const isSeller = accountType === 'seller';

        transaction.set(accountRef, {
          orgName,
          orgEmailDomain,
          isBuyer,
          isSeller,
          dsps: isBuyer ? platforms : null,
          ssps: isSeller ? platforms : null,
          orgWebsite,
          isIntegrationCheckSuccessful: false,
          isXandrIntegrationComplete: false,
          showCrawledFeatures: false,
          xandrId: null,
          isOrgApproved: false,
        });

        const publisherId = nanoid(idLength);
        const publisherRef = accountRef
          .collection('publishers')
          .doc(publisherId);
        transaction.set(publisherRef, {});

        const apiKeyRef = publisherRef.collection('apiKeys').doc();
        transaction.set(apiKeyRef, {});

        transaction.update(db.doc(`users/${uid}`), { accountId });
      });

      return { type: 'success', message: 'Successfully created organization' };
    }
  );

export const getAudiencesSpendAndImpressions = functions
  .region('europe-west1')
  .https.onCall(
    async (
      {
        audiencesIds,
        buyerMemberId,
      }: { audiencesIds: string[]; buyerMemberId: string },
      context
    ): Promise<AudienceSpendAndImpressions[] | undefined> => {
      if (!context.auth) return undefined;
      if (
        !Array.isArray(audiencesIds) ||
        audiencesIds.length === 0 ||
        typeof buyerMemberId !== 'number'
      ) {
        throw new Error(
          'getAudiencesDataframe, has been called without the correct arguments.'
        );
      }
      const [result] = await bq.getAudiencesSpendAndImpressions(
        audiencesIds,
        buyerMemberId
      );
      return result;
    }
  );

export const getPublisherTraffic = functions
  .region('europe-west1')
  .https.onCall(async (_, context): Promise<PublisherTraffic[] | undefined> => {
    if (!context.auth) return undefined;
    const [result] = await bq.getPublisherTraffic();
    return result;
  });

export const getAudienceOverlap = functions
  .region('europe-west1')
  .https.onCall(
    async (
      { audienceId }: { audienceId: string },
      context
    ): Promise<AudienceOverlap[] | undefined> => {
      if (!context.auth) return undefined;
      const [result] = await bq.getAudienceOverlap(audienceId);
      return result;
    }
  );
