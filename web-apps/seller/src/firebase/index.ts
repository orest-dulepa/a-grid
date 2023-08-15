import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { logger } from '@/utils/logger';

declare const EMULATE_FIRESTORE: boolean;
declare const EMULATE_FUNCTIONS: boolean;
declare const EMULATE_AUTH: boolean;

logger.info({ EMULATE_FIRESTORE });
logger.info({ EMULATE_FUNCTIONS });
logger.info({ EMULATE_AUTH });

firebase.initializeApp(GLOBALCONFIG.firebase);

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.app().functions('europe-west1');
const { increment } = firebase.firestore.FieldValue;
const getCredential = firebase.auth.EmailAuthProvider.credential;

if (window.location.hostname === 'localhost') {
  if (EMULATE_AUTH) auth.useEmulator('http://localhost:9099');
  if (EMULATE_FIRESTORE) db.useEmulator('localhost', 8081);
  if (EMULATE_FUNCTIONS) functions.useEmulator('localhost', 5001);
}

export { auth, db, functions, increment, getCredential };
