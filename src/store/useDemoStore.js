import { create } from 'zustand'

const buildSessionId = (runId) => `KH-SCRIBE-${String(runId).padStart(3, '0')}`

const useDemoStore = create((set) => ({
  runId: 0,
  sessionId: buildSessionId(0),
  startedAt: null,
  agentCompleted: false,
  noteCompleted: false,
  startDemo: () =>
    set((state) => {
      const nextRunId = state.runId + 1

      return {
        runId: nextRunId,
        sessionId: buildSessionId(nextRunId),
        startedAt: Date.now(),
        agentCompleted: false,
        noteCompleted: false,
      }
    }),
  markAgentCompleted: () => set({ agentCompleted: true }),
  markNoteCompleted: () => set({ noteCompleted: true }),
}))

export default useDemoStore
