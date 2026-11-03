import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  query,
  where,
  increment
} from "firebase/firestore";
import { db } from "../firebase";
import { 
  Commentator, 
  BroadcastSponsor, 
  SponsorTrigger 
} from "../types/commentator";

const COMMENTATORS_COLLECTION = "commentators";
const SPONSORS_COLLECTION = "broadcast_sponsors";

// ==========================================
// SERVICIOS DE COMENTARISTAS
// ==========================================

export const getCommentators = async (): Promise<Commentator[]> => {
  try {
    const snap = await getDocs(collection(db, COMMENTATORS_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Commentator));
  } catch (error) {
    console.error("[DIAMAX FIRESTORE] Error obteniendo comentaristas:", error);
    return [];
  }
};

export const subscribeToCommentators = (
  callback: (commentators: Commentator[]) => void
) => {
  return onSnapshot(collection(db, COMMENTATORS_COLLECTION), (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Commentator));
    callback(list);
  }, (err) => {
    console.error("[DIAMAX FIRESTORE] Error suscribiéndose a comentaristas:", err);
  });
};

export const getCommentator = async (id: string): Promise<Commentator | null> => {
  try {
    const snap = await getDoc(doc(db, COMMENTATORS_COLLECTION, id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Commentator;
    }
    return null;
  } catch (error) {
    console.error("[DIAMAX FIRESTORE] Error obteniendo comentarista:", error);
    return null;
  }
};

export const saveCommentator = async (commentator: Commentator): Promise<void> => {
  const commRef = doc(db, COMMENTATORS_COLLECTION, commentator.id);
  await setDoc(commRef, {
    ...commentator,
    updatedAt: Date.now()
  }, { merge: true });
};

export const updateCommentatorStatus = async (
  id: string, 
  status: 'on_air' | 'standby'
): Promise<void> => {
  const commRef = doc(db, COMMENTATORS_COLLECTION, id);
  await updateDoc(commRef, { status });
};

export const incrementPillRead = async (commentatorId: string): Promise<void> => {
  const commRef = doc(db, COMMENTATORS_COLLECTION, commentatorId);
  await updateDoc(commRef, {
    "stats.pillsRead": increment(1)
  });
};

// ==========================================
// SERVICIOS DE PATROCINIOS DE CABINA
// ==========================================

export const getSponsors = async (): Promise<BroadcastSponsor[]> => {
  try {
    const snap = await getDocs(collection(db, SPONSORS_COLLECTION));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BroadcastSponsor));
  } catch (error) {
    console.error("[DIAMAX FIRESTORE] Error obteniendo patrocinios:", error);
    return [];
  }
};

export const subscribeToSponsors = (
  callback: (sponsors: BroadcastSponsor[]) => void
) => {
  return onSnapshot(collection(db, SPONSORS_COLLECTION), (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as BroadcastSponsor));
    callback(list);
  }, (err) => {
    console.error("[DIAMAX FIRESTORE] Error suscribiéndose a patrocinios:", err);
  });
};

export const getSponsorByTrigger = async (
  trigger: SponsorTrigger
): Promise<BroadcastSponsor | null> => {
  try {
    const q = query(
      collection(db, SPONSORS_COLLECTION),
      where("triggerEvent", "==", trigger),
      where("active", "==", true)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0];
      return { id: docData.id, ...docData.data() } as BroadcastSponsor;
    }
    return null;
  } catch (error) {
    console.error("[DIAMAX FIRESTORE] Error buscando patrocinio por detonador:", error);
    return null;
  }
};

export const saveSponsor = async (sponsor: BroadcastSponsor): Promise<void> => {
  const sponsRef = doc(db, SPONSORS_COLLECTION, sponsor.id);
  await setDoc(sponsRef, sponsor, { merge: true });
};
