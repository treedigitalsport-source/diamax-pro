/**
 * DIAMAX PRO — Dual-Mode Undo Engine v1.2
 * 3Tree Digital Sport IA · CEO Alí Zapata · Lutz, Florida USA
 * Manejo formal de PENDING_LOCAL (discard) y CANONICAL_REVERT (compensating event)
 */

const { EventStore } = require('./diamax_event_core.js');
const { projectGameStateWithReverts } = require('./diamax_projector_revert.js');

class UndoEngine {
  constructor(eventStore, initialConfig = {}) {
    this.eventStore = eventStore;
    this.redoStack = [];
    this.initialConfig = initialConfig;
  }

  /**
   * Ejecuta UNDO diferenciando PENDING de CANONICAL
   */
  undo() {
    const allEvents = this.eventStore.getAll();
    if (allEvents.length === 0) {
      return {
        success: false,
        undoMode: null,
        revertedEvent: null,
        newState: projectGameStateWithReverts([], this.initialConfig),
        remainingEventsCount: 0,
        canUndoAgain: false,
        canRedo: this.redoStack.length > 0
      };
    }

    const lastEvent = allEvents[allEvents.length - 1];

    // MODO 1: PENDING_LOCAL -> Remueve de memoria/cola local de forma segura
    if (lastEvent.orderingStatus === 'PENDING') {
      const removed = this.eventStore.removeLastLocalPending();
      if (removed) {
        this.redoStack.push({ mode: 'PENDING_LOCAL', event: removed });
      }

      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        undoMode: 'PENDING_LOCAL',
        revertedEvent: removed,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndoAgain: this.eventStore.getAll().length > 0,
        canRedo: true
      };
    }

    // MODO 2: CANONICAL_REVERT -> Nunca elimina el evento; emite un evento canónico compensatorio
    if (lastEvent.orderingStatus === 'CANONICAL') {
      const revertEvent = {
        id: 'rev-' + Math.random().toString(36).substr(2, 9),
        gameId: lastEvent.gameId,
        clientEventId: 'c-rev-' + Math.random().toString(36).substr(2, 9),
        seq: (lastEvent.seq || allEvents.length) + 1,
        orderingStatus: 'CANONICAL',
        clientTimestamp: Date.now(),
        tenantId: lastEvent.tenantId,
        inning: lastEvent.inning,
        half: lastEvent.half,
        outsBefore: lastEvent.outsBefore,
        countBefore: { ...lastEvent.countBefore },
        basesBefore: { ...lastEvent.basesBefore },
        eventType: 'EVENT_REVERT',
        result: {
          code: 'EVENT_REVERT',
          description: `Compensación/Reversión de Evento Canónico ${lastEvent.id}`,
          targetEventId: lastEvent.id,
          outsRecorded: 0,
          runsScored: [],
          rbi: 0
        },
        basesAfter: { ...lastEvent.basesBefore },
        outsAfter: lastEvent.outsBefore,
        countAfter: { ...lastEvent.countBefore },
        isHalfInningEnd: false
      };

      // Guarda el evento compensatorio en el EventStore (conservando la historia intacta)
      this.eventStore.append(revertEvent);
      this.redoStack.push({ mode: 'CANONICAL_REVERT', targetEvent: lastEvent, revertEventId: revertEvent.id });

      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        undoMode: 'CANONICAL_REVERT',
        revertedEvent: lastEvent,
        revertEvent,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndoAgain: true,
        canRedo: true
      };
    }
  }

  /**
   * Ejecuta REDO
   */
  redo() {
    if (this.redoStack.length === 0) {
      return {
        success: false,
        reappliedEvent: null,
        newState: projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig),
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: this.eventStore.getAll().length > 0,
        canRedoAgain: false
      };
    }

    const item = this.redoStack.pop();

    if (item.mode === 'PENDING_LOCAL') {
      // Reinserta el evento pendiente
      this.eventStore.append(item.event);
      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        reappliedEvent: item.event,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: true,
        canRedoAgain: this.redoStack.length > 0
      };
    }

    if (item.mode === 'CANONICAL_REVERT') {
      // Para un evento canónico, emite una nueva acción reactivada con nuevo clientEventId
      const newAction = {
        ...item.targetEvent,
        id: 'reactivate-' + Math.random().toString(36).substr(2, 9),
        clientEventId: 'c-reactivate-' + Math.random().toString(36).substr(2, 9),
        seq: this.eventStore.getAll().length + 1,
        clientTimestamp: Date.now()
      };
      this.eventStore.append(newAction);
      const newState = projectGameStateWithReverts(this.eventStore.getAll(), this.initialConfig);
      return {
        success: true,
        reappliedEvent: newAction,
        newState,
        remainingEventsCount: this.eventStore.getAll().length,
        canUndo: true,
        canRedoAgain: this.redoStack.length > 0
      };
    }
  }

  getHistory() {
    return this.eventStore.getAll();
  }
}

module.exports = {
  UndoEngine
};
