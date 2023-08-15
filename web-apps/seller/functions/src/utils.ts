export const getAccountId = async (
  db: FirebaseFirestore.Firestore,
  uid: string
): Promise<string> => {
  const userDoc = await db.doc(`users/${uid}`).get();
  return userDoc.get('accountId');
};
