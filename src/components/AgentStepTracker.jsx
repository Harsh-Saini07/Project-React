import { useEffect, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useDemoStore from '../store/useDemoStore'

const FAKE_AGENT_EVENTS = [
  {
    step: 'Searching clinical guidelines',
    status: 'running',
    duration_ms: 420,
  },
  {
    step: 'Searching clinical guidelines',
    status: 'complete',
    duration_ms: 1180,
  },
  {
    step: 'Extracting symptoms and vitals',
    status: 'complete',
    duration_ms: 930,
  },
  {
    step: 'Drafting assessment and differential',
    status: 'complete',
    duration_ms: 1470,
  },
  {
    step: 'Finalizing SOAP narrative',
    status: 'complete',
    duration_ms: 1610,
  },
]

const formatElapsed = (value) => `${(value / 1000).toFixed(1)}s`
const TOTAL_AGENT_STEPS = new Set(FAKE_AGENT_EVENTS.map((event) => event.step)).size

function StepStatusIcon({ status }) {
  if (status === 'running') {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-200 bg-sky-50">
        <span className="spinner-ring h-4 w-4 rounded-full border-2 border-sky-500 border-t-transparent" />
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-lg font-bold text-rose-600">
        ×
      </span>
    )
  }

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
      ✓
    </span>
  )
}

function AgentStepTracker({ onComplete }) {
  const runId = useDemoStore((state) => state.runId)
  const events = useDemoStore((state) => state.agentEvents)
  const eventCursor = useDemoStore((state) => state.agentEventCursor)
  const elapsedMs = useDemoStore((state) => state.agentElapsedMs)
  const agentCompleted = useDemoStore((state) => state.agentCompleted)
  const eventIntervalRef = useRef(null)
  const elapsedIntervalRef = useRef(null)
  const completionNotifiedRef = useRef(false)
  const elapsedBaselineRef = useRef(0)
  const resumeStartedAtRef = useRef(0)

  useEffect(() => {
    if (runId === 0 || agentCompleted) {
      return undefined
    }

    elapsedBaselineRef.current = useDemoStore.getState().agentElapsedMs
    resumeStartedAtRef.current = Date.now()

    const persistElapsed = () => {
      const totalElapsedMs =
        elapsedBaselineRef.current + (Date.now() - resumeStartedAtRef.current)

      useDemoStore.getState().setAgentElapsedMs(totalElapsedMs)
      return totalElapsedMs
    }

    elapsedIntervalRef.current = window.setInterval(() => {
      persistElapsed()
    }, 100)

    eventIntervalRef.current = window.setInterval(() => {
      const { agentEventCursor, agentEvents, addAgentEvent, markAgentCompleted } =
        useDemoStore.getState()
      const nextEvent = FAKE_AGENT_EVENTS[agentEventCursor]

      if (!nextEvent) {
        window.clearInterval(eventIntervalRef.current)
        return
      }

      const nextEvents = agentEvents.some((event) => event.step === nextEvent.step)
        ? agentEvents.map((event) => (event.step === nextEvent.step ? nextEvent : event))
        : [...agentEvents, nextEvent]
      addAgentEvent(nextEvent)

      const isFinished = agentEventCursor + 1 === FAKE_AGENT_EVENTS.length

      if (!isFinished || completionNotifiedRef.current) {
        return
      }

      completionNotifiedRef.current = true
      const totalElapsedMs = persistElapsed()
      const payload = {
        totalElapsedMs,
        events: nextEvents,
      }

      markAgentCompleted({ totalElapsedMs })
      window.clearInterval(eventIntervalRef.current)
      window.clearInterval(elapsedIntervalRef.current)
      window.dispatchEvent(
        new CustomEvent('agent-steps-complete', {
          detail: payload,
        }),
      )
      onComplete?.(payload)
    }, 1500)

    return () => {
      persistElapsed()
      window.clearInterval(eventIntervalRef.current)
      window.clearInterval(elapsedIntervalRef.current)
    }
  }, [agentCompleted, onComplete, runId])

  useEffect(() => {
    completionNotifiedRef.current = false
  }, [runId])

  const completedCount = useMemo(
    () => events.filter((event) => event.status === 'complete').length,
    [events],
  )

  return (
    <section className="flex h-full flex-col rounded-[30px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white shadow-2xl shadow-slate-900/20 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="section-label text-sky-300">Agent Progress</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
            Reasoning Trace
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-300">
            Simulated agent events arrive every 1.5 seconds to mirror a live
            orchestration feed before Socket.io is wired up.
          </p>
        </div>

        <div className="status-pill border-white/15 bg-white/5 text-slate-200">
          <span>{completedCount}</span>
          <span>/</span>
          <span>{TOTAL_AGENT_STEPS}</span>
          <span>steps completed</span>
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-hidden">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <motion.div
              key="agent-waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300"
            >
              Waiting for the run to begin. When you press START, the AI reasoning
              trail will populate here.
            </motion.div>
          ) : (
            events.map((event, index) => (
              <motion.article
                key={`${event.step}-${event.status}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <StepStatusIcon status={event.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{event.step}</p>
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]',
                          event.status === 'complete'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : event.status === 'error'
                              ? 'bg-rose-500/15 text-rose-300'
                              : 'bg-sky-500/15 text-sky-300',
                        ].join(' ')}
                      >
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-xs text-slate-400">
                      duration {event.duration_ms} ms
                    </p>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-slate-300">Total elapsed time</span>
          <span className="font-mono text-base text-white">{formatElapsed(elapsedMs)}</span>
        </div>
      </div>
    </section>
  )
}

export default AgentStepTracker
