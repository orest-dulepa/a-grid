export type FirebaseAuthError = {
  code?: string;
  message?: string | string[];
};

export const FirebaseAuthWrongPassword: FirebaseAuthError = {
  code: 'auth/wrong-password',
};

export const FirebaseAuthUserNotFound: FirebaseAuthError = {
  code: 'auth/user-not-found',
  message: ['There is no user with this email.', 'The user may have been deleted.'],
};

export const FirebaseAuthEmailInvalid: FirebaseAuthError = {
  code: 'auth/invalid-email',
  message: 'The email address is badly formatted.',
};

export const FirebaseAuthEmailAlreadyInUse: FirebaseAuthError = {
  code: 'auth/email-already-in-use',
  message: 'This email is already taken.',
};

export const FirebaseAuthTooManyRequests: FirebaseAuthError = {
  code: 'auth/too-many-requests',
};
