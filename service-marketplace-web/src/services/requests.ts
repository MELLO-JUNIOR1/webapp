import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceRequest } from '@/models/types';

const COLLECTION = 'requests';

export const createRequest = async (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...request,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

export const updateRequest = async (id: string, data: Partial<ServiceRequest>) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteRequest = async (id: string) => {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
};

export const getRequest = async (id: string): Promise<ServiceRequest | null> => {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as ServiceRequest;
};

export const getCustomerRequests = async (customerId: string): Promise<ServiceRequest[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('customerId', '==', customerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ServiceRequest[];
};

export const getWorkerJobs = async (category: string): Promise<ServiceRequest[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('category', '==', category),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ServiceRequest[];
};

export const getWorkerAcceptedJobs = async (workerId: string): Promise<ServiceRequest[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('workerId', '==', workerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ServiceRequest[];
};

export const subscribeToRequest = (
  id: string,
  callback: (request: ServiceRequest | null) => void
) => {
  const docRef = doc(db, COLLECTION, id);
  return onSnapshot(docRef, (doc) => {
    if (!doc.exists()) {
      callback(null);
      return;
    }
    callback({ id: doc.id, ...doc.data() } as ServiceRequest);
  });
}; 