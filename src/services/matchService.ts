import { 
  doc, 
  collection, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { MatchState, PlayRecord } from "../types/baseball";

export const subscribeToMatch = (matchId: string, callback: (match: MatchState | null) => void) => {
  const matchRef = doc(db, "matches", matchId);
  return onSnapshot(matchRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as MatchState);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error al sincronizar partido:", error);
  });
};

export const updateMatchScore = async (matchId: string, updates: Partial<MatchState>) => {
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const recordPlayEvent = async (matchId: string, play: PlayRecord) => {
  const playsCollection = collection(db, "matches", matchId, "plays");
  await addDoc(playsCollection, {
    ...play,
    createdAt: serverTimestamp()
  });
};
