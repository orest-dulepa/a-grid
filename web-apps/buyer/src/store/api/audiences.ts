import { auth, db } from '../../firebase';
import firebase from 'firebase/app';
import { ReturnResult } from '@/types';
import {
  AppAudienceDefinition,
  PlatformAudienceDefinition,
  AudienceType,
  AudienceStatus,
  AccountIdOrgNameMap,
} from '../types';
import { logger } from '@/utils';
import { getUserAccoundId } from './auth';
import { successResponse, errorResponse } from './utils';

const updateAudienceProp = async <T>(
  id: string,
  prop: T
): Promise<T | null> => {
  try {
    const accountId = await getUserAccoundId();
    const audienceSnap = db.doc(`audiences/${id}`);

    const [account, audience] = await Promise.all([
      db.doc(`accounts/${accountId}`).get(),
      audienceSnap.get(),
    ]);
    const isBuyer = account.get('isBuyer');
    const audienceType = audience.get('type');

    if (isBuyer) {
      if (audienceType === AudienceType.IAB) {
        throw new Error(
          'Cannot update IAB audience definition from buyer account'
        );
      }
      await audienceSnap.update(prop);
      return prop;
    }
    return null;
  } catch (error) {
    logger.error('Failed to update audience property: ', error);
    return null;
  }
};

export const updateAudienceStatus = async (
  id: string,
  status: AudienceStatus
): Promise<AudienceStatus | null> => {
  const result = await updateAudienceProp(id, { status });
  if (result !== null) return result.status;
  return null;
};

export const updateAudienceDefinitionProp = async <T>(
  id: string,
  key: string,
  value: T
): Promise<T | null> => {
  const result = await updateAudienceProp(id, { [`definition.${key}`]: value });
  if (result !== null) return result[key];
  return value;
};

const getBuyerAudienceDefinitions = async (
  accountId: string
): Promise<PlatformAudienceDefinition[]> => {
  const accountSnap = await db.doc(`accounts/${accountId}`).get();
  const isBuyer = accountSnap.get('isBuyer');

  let audiencesSnapshot: {
    docs: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>[];
  };
  if (isBuyer) {
    audiencesSnapshot = await db
      .collection(`audiences`)
      .where('type', '==', AudienceType.BUYER)
      .where('owner', 'in', [accountId, 'platform'])
      .get();
  } else {
    audiencesSnapshot = {
      docs: [],
    };
  }

  return audiencesSnapshot.docs.map(
    (doc) => doc.data() as PlatformAudienceDefinition
  );
};

const getIABAudienceDefinitions = async (): Promise<
  PlatformAudienceDefinition[]
> => {
  const audiencesSnapshot = await db
    .collection(`audiences`)
    .where('type', '==', AudienceType.IAB)
    .where('owner', '==', 'platform')
    .get();

  return audiencesSnapshot.docs.map(
    (doc) => doc.data() as PlatformAudienceDefinition
  );
};

export const getAudienceDefinitions = async (
  accountId: string
): Promise<ReturnResult<AppAudienceDefinition[] | void>> => {
  try {
    const audiencesResults = await Promise.all([
      getBuyerAudienceDefinitions(accountId),
      getIABAudienceDefinitions(),
    ]);

    const audienceDefinitions = audiencesResults
      .flat()
      .filter((audienceDefinition) => !audienceDefinition.deleted)
      .map((audienceDefinition) => {
        return {
          accountId,
          id: audienceDefinition.id,
          owner: audienceDefinition.owner,
          type: audienceDefinition.type,
          name: audienceDefinition.name,
          status: audienceDefinition.status,
          pausedBySellers: audienceDefinition.pausedBySellers,
          lookBack: audienceDefinition.definition.lookBack,
          ttl: audienceDefinition.definition.ttl,
          confidence: audienceDefinition.definition.confidence,
        } as AppAudienceDefinition;
      });

    return successResponse(
      'Successful received audience definitions',
      audienceDefinitions
    );
  } catch (error) {
    logger.error(error);
    const { message } = error;
    return errorResponse(message);
  }
};

export const getOrgNamesByOwner = async (
  accountIds: string[]
): Promise<ReturnResult<AccountIdOrgNameMap>> => {
  if (!auth.currentUser) return errorResponse('Not logged in');

  try {
    const accountDocs = await Promise.all(
      accountIds.map((id) => db.doc(`accounts/${id}`).get())
    );

    const results = accountDocs.reduce((acc, doc) => {
      return {
        ...acc,
        [doc.id]: doc.get('orgName') || doc.id,
      };
    }, {});

    return successResponse('User successfully fetched', results);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    await new Promise((resolve, reject) =>
      auth.onAuthStateChanged(
        (user) => {
          if (user) resolve(user);
          else reject(new Error('No user logged in'));
        },
        (error) => reject(error)
      )
    );
    return true;
  } catch (error) {
    return false;
  }
};
