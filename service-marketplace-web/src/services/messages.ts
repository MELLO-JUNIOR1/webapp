import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/models/types';

const COLLECTION = 'messages';

export const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...message,
    createdAt: new Date(),
    read: false,
  });
  return docRef.id;
};

export const markMessageAsRead = async (id: string) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    read: true,
  });
};

export const getMessages = async (requestId: string): Promise<Message[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('requestId', '==', requestId),
    orderBy('createdAt', 'asc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Message[];
};

export const getUserUnreadMessages = async (userId: string): Promise<Message[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('receiverId', '==', userId),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Message[];
};

export const subscribeToMessages = (
  requestId: string,
  callback: (messages: Message[]) => void
) => {
  const q = query(
    collection(db, COLLECTION),
    where('requestId', '==', requestId),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
}; 