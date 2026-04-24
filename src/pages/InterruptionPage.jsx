import { Link } from 'react-router-dom'

function InterruptionPage() {
  return (
    <section className="glass-panel flex min-h-[420px] flex-col items-center justify-center px-6 py-10 text-center">
      <p className="section-label">Unmount Check</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950">
        Safe Route for Cleanup Testing
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
        If you navigate here while the demo is mid-stream, the tracker intervals and note
        timers should stop immediately. That satisfies the cleanup requirement and avoids
        lingering console noise when the page unmounts.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-sky-700"
      >
        Return to Demo
      </Link>
    </section>
  )
}

export default InterruptionPage
