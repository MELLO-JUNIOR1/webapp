import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Rating } from '@/models/types';

const COLLECTION = 'ratings';

export const createRating = async (rating: Omit<Rating, 'id' | 'createdAt'>) => {
  // Start a transaction to create the rating and update the user's average rating
  await runTransaction(db, async (transaction) => {
    // Create the rating
    const ratingRef = doc(collection(db, COLLECTION));
    transaction.set(ratingRef, {
      ...rating,
      createdAt: new Date(),
    });

    // Get the user's current ratings
    const userRef = doc(db, 'users', rating.toUserId);
    const userDoc = await transaction.get(userRef);
    const userData = userDoc.data();

    // Calculate new rating average
    const currentRating = userData?.rating || 0;
    const totalRatings = userData?.totalRatings || 0;
    const newTotalRatings = totalRatings + 1;
    const newRating = ((currentRating * totalRatings) + rating.rating) / newTotalRatings;

    // Update the user's rating
    transaction.update(userRef, {
      rating: newRating,
      totalRatings: newTotalRatings,
    });
  });
};

export const getUserRatings = async (userId: string): Promise<Rating[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('toUserId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Rating[];
};

export const getRequestRating = async (requestId: string): Promise<Rating | null> => {
  const q = query(
    collection(db, COLLECTION),
    where('requestId', '==', requestId)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Rating;
}; 