import firebase from 'firebase';
import { auth, db, functions, googleAuthProvider } from '../../firebase';
import { ReturnResult } from '@/types';
import { UserInfo, AccountInfo } from '../types';
import { errorResponse, successResponse } from './utils';
import { logger } from '@/utils';

export const signout = async (): Promise<ReturnResult<void>> => {
  try {
    await auth.signOut();
    return successResponse('Successfully signed out');
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const checkEmailIsAvailable = async (
  email: string
): Promise<boolean> => {
  const result = await auth.fetchSignInMethodsForEmail(email);
  return result.length === 0;
};

export const signIn = async (
  email: string,
  password: string
): Promise<ReturnResult<firebase.User>> => {
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);
    return user
      ? successResponse('Successfully signed in', user)
      : errorResponse('User not found');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const getUserAccoundId = async (): Promise<string> => {
  if (!auth.currentUser) throw new Error('Not logged in');
  const user = await db.doc(`users/${auth.currentUser.uid}`).get();
  return user.get('accountId');
};

export const checkUserHasUserDoc = async (): Promise<boolean> => {
  if (!auth.currentUser) throw new Error('Not logged in');
  const user = await db.doc(`users/${auth.currentUser.uid}`).get();
  return !!user.data();
};

export const getUser = async (): Promise<ReturnResult<UserInfo | void>> => {
  if (!auth.currentUser) return errorResponse('Not logged in');

  try {
    const userSnap = await db.doc(`users/${auth.currentUser.uid}`).get();
    const accountId = userSnap.get('accountId');
    const accountSnap = await db.doc(`accounts/${accountId}`).get();

    const data = {
      accountId,
      email: `${auth.currentUser.email}`,
      fullName: userSnap.get('fullName'),
      orgName: accountSnap.get('orgName'),
      orgEmailDomain: accountSnap.get('orgEmailDomain'),
      orgWebsite: accountSnap.get('orgWebsite'),
      isOrgApproved: accountSnap.get('isOrgApproved'),
      xandrId: accountSnap.get('xandrId'),
      isSeller: accountSnap.get('isSeller'),
      isBuyer: accountSnap.get('isBuyer'),
    };

    return successResponse('User successfully fetched', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

export const checkUserEmailBelongsToOrganization = async (
  email: string
): Promise<ReturnResult<{ hasOrg: boolean; orgName: string } | void>> => {
  try {
    logger.log('Checking if there is an organization for email domain');

    const result = await functions.httpsCallable(
      'buyer-checkUserEmailBelongsToOrganization'
    )({ email });
    const { data } = result;

    return successResponse('Successfully checked for organization', data);
  } catch (error) {
    const { message } = error;
    return errorResponse(message);
  }
};

const postVerificationRedirectUrl = GLOBALCONFIG.redirectUrl;
export const sendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser)
    auth.currentUser.sendEmailVerification({
      url: postVerificationRedirectUrl,
    });
};

const createUser = async (
  email: string,
  password: string
): Promise<firebase.User | null> => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  if (!user) return null;
  // user authed
  sendEmailVerification();
  return user;
};

export const createUserInFirestore = async (
  email: string,
  fullName: string,
  failOnExist: boolean
): Promise<ReturnResult<unknown>> => {
  if (failOnExist) {
    const userHasDoc = await checkUserHasUserDoc();
    if (userHasDoc)
      return {
        type: 'error',
        code: 'auth/email-already-in-use',
        message: 'This email is already taken.',
      };
  }

  const {
    data,
  }: {
    data: ReturnResult<{ type: string; message?: string }>;
  } = await functions.httpsCallable('buyer-createUserInFirestore')({
    fullName,
    email,
  });

  return data;
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
  orgName: string
): Promise<ReturnResult<firebase.User>> => {
  try {
    const user = await createUser(email, password);
    if (!user) return errorResponse('Signup failed');

    functions.httpsCallable('buyer-sendSlackUserSignUp')({
      orgName,
      email,
    });

    const data = await createUserInFirestore(email, fullName, true);

    if (data.type === 'error')
      return errorResponse(
        data?.message || 'Error while creating user document'
      );

    return successResponse('Signup successful', user);
  } catch (error) {
    logger.error('Signup failed', error);
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const createOrganization = async (input: {
  orgName: string;
  orgWebsite: string;
  orgEmailDomain: string;
  accountType: 'buyer' | 'seller';
  platforms: string[];
}): Promise<ReturnResult<AccountInfo | null>> => {
  try {
    if (!auth.currentUser) return errorResponse('Not logged in');

    const { data }: { data: AccountInfo } = await functions.httpsCallable(
      'buyer-createOrganization'
    )(input);

    return successResponse('Organization creation successful', data);
  } catch (error) {
    logger.error('Organization creation failed', error);
    const { message, code } = error;
    return errorResponse(message, code);
  }
};

export const signInWithPopup = async (): Promise<
  ReturnResult<{
    userEmail: string;
    userName: string;
  } | null>
> => {
  try {
    const provider = new googleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const googleUserResult = (await auth.signInWithPopup(provider)) as {
      additionalUserInfo?: {
        profile?: { email: string; name: string } | null;
      } | null;
    };
    const userEmail = googleUserResult?.additionalUserInfo?.profile?.email;
    const userName =
      googleUserResult?.additionalUserInfo?.profile?.name || 'User';
    if (!userEmail)
      return errorResponse(
        'Email missing on user google profile',
        'auth/google-profile-missing-email'
      );
    return successResponse('Google Sign Succeeded', { userEmail, userName });
  } catch (error) {
    return errorResponse(error.message, error.code);
  }
};
