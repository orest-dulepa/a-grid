import { auth, getCredential } from '../../firebase';
import { ReturnResult } from '@/types';
import { errorResponse, successResponse } from './utils';

export const updateEmail = async (
  newEmail: string,
  currentPassword: string
): Promise<ReturnResult<void>> => {
  if (!auth.currentUser || !auth.currentUser.email)
    return errorResponse('Not logged in');

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
): Promise<ReturnResult<void>> => {
  if (!auth.currentUser || !auth.currentUser.email)
    return errorResponse('Not logged in');

  try {
    const credential = getCredential(auth.currentUser.email, currentPassword);
    await auth.currentUser.reauthenticateWithCredential(credential);
    await auth.currentUser.updatePassword(newPassword);

    return successResponse('Password updated');
  } catch (error) {
    const { message, code } = error;
    return errorResponse(message, code);
  }
};
