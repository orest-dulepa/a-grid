import { ReturnResult } from '@/types';
import { errorResponse, successResponse } from '@/store/api/utils';
import { auth, db, functions } from '@/firebase';
import firebase from 'firebase';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export * from './auth';
export * from './analytics';
export * from './audiences';

export const sendErrorNotification = async (
  title: string,
  message: string
): Promise<ReturnResult<void>> => {
  try {
    if (!auth.currentUser)
      return { type: 'error', message: 'No user logged in' };

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
): Promise<ReturnResult<void>> => {
  try {
    if (!auth.currentUser)
      return { type: 'error', message: 'No user logged in' };

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

const getAccount = async (uid: string): Promise<DocumentSnapshot> => {
  const userDoc = await db.doc(`users/${uid}`).get();
  return await db.doc(`accounts/${userDoc.get('accountId')}`).get();
};
