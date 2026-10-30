/**
 * DIAMAX PRO - Google Firebase Sovereign Connector (Spark Plan $0 Tier)
 * Entity: 3Tree Digital Sport IA Corp.
 * Authority: Lic. Ali Jose Zapata Mendoza (Founder & Board Chairman - N6_OVERRIDE)
 * Project ID: tree-digital-sport (Google Cloud 955378850789)
 * Security: Aegis (AG-023) & Orion (AG-006) - Zero Vulnerability Encrypted Gateway
 */

export const DIAMAX_DEFAULT_CONFIG = {
  apiKey: "AIzaSyBXVvOa0zT4YnRJ8wMBO4ty8ieOvtdzZtw",
  authDomain: "tree-digital-sport.firebaseapp.com",
  projectId: "tree-digital-sport",
  storageBucket: "tree-digital-sport.firebasestorage.app",
  messagingSenderId: "955378850789",
  appId: "1:955378850789:web:a2fd07ccab38f67e576d0c",
  measurementId: "G-3XGXE48BPL"
};

export class DiamaxFirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.isConnected = false;
    this.collectionRoster = 'diamax_roster';
    this.collectionGames = 'diamax_games';
    this.collectionTelemetry = 'diamax_telemetry';
  }

  /**
   * Inicializa la conexión segura con el proyecto oficial de Google Firebase
   */
  init(customConfig = null) {
    const config = customConfig || DIAMAX_DEFAULT_CONFIG;

    if (!config || !config.projectId) {
      console.warn('[DIAMAX FIREBASE] Configuración ausente. Operando en modo Offline/Local Storage.');
      return false;
    }

    try {
      if (typeof window !== 'undefined' && window.firebase) {
        if (!window.firebase.apps.length) {
          this.app = window.firebase.initializeApp(config);
        } else {
          this.app = window.firebase.app();
        }
        this.db = window.firebase.firestore();
        this.auth = window.firebase.auth();

        // Blindaje Offline para estadios y dugouts con señal débil
        this.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.info('[DIAMAX FIREBASE] Pestaña secundaria en ejecución, persistencia activa.');
          } else if (err.code === 'unimplemented') {
            console.warn('[DIAMAX FIREBASE] El navegador no soporta persistencia offline.');
          }
        });

        this.isConnected = true;
        console.log('[DIAMAX FIREBASE] 🟢 Conectado exitosamente a tree-digital-sport ($0 Spark Tier).');
        return true;
      }
    } catch (e) {
      console.error('[DIAMAX FIREBASE] Error controlado de inicialización:', e.message);
      this.isConnected = false;
    }
    return false;
  }

  /**
   * Guarda o actualiza un jugador en el roster oficial
   */
  async savePlayer(playerData) {
    if (!this.isConnected || !this.db) {
      return this._saveLocal(this.collectionRoster, playerData);
    }
    const docId = playerData.id || `player_${Date.now()}`;
    await this.db.collection(this.collectionRoster).doc(docId).set({
      ...playerData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, id: docId, source: 'firestore_cloud' };
  }

  /**
   * Registra una jugada o telemetría de pitcheo/bateo
   */
  async logTelemetry(pitchData) {
    if (!this.isConnected || !this.db) {
      return this._saveLocal(this.collectionTelemetry, pitchData);
    }
    const ref = await this.db.collection(this.collectionTelemetry).add({
      ...pitchData,
      timestamp: new Date().toISOString()
    });
    return { success: true, id: ref.id, source: 'firestore_cloud' };
  }

  /**
   * Respaldo local de contingencia en caso de desconexión en dugout
   */
  _saveLocal(collection, data) {
    try {
      const key = `diamax_offline_${collection}`;
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      current.push({ ...data, _offlineTimestamp: Date.now() });
      localStorage.setItem(key, JSON.stringify(current));
      console.log(`[DIAMAX OFFLINE] Guardado en bóveda local: ${collection}`);
      return { success: true, source: 'offline_local_storage' };
    } catch (e) {
      console.error('[DIAMAX OFFLINE] Error al guardar local:', e.message);
      return { success: false, error: e.message };
    }
  }
}

export const diamaxFirebase = new DiamaxFirebaseService();
