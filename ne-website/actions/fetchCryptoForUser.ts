
import { db } from '@/firebase';
import { collection, getDoc, getDocs } from 'firebase/firestore';

export async function fetchCryptoForUser(uid: string) {
  try {
    const docRef = collection(db, 'users', uid, 'tokens');
    const tokensSnapshot  = await getDocs(docRef);

    console.log('fetchCryptoForUser', tokensSnapshot.docs);
    if (tokensSnapshot .size > 0) {
      return tokensSnapshot.docs.map(doc => doc.data());
    } else {
      return {
        message: 'No data found for this user.',
      };
    }
  } catch (error) {
    return {
      message: 'An error occurred while fetching user data.',
      error,
    };
  }
}