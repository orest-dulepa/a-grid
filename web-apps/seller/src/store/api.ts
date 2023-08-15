import firebase from 'firebase';
import { logger } from '@/utils/logger';
import { Result } from '@/types';
import { addHttpToUrl } from '@/utils';
import {
  PlatformAudienceDefinition,
  AppAudienceDefinition,
  AudienceStats,
  AudienceStatus,
  AudienceType,
  IntegrationCheckResult,
  PageCrawls,
  Signup,
  Publisher,
  UserInfo,
  AudienceRevenueRow,
  AccountIdOrgNameMap,
} from '@/store/types';
import { AudienceInfoQueryParams } from '../../functions/types';
import { auth, db, functions, getCredential } from '../firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

const postVerificationRedirectUrl = GLOBALCONFIG.redirectUrl;

const successResponse = <T>(message: string, data?: T): Result<T> => {
  return { type: 'success', message, data };
};

const errorResponse = (message: string, code?: string): Result<undefined> => {
  return { type: 'error', message, code, data: undefined };
};

export const sendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser)
    auth.currentUser.sendEmailVerification({ url: postVerificationRedirectUrl });
};

const createUser = async (email: string, password: string): Promise<firebase.User | null> => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  if (!user) return null;
  // user authed
  sendEmailVerification();
  return user;
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

const getAccount = async (uid: string): Promise<DocumentSnapshot> => {
  const userDoc = await db.doc(`users/${uid}`).get();
  const accountDoc = await db.doc(`accounts/${userDoc.get('accountId')}`).get();
  return accountDoc;
};

export const signup = async ({
  email,
  password,
  fullName,
  orgWebsite,
}: Signup): Promise<Result<firebase.User>> => {
  try {
    const user = await createUser(email, password);
    if (!user) return errorResponse('Signup failed');

    functions.httpsCallable('seller-sendSlackUserSignUp')({
      orgWebsite,
      email,
    });

    const { data }: { data: Result<null> } = await functions.httpsCallable(
      'seller-createUserInFirestore'
    )({
      fullName,
      orgWebsite,
    });

    if (data.type === 'error') return errorResponse(data.message);

    return successResponse('Signup successful', user);
  } catch (error) {
    logger.error('Signup failed', error);
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const signin = async (email: string, password: string): Promise<Result<firebase.User>> => {
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    return user ? successResponse('Successfully signed in', user) : errorResponse('User not found');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const forgotPassword = async (email: string): Promise<Result<void>> => {
  try {
    await auth.sendPasswordResetEmail(email);
    return successResponse('Successfully sent password reset email');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const verifyPasswordResetCode = async (code: string): Promise<Result<string>> => {
  try {
    const email = await auth.verifyPasswordResetCode(code);
    return successResponse('Password reset code verified', email);
  } catch (error) {
    // TODO - use custom error codes & messages
    const { message } = error;
    return errorResponse(message);
  }
};

export const verifyEmailCode = async (code: string): Promise<Result<boolean>> => {
  try {
    await auth.applyActionCode(code);
    return successResponse('Successfully verified email', true);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const changePassword = async (
  newPassword: string,
  newPasswordRepeated: string,
  code: string
): Promise<Result<void>> => {
  if (newPassword !== newPasswordRepeated) {
    return errorResponse('Passwords must match');
  }
  try {
    await auth.confirmPasswordReset(code, newPassword);
    return successResponse('Successfully changed password');
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const signout = async (): Promise<Result<void>> => {
  try {
    await auth.signOut();
    localStorage.removeItem('isOnboardingComplete');
    return successResponse('Successfully signed out');
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const setXandrId = async (xandrId: string): Promise<Result<void>> => {
  const user = auth.currentUser;
  if (!user) return errorResponse('Not currently signed in');

  try {
    const account = await getAccount(user.uid);
    await account.ref.update({ xandrId });
    return successResponse('Successfully set Xandr id');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const setIsIntegrationCheckSuccessful = async (
  isIntegrationCheckSuccessful: boolean
): Promise<Result<void>> => {
  const user = auth.currentUser;
  if (!user) return errorResponse('Not currently signed in');

  try {
    const account = await getAccount(user.uid);
    await account.ref.update({ isIntegrationCheckSuccessful });
    return successResponse('Successfully set isIntegrationCheckSuccessful');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const getRecentPageCrawls = async (
  crawlsOverNumberOfDays = 1,
  statisticOverNumberOfDays = 7
): Promise<Result<PageCrawls>> => {
  try {
    const { data }: { data: PageCrawls } = await functions.httpsCallable(
      'seller-getRecentPageCrawls'
    )({
      crawlsOverNumberOfDays,
      statisticOverNumberOfDays,
    });

    return successResponse('Successfully fetched recent page crawls', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const flagUrl = async (url: string): Promise<void> => {
  await functions.httpsCallable('seller-sendSlackFlaggedUrl')({
    url,
    email: auth.currentUser?.email,
  });
};

export const sendUnsupportedSSP = async (unsupportedSSP: string): Promise<Result<void>> => {
  try {
    logger.log('Sending unsupported ssp', unsupportedSSP);

    await functions.httpsCallable('seller-sendSlackUnsupportedSSP')({
      unsupportedSSP,
      email: auth.currentUser?.email,
    });
    logger.log('Sent unsupported ssp');
    return successResponse('Successfully sent unsupported SSP');
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const sendErrorNotification = async (
  title: string,
  message: string
): Promise<Result<void>> => {
  try {
    if (!auth.currentUser) return { type: 'error', message: 'No user logged in' };

    const accountSnap = await getAccount(auth.currentUser.uid);

    await functions.httpsCallable('seller-sendSlackErrorNotification')({
      title,
      message,
      email: auth.currentUser?.email,
      accountId: accountSnap.id,
    });
    return successResponse('Successfully sent error Notification');
  } catch (error) {
    return errorResponse('Notification was not sent.');
  }
};

export const sendWarningNotification = async (
  title: string,
  message: string
): Promise<Result<void>> => {
  try {
    if (!auth.currentUser) return { type: 'error', message: 'No user logged in' };

    const accountSnap = await getAccount(auth.currentUser.uid);

    await functions.httpsCallable('seller-sendSlackWarningNotification')({
      title,
      message,
      email: auth.currentUser?.email,
      accountId: accountSnap.id,
    });
    return successResponse('Successfully sent warning Notification');
  } catch (error) {
    return errorResponse('Notification was not sent.');
  }
};

export const getUserAccoundId = async (): Promise<string> => {
  if (!auth.currentUser) throw new Error('Not logged in');
  const user = await db.doc(`users/${auth.currentUser.uid}`).get();
  const accountId = user.get('accountId');
  return accountId;
};

const getIABAudienceDefinitions = async () => {
  const audiencesSnapshot = await db
    .collection(`audiences`)
    .where('type', '==', AudienceType.IAB)
    .where('status', 'in', [AudienceStatus.LIVE, AudienceStatus.PAUSED])
    .where('deleted', '==', false)
    .get();

  return audiencesSnapshot.docs.map((doc) => doc.data() as PlatformAudienceDefinition);
};

const getBuyerAudienceDefinitions = async () => {
  const audiencesSnapshot = await db
    .collection(`audiences`)
    .where('type', '==', AudienceType.BUYER)
    .where('status', 'in', [AudienceStatus.LIVE, AudienceStatus.PAUSED])
    .where('deleted', '==', false)
    .get();

  return audiencesSnapshot.docs.map((doc) => doc.data() as PlatformAudienceDefinition);
};

export const getAudienceDefinitions = async (
  accountId: string
): Promise<Result<AppAudienceDefinition[]>> => {
  try {
    if (!auth.currentUser) return errorResponse('Not logged in');

    const audiencesResults = await Promise.all([
      getBuyerAudienceDefinitions(),
      getIABAudienceDefinitions(),
    ]);

    const audiencesDefinitions: AppAudienceDefinition[] = audiencesResults
      .flat()
      .map((audienceDefinition) => {
        return {
          id: audienceDefinition.id,
          owner: audienceDefinition.owner,
          type: audienceDefinition.type,
          name: audienceDefinition.name,
          status:
            audienceDefinition.pausedBySellers &&
            audienceDefinition.pausedBySellers.includes(accountId)
              ? AudienceStatus.PAUSED
              : audienceDefinition.status,
        };
      });

    return successResponse('Successful received audience definitions', audiencesDefinitions);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const getAudienceStats = async (
  options: AudienceInfoQueryParams
): Promise<Result<AudienceStats>> => {
  try {
    if (!auth.currentUser) return errorResponse('Not logged in');

    const result = await functions.httpsCallable('seller-getAudiences')(options);
    const { data } = result;

    return successResponse('Successfully received audience statistic', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const getPublisher = async (): Promise<Result<Publisher>> => {
  try {
    if (!auth.currentUser) return errorResponse('Not logged in');

    const accountSnap = await getAccount(auth.currentUser.uid);

    const {
      docs: [publisher],
    } = await accountSnap.ref.collection('publishers').limit(1).get();

    const {
      docs: [apiKey],
    } = await publisher.ref.collection('apiKeys').limit(1).get();

    return successResponse('Successfully received api key', {
      apiKey: apiKey.id,
      publisherId: publisher.id,
    });
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const getUser = async (): Promise<Result<UserInfo>> => {
  if (!auth.currentUser) return errorResponse('Not logged in');

  try {
    const userSnap = await db.doc(`users/${auth.currentUser.uid}`).get();
    const accountSnap = await getAccount(auth.currentUser.uid);
    const publisherResult = await getPublisher();
    const apiKey =
      publisherResult.type === 'success' && publisherResult.data?.apiKey
        ? publisherResult.data.apiKey
        : null;

    const data = {
      email: auth.currentUser.email || '',
      accountId: userSnap.get('accountId'),
      fullName: userSnap.get('fullName'),
      orgWebsite: accountSnap.get('orgWebsite'),
      orgName: accountSnap.get('orgName'),
      showCrawledFeatures: accountSnap.get('showCrawledFeatures'),
      isIntegrationCheckSuccessful: accountSnap.get('isIntegrationCheckSuccessful'),
      isXandrIntegrationComplete: accountSnap.get('isXandrIntegrationComplete'),
      xandrId: accountSnap.get('xandrId'),
      apiKey,
    };

    return successResponse('User successfully fetched', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const updateEmail = async (
  newEmail: string,
  currentPassword: string
): Promise<Result<void>> => {
  if (!auth.currentUser || !auth.currentUser.email) return errorResponse('Not logged in');

  try {
    const credential = getCredential(auth.currentUser.email, currentPassword);
    await auth.currentUser.reauthenticateWithCredential(credential);
    await auth.currentUser.updateEmail(newEmail);

    return successResponse('Email updated');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<Result<void>> => {
  if (!auth.currentUser || !auth.currentUser.email) return errorResponse('Not logged in');

  try {
    const credential = getCredential(auth.currentUser.email, currentPassword);
    await auth.currentUser.reauthenticateWithCredential(credential);
    auth.currentUser.updatePassword(newPassword);

    return successResponse('Password updated');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const checkIntegration = async (url: string): Promise<Result<IntegrationCheckResult>> => {
  if (!auth.currentUser) return errorResponse('Not logged in');

  try {
    const site = addHttpToUrl(url);
    const result: { data: IntegrationCheckResult } = await functions.httpsCallable(
      'seller-checkSiteIntegration'
    )(site);

    return successResponse('Successfully checked installation', result.data);
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const getRevenueByAudienceId = async ({
  audiencesIds,
  xandrId,
  overNumberOfDays,
}: {
  audiencesIds: string[];
  xandrId: string;
  overNumberOfDays: number;
}): Promise<Result<AudienceRevenueRow[]>> => {
  try {
    if (!auth.currentUser) return errorResponse('Not logged in');

    const result = await functions.httpsCallable('seller-getRevenueByAudienceId')({
      audiencesIds,
      xandrId,
      overNumberOfDays,
    });
    const { data } = result;

    return successResponse('Successfully received revenue', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

const getNewAudienceStatus = (status: AudienceStatus) => {
  if (status === AudienceStatus.LIVE) {
    return AudienceStatus.PAUSED;
  }
  if ([AudienceStatus.READY, AudienceStatus.PAUSED].includes(status)) {
    return AudienceStatus.LIVE;
  }
  return status;
};

export const updateAudienceStatus = async (
  id: string,
  status: AudienceStatus
): Promise<AudienceStatus> => {
  try {
    const accountId = await getUserAccoundId();

    const audienceSnap = db.doc(`audiences/${id}`);

    const account = await db.doc(`accounts/${accountId}`).get();
    const isSeller = account.get('isSeller');

    const newStatus = getNewAudienceStatus(status);

    if (newStatus !== status) {
      if (isSeller) {
        if (newStatus === AudienceStatus.PAUSED) {
          await audienceSnap.update({
            pausedBySellers: firebase.firestore.FieldValue.arrayUnion(accountId),
          });
        } else if (status === AudienceStatus.PAUSED) {
          await audienceSnap.update({
            pausedBySellers: firebase.firestore.FieldValue.arrayRemove(accountId),
          });
        } else {
          await audienceSnap.update({ status: newStatus });
        }
        return newStatus;
      }
    }

    return status;
  } catch (error) {
    logger.error('Failed to update audience status: ', error);
    return status;
  }
};

export const getOrgNamesByOwner = async (
  accountIds: string[]
): Promise<Result<AccountIdOrgNameMap>> => {
  if (!auth.currentUser) return errorResponse('Not logged in');

  try {
    const accountDocs = await Promise.all(accountIds.map((id) => db.doc(`accounts/${id}`).get()));

    const results = accountDocs.reduce((acc, doc) => {
      return {
        ...acc,
        [doc.id]: doc.get('orgName') || doc.id,
      };
    }, {});

    return successResponse('Organization names successfully fetched', results);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};
