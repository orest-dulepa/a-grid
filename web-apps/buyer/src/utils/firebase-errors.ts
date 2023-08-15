export type FirebaseAuthError = {
  code?: string;
  message?: string | string[];
};

export const FirebaseAuthWrongPassword: FirebaseAuthError = {
  code: 'auth/wrong-password',
};

export const FirebaseAuthUserNotFound: FirebaseAuthError = {
  code: 'auth/user-not-found',
  message: [
    'There is no user with this email.',
    'The user may have been deleted.',
  ],
};

export const FirebaseAuthEmailInvalid: FirebaseAuthError = {
  code: 'auth/invalid-email',
  message: 'Please enter a valid e-mail address',
};

export const FirebaseAuthEmailAlreadyInUse: FirebaseAuthError = {
  code: 'auth/email-already-in-use',
  message: 'This email is already taken.',
};

export const FirebaseAuthGoogleProfileEmailMissing: FirebaseAuthError = {
  code: 'auth/google-profile-missing-email',
  message: 'Missing email from google auth response',
};

export const FirebaseAuthTooManyRequests: FirebaseAuthError = {
  code: 'auth/too-many-requests',
};
