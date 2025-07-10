// src/utils/firestoreHelpers.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase'; // adjust path if needed

export const getNextUID = async () => {
  const querySnapshot = await getDocs(collection(db, 'userProfiles'));

  const ids = querySnapshot.docs.map(doc => doc.id);
  const numbers = ids
    .map(id => parseInt(id.replace('u', ''), 10))
    .filter(num => !isNaN(num));

  const max = numbers.length ? Math.max(...numbers) : 0;
  return `u${max + 1}`;
};
