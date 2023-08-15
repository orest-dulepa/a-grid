import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { logger } from '@/utils';

logger.info({ EMULATE_FIRESTORE });
logger.info({ EMULATE_FUNCTIONS });
logger.info({ EMULATE_AUTH });

firebase.initializeApp(GLOBALCONFIG.firebase);

const auth = firebase.auth();
const googleAuthProvider = firebase.auth.GoogleAuthProvider;
const getCredential = firebase.auth.EmailAuthProvider.credential;
const db = firebase.firestore();
const functions = firebase.app().functions('europe-west1');

if (window.location.hostname === 'localhost') {
  if (EMULATE_AUTH) auth.useEmulator('http://localhost:9099');
  if (EMULATE_FIRESTORE) db.useEmulator('localhost', 8081);
  if (EMULATE_FUNCTIONS) functions.useEmulator('localhost', 5001);
}

export { auth, db, googleAuthProvider, functions, getCredential };
