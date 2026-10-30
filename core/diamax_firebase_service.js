/**
 * DIAMAX PRO - Google Firebase Sovereign Connector (Spark Plan $0 Tier)
 * Entity: 3Tree Digital Sport IA Corp.
 * Authority: Lic. Ali Jose Zapata Mendoza (Founder & Board Chairman - N6_OVERRIDE)
 * Architecture: Orion (AG-006) & Cyrus (AG-005)
 * Status: CERTIFIED_INDEPENDENT & ZERO_COST
 */

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
   * Inicializa la conexión con el proyecto Firebase en modo Spark ($0 costo)
   */
  init(firebaseConfig) {
    if (!firebaseConfig || !firebaseConfig.projectId) {
      console.warn('[DIAMAX FIREBASE] Configuración ausente. Operando en modo Offline/Local Storage.');
      return false;
    }

    try {
      if (typeof window !== 'undefined' && window.firebase) {
        if (!window.firebase.apps.length) {
          this.app = window.firebase.initializeApp(firebaseConfig);
        } else {
          this.app = window.firebase.app();
        }
        this.db = window.firebase.firestore();
        this.auth = window.firebase.auth();
        
        // Habilitar persistencia offline para dugouts y estadios con baja señal
        this.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('[DIAMAX FIREBASE] Múltiples pestañas abiertas, persistencia en pestaña principal.');
          } else if (err.code === 'unimplemented') {
            console.warn('[DIAMAX FIREBASE] Navegador no soporta persistencia offline.');
          }
        });

        this.isConnected = true;
        console.log('[DIAMAX FIREBASE] ✅ Conectado exitosamente al Spark Plan ($0 Costo Mensual).');
        return true;
      }
    } catch (e) {
      console.error('[DIAMAX FIREBASE] Error al inicializar:', e.message);
      this.isConnected = false;
    }
    return false;
  }

  /**
   * Guarda o actualiza un jugador en el roster
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
   * Registra una jugada o lanzamiento de telemetría de pitcheo/bateo
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
   * Respaldo local de contingencia en caso de falta de señal
   */
  _saveLocal(collection, data) {
    try {
      const key = `diamax_offline_${collection}`;
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      current.push({ ...data, _offlineTimestamp: Date.now() });
      localStorage.setItem(key, JSON.stringify(current));
      console.log(`[DIAMAX OFFLINE] Guardado localmente en ${collection}.`);
      return { success: true, source: 'offline_local_storage' };
    } catch (e) {
      console.error('[DIAMAX OFFLINE] Error al guardar local:', e.message);
      return { success: false, error: e.message };
    }
  }
}

export const diamaxFirebase = new DiamaxFirebaseService();
