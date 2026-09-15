/**
 * DIAMAX PRO — Turso Offline-First Service
 * 3Tree Digital Sport IA · CEO Alí Zapata
 * Incluir en index.html via <script src="turso/diamax-turso-service.js"></script>
 */

const DiamaxTursoService = (function() {
  let _client = null;
  let _isOnline = navigator.onLine;
  const OFFLINE_QUEUE_KEY = "diamax_offline_queue";
  const CONFIG_KEY = "diamax_turso_config";

  // ── Utilidades ──────────────────────────────────────────────
  function generateId() {
    return "dmx_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  function getQueue() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]"); }
    catch(e) { return []; }
  }

  function saveQueue(q) {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(q));
  }

  function queueAction(action, table, data) {
    const q = getQueue();
    q.push({ id: generateId(), action, table, data, timestamp: new Date().toISOString() });
    saveQueue(q);
    console.log("[DIAMAX Turso] Acción en cola offline:", action, table);
  }

  function showToast(msg, color) {
    if (typeof mostrarToast === "function") { mostrarToast(msg); return; }
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:" + (color||"#00F2FE") + ";color:#000;padding:10px 20px;border-radius:20px;z-index:99999;font-weight:700;font-size:13px;";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  // ── Inicialización ──────────────────────────────────────────
  async function init(dbUrl, authToken) {
    try {
      // Guardar config
      if (dbUrl && authToken) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify({ dbUrl, authToken }));
      }
      const config = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}");
      if (!config.dbUrl || !config.authToken) {
        console.warn("[DIAMAX Turso] No configurado. Ejecute DiamaxTursoService.configure(url, token)");
        return false;
      }
      // Cargar libSQL client desde CDN
      if (typeof createClient === "undefined") {
        await loadScript("https://cdn.jsdelivr.net/npm/@libsql/client@0.5.6/web/index.js");
      }
      _client = createClient({ url: config.dbUrl, authToken: config.authToken });
      console.log("[DIAMAX Turso] ✅ Conectado a:", config.dbUrl);
      showToast("⚾ DIAMAX: BD Offline Conectada");
      return true;
    } catch(e) {
      console.error("[DIAMAX Turso] Error de conexión:", e);
      return false;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.type = "module"; s.src = src;
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function configure(dbUrl, authToken) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ dbUrl, authToken }));
    return init(dbUrl, authToken);
  }

  // ── Guardar juego ────────────────────────────────────────────
  async function saveGame(gameData) {
    const id = gameData.id || generateId();
    const data = { ...gameData, id,
      innings_us: JSON.stringify(gameData.innings_us || []),
      innings_them: JSON.stringify(gameData.innings_them || []),
      synced: 0
    };
    if (!_client || !_isOnline) {
      queueAction("UPSERT", "games", data);
      // Guardar en localStorage como respaldo inmediato
      const localGames = JSON.parse(localStorage.getItem("diamax_turso_games") || "{}");
      localGames[id] = data;
      localStorage.setItem("diamax_turso_games", JSON.stringify(localGames));
      return id;
    }
    try {
      await _client.execute({
        sql: `INSERT OR REPLACE INTO games (id, home_team, away_team, game_date, status,
              innings_us, innings_them, total_us, total_them, total_innings, current_inning, synced)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,0)`,
        args: [id, data.home_team||"Nosotros", data.away_team||"Rivales",
               data.game_date||new Date().toISOString(), data.status||"IN_PROGRESS",
               data.innings_us, data.innings_them,
               data.total_us||0, data.total_them||0,
               data.total_innings||9, data.current_inning||1]
      });
      return id;
    } catch(e) {
      console.error("[DIAMAX Turso] saveGame error:", e);
      queueAction("UPSERT", "games", data);
      return id;
    }
  }

  // ── Guardar pitcheo ─────────────────────────────────────────
  async function savePitch(pitchData) {
    const id = generateId();
    const data = { ...pitchData, id, synced: 0 };
    if (!_client || !_isOnline) {
      queueAction("INSERT", "pitches", data);
      return id;
    }
    try {
      await _client.execute({
        sql: `INSERT INTO pitches (id, at_bat_id, game_id, pitch_type, velocity, is_strike, result, sequence_num, zone, synced)
             VALUES (?,?,?,?,?,?,?,?,?,0)`,
        args: [id, data.at_bat_id||"", data.game_id||"",
               data.pitch_type||"4-Seam", data.velocity||null,
               data.is_strike ? 1 : 0, data.result||"",
               data.sequence_num||1, data.zone||null]
      });
      return id;
    } catch(e) {
      queueAction("INSERT", "pitches", data);
      return id;
    }
  }

  // ── Guardar turno al bate ────────────────────────────────────
  async function saveAtBat(atBatData) {
    const id = generateId();
    const data = { ...atBatData, id, synced: 0 };
    if (!_client || !_isOnline) {
      queueAction("INSERT", "at_bats", data);
      return id;
    }
    try {
      await _client.execute({
        sql: `INSERT INTO at_bats (id, game_id, inning_id, batter_name, pitcher_name, result, balls, strikes, rbi, synced)
             VALUES (?,?,?,?,?,?,?,?,?,0)`,
        args: [id, data.game_id||"", data.inning_id||"",
               data.batter_name||"", data.pitcher_name||"",
               data.result||"", data.balls||0, data.strikes||0, data.rbi||0]
      });
      return id;
    } catch(e) {
      queueAction("INSERT", "at_bats", data);
      return id;
    }
  }

  // ── Actualizar carreras por inning ───────────────────────────
  async function updateInningRuns(gameId, inningNum, runsUs, runsThem) {
    const id = generateId();
    if (!_client || !_isOnline) {
      queueAction("UPSERT", "inning_runs", { id, game_id: gameId, inning_number: inningNum, runs_us: runsUs, runs_them: runsThem });
      return;
    }
    try {
      await _client.execute({
        sql: `INSERT OR REPLACE INTO inning_runs (id, game_id, inning_number, runs_us, runs_them, synced)
             VALUES (?,?,?,?,?,0)`,
        args: [id, gameId, inningNum, runsUs, runsThem]
      });
    } catch(e) {
      queueAction("UPSERT", "inning_runs", { id, game_id: gameId, inning_number: inningNum, runs_us: runsUs, runs_them: runsThem });
    }
  }

  // ── Sincronizar cola offline ─────────────────────────────────
  async function syncOfflineQueue() {
    if (!_client) { await init(); }
    if (!_client) { console.warn("[DIAMAX Turso] No hay cliente para sincronizar"); return; }
    const q = getQueue();
    if (q.length === 0) return;
    console.log("[DIAMAX Turso] Sincronizando", q.length, "acciones offline...");
    showToast("📡 Sincronizando " + q.length + " eventos offline...", "#FFC72C");
    const remaining = [];
    for (const item of q) {
      try {
        if (item.table === "pitches") await savePitch(item.data);
        else if (item.table === "at_bats") await saveAtBat(item.data);
        else if (item.table === "games") await saveGame(item.data);
        else if (item.table === "inning_runs") {
          const d = item.data;
          await updateInningRuns(d.game_id, d.inning_number, d.runs_us, d.runs_them);
        }
      } catch(e) {
        remaining.push(item);
      }
    }
    saveQueue(remaining);
    if (remaining.length === 0) {
      showToast("✅ Sincronización completada", "#22C55E");
    } else {
      showToast("⚠️ " + remaining.length + " eventos pendientes", "#EF4444");
    }
  }

  // ── Listeners de conectividad ────────────────────────────────
  window.addEventListener("online", () => {
    _isOnline = true;
    console.log("[DIAMAX Turso] 📶 Conexión restaurada. Sincronizando...");
    showToast("📶 Conexión restaurada — Sincronizando datos...", "#22C55E");
    setTimeout(syncOfflineQueue, 1500);
  });

  window.addEventListener("offline", () => {
    _isOnline = false;
    console.log("[DIAMAX Turso] 📴 Sin conexión. Modo offline activado.");
    showToast("📴 Sin internet — Modo Dugout Offline activado", "#F59E0B");
  });

  // API Pública
  return {
    init, configure,
    saveGame, savePitch, saveAtBat, updateInningRuns,
    syncOfflineQueue,
    isOnline: () => _isOnline,
    getQueueSize: () => getQueue().length,
    clearQueue: () => saveQueue([]),
  };
})();

// Auto-inicializar si hay config guardada
document.addEventListener("DOMContentLoaded", function() {
  DiamaxTursoService.init();
});