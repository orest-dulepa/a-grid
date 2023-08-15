import { reactive, computed } from 'vue';
import {
  FirebaseAuthEmailAlreadyInUse,
  FirebaseAuthEmailInvalid,
  FirebaseAuthError,
  FirebaseAuthTooManyRequests,
  FirebaseAuthWrongPassword,
} from '@/utils/firebase-errors';
import { ReturnResult } from '@/types';
import FirebaseErrorHandler from '../../../utils/firebase-errors-handler';

const filterErrorsByCode = (code?: string): FirebaseAuthError[] => {
  return this.errors.filter((t: FirebaseAuthError) => t.code === code);
};

function useErrors(success) {
  let errors: FirebaseAuthError[] = reactive([]);

  const isEmailInUse = computed((): boolean => {
    if (errors.length === 0) {
      return false;
    }
    const error = filterErrorsByCode(FirebaseAuthEmailAlreadyInUse.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  });

  const isEmailInvalid = computed((): boolean => {
    if (errors.length === 0) {
      return false;
    }
    const error = filterErrorsByCode(FirebaseAuthEmailInvalid.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  });

  const isPasswordInvalid = computed((): boolean => {
    if (errors.length === 0) {
      return false;
    }
    const error = filterErrorsByCode(FirebaseAuthWrongPassword.code);
    if (error.length) {
      return !!error[0].message;
    }
    return false;
  });

  const resetNotifications = (): void => {
    success.value = false;
    errors = [];
  };

  const isToManyAttemptsError = (error: FirebaseAuthError): boolean => {
    return error.code === FirebaseAuthTooManyRequests.code;
  };

  const processResults = (
    results: ReturnResult<void>[],
    cb?: (success: any) => void
  ): void => {
    errors = [];
    results.forEach((result: ReturnResult<void>) => {
      if (result.type !== 'success') {
        errors.push(FirebaseErrorHandler.process(result));
      }
    });

    if (errors.length === 0) {
      success.value = true;
      setTimeout(() => {
        success.value = false;

        cb && cb(success);
      }, 5000);
    }
  };

  return {
    errors,
    isEmailInUse,
    isEmailInvalid,
    isPasswordInvalid,
    resetNotifications,
    isToManyAttemptsError,
    processResults,
  };
}

export default useErrors;
