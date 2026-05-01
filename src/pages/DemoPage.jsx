import { useMemo } from 'react'
import AgentStepTracker from '../components/AgentStepTracker'
import StreamingSOAPNote from '../components/StreamingSOAPNote'
import useDemoStore from '../store/useDemoStore'

function DemoPlaceholder({ title, description, variant }) {
  return (
    <div
      className={[
        'flex h-full min-h-[420px] flex-col items-center justify-center rounded-[30px] border border-dashed p-8 text-center',
        variant === 'dark'
          ? 'border-white/15 bg-slate-950 text-slate-300'
          : 'border-slate-300/80 bg-white/75 text-slate-600',
      ].join(' ')}
    >
      <p
        className={[
          'text-xs font-semibold uppercase tracking-[0.28em]',
          variant === 'dark' ? 'text-sky-300' : 'text-sky-700',
        ].join(' ')}
      >
        Ready State
      </p>
      <h3
        className={[
          'mt-3 font-display text-2xl font-semibold',
          variant === 'dark' ? 'text-white' : 'text-slate-950',
        ].join(' ')}
      >
        {title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-7">{description}</p>
    </div>
  )
}

function DemoPage() {
  const {
    runId,
    sessionId,
    startedAt,
    agentCompleted,
    noteCompleted,
    startDemo,
    stopDemo,
    markAgentCompleted,
    markNoteCompleted,
  } = useDemoStore()

  const runStatus = useMemo(() => {
    if (runId === 0) {
      return 'Idle'
    }

    if (agentCompleted && noteCompleted) {
      return 'Completed'
    }

    return 'In Progress'
  }, [agentCompleted, noteCompleted, runId])

  return (
    <div className="space-y-6">
      <section className="glass-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Demo Page: Agent reasoning on the left, SOAP note on the right
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Press START to mount both components together. The tracker begins firing
              simulated agent events while the SOAP note streams in three-word chunks.
              Use STOP to clear the active run and return the workspace to its idle state.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startDemo}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              {runId === 0 ? 'START' : 'Restart Session'}
            </button>
            <button
              type="button"
              onClick={stopDemo}
              disabled={runId === 0}
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
            >
              Stop
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Run Status
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{runStatus}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Session ID
            </p>
            <p className="mt-2 font-mono text-lg font-semibold text-slate-950">{sessionId}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Started
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {startedAt ? new Date(startedAt).toLocaleTimeString() : 'Not started yet'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,1.12fr]">
        <div className="min-h-[420px]">
          {runId === 0 ? (
            <DemoPlaceholder
              title="AgentStepTracker"
              description="The AI reasoning feed will appear here with fade-in steps, status indicators, and live elapsed timing."
              variant="dark"
            />
          ) : (
            <AgentStepTracker key={`agent-${runId}`} onComplete={markAgentCompleted} />
          )}
        </div>

        <div className="min-h-[420px]">
          {runId === 0 ? (
            <DemoPlaceholder
              title="StreamingSOAPNote"
              description="The note panel will stream a SOAP note section by section, then reveal the ICD-10 suggestion when complete."
              variant="light"
            />
          ) : (
            <StreamingSOAPNote
              key={`note-${runId}`}
              sessionId={sessionId}
              onComplete={markNoteCompleted}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default DemoPage
