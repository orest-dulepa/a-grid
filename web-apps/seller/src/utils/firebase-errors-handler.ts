import { Result } from '@/types';
import {
  FirebaseAuthEmailAlreadyInUse,
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
  FirebaseAuthUserNotFound,
  FirebaseAuthWrongPassword,
} from '@/utils/firebase-errors';

export default class FirebaseErrorHandler {
  static process = <T>(result: Result<T>): FirebaseAuthError => {
    if (result.type !== 'error') return {};

    return {
      code: result.code,
      message: FirebaseErrorHandler.getSpecificErrorMessage(result),
    };
  };

  static getSpecificErrorMessage = <T>(result: Result<T>): string | string[] => {
    if (result.type !== 'error') return '';
    let message: string | string[];

    switch (result.code) {
      case FirebaseAuthEmailInvalid.code:
        message = FirebaseAuthEmailInvalid.message ?? result.message;
        break;
      case FirebaseAuthEmailAlreadyInUse.code:
        message = FirebaseAuthEmailAlreadyInUse.message ?? result.message;
        break;
      case FirebaseAuthWrongPassword.code:
        message = FirebaseAuthWrongPassword.message ?? result.message;
        break;
      case FirebaseAuthUserNotFound.code:
        message = FirebaseAuthUserNotFound.message ?? result.message;
        break;
      default:
        message = result.message;
        break;
    }

    return message;
  };
}
