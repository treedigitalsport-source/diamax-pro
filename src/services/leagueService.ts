import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { LeagueRecord } from "../types/firestore";

const COLLECTION_NAME = "leagues";

export const createOrUpdateLeague = async (league: LeagueRecord): Promise<void> => {
  const leagueRef = doc(db, COLLECTION_NAME, league.id);
  await setDoc(leagueRef, {
    ...league,
    createdAt: league.createdAt || Date.now(),
    updatedAt: Date.now()
  }, { merge: true });
};

export const getLeagueById = async (id: string): Promise<LeagueRecord | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as LeagueRecord;
  }
  return null;
};

export const getLeaguesByAdmin = async (adminId: string): Promise<LeagueRecord[]> => {
  const q = query(collection(db, COLLECTION_NAME), where("adminId", "==", adminId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as LeagueRecord));
};
