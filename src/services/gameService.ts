import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { GameRecord } from "../types/firestore";

const COLLECTION_NAME = "games";

export const saveGame = async (game: GameRecord): Promise<void> => {
  const gameRef = doc(db, COLLECTION_NAME, game.id);
  await setDoc(gameRef, {
    ...game,
    updatedAt: Date.now()
  }, { merge: true });
};

export const updateGameScore = async (
  gameId: string, 
  updates: Partial<GameRecord>
): Promise<void> => {
  const gameRef = doc(db, COLLECTION_NAME, gameId);
  await updateDoc(gameRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

export const subscribeToGame = (
  gameId: string, 
  callback: (game: GameRecord | null) => void
) => {
  const gameRef = doc(db, COLLECTION_NAME, gameId);
  return onSnapshot(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as GameRecord);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("[DIAMAX FIRESTORE] Error al suscribirse al partido:", err);
  });
};

export const getGamesByLeague = async (leagueId: string): Promise<GameRecord[]> => {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where("leagueId", "==", leagueId)
  );
  const snap = await getDoc(doc(db, COLLECTION_NAME, leagueId));
  return [];
};
