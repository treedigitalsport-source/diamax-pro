import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "../firebase";
import { SimulationRecord } from "../types/firestore";

const COLLECTION_NAME = "simulations";

export const recordSimulation = async (sim: SimulationRecord): Promise<void> => {
  const simRef = doc(db, COLLECTION_NAME, sim.id);
  await setDoc(simRef, {
    ...sim,
    createdAt: sim.createdAt || Date.now()
  });
};

export const getSimulationById = async (id: string): Promise<SimulationRecord | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as SimulationRecord;
  }
  return null;
};

export const getLatestSimulationsForGame = async (
  gameId: string, 
  maxCount = 5
): Promise<SimulationRecord[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("gameId", "==", gameId),
    limit(maxCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as SimulationRecord));
};
