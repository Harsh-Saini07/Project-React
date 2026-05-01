import { create } from 'zustand'

const buildSessionId = (runId) => `KH-SCRIBE-${String(runId).padStart(3, '0')}`

const useDemoStore = create((set) => ({
  runId: 0,
  sessionId: buildSessionId(0),
  startedAt: null,
  agentCompleted: false,
  agentEvents: [],
  agentEventCursor: 0,
  agentElapsedMs: 0,
  noteCompleted: false,
  noteVisibleWordCount: 0,
  noteHasReceivedFirstToken: false,
  startDemo: () =>
    set((state) => {
      const nextRunId = state.runId + 1

      return {
        runId: nextRunId,
        sessionId: buildSessionId(nextRunId),
        startedAt: Date.now(),
        agentCompleted: false,
        agentEvents: [],
        agentEventCursor: 0,
        agentElapsedMs: 0,
        noteCompleted: false,
        noteVisibleWordCount: 0,
        noteHasReceivedFirstToken: false,
      }
    }),
  stopDemo: () =>
    set({
      runId: 0,
      sessionId: buildSessionId(0),
      startedAt: null,
      agentCompleted: false,
      agentEvents: [],
      agentEventCursor: 0,
      agentElapsedMs: 0,
      noteCompleted: false,
      noteVisibleWordCount: 0,
      noteHasReceivedFirstToken: false,
    }),
  addAgentEvent: (event) =>
    set((state) => ({
      agentEvents: state.agentEvents.some((currentEvent) => currentEvent.step === event.step)
        ? state.agentEvents.map((currentEvent) =>
            currentEvent.step === event.step ? event : currentEvent,
          )
        : [...state.agentEvents, event],
      agentEventCursor: state.agentEventCursor + 1,
    })),
  setAgentElapsedMs: (agentElapsedMs) => set({ agentElapsedMs }),
  markAgentCompleted: ({ totalElapsedMs } = {}) =>
    set((state) => ({
      agentCompleted: true,
      agentElapsedMs:
        typeof totalElapsedMs === 'number' ? totalElapsedMs : state.agentElapsedMs,
    })),
  setNoteVisibleWordCount: (noteVisibleWordCount) => set({ noteVisibleWordCount }),
  setNoteHasReceivedFirstToken: (noteHasReceivedFirstToken) =>
    set({ noteHasReceivedFirstToken }),
  markNoteCompleted: () => set({ noteCompleted: true }),
}))

export default useDemoStore
