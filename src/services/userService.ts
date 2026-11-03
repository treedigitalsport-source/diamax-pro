import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../firebase";
import { UserRecord, SubscriptionTier } from "../types/firestore";

const COLLECTION_NAME = "users";

export const createOrUpdateUser = async (user: UserRecord): Promise<void> => {
  const userRef = doc(db, COLLECTION_NAME, user.uid);
  await setDoc(userRef, {
    ...user,
    createdAt: user.createdAt || Date.now(),
    updatedAt: Date.now()
  }, { merge: true });
};

export const getUserById = async (uid: string): Promise<UserRecord | null> => {
  const userRef = doc(db, COLLECTION_NAME, uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return { uid: snap.id, ...snap.data() } as UserRecord;
  }
  return null;
};

export const updateUserSubscription = async (
  uid: string, 
  tier: SubscriptionTier, 
  trialEndsAt?: number
): Promise<void> => {
  const userRef = doc(db, COLLECTION_NAME, uid);
  const updates: Record<string, unknown> = { subscriptionTier: tier, updatedAt: Date.now() };
  if (trialEndsAt !== undefined) {
    updates.trialEndsAt = trialEndsAt;
  }
  await updateDoc(userRef, updates);
};
