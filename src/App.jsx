import { NavLink, Route, Routes } from 'react-router-dom'
import DemoPage from './pages/DemoPage'
import InterruptionPage from './pages/InterruptionPage'

const navLinkClassName = ({ isActive }) =>
  [
    'rounded-full border px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30'
      : 'border-slate-300/70 bg-white/75 text-slate-700 hover:border-sky-300 hover:text-sky-700',
  ].join(' ')

function App() {
  return (
    <div className="min-h-screen bg-clinical-grid text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-xl shadow-slate-200/60 backdrop-blur xl:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                KastHunt Clinical Scribe
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                AI Interaction Layer Demo
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                This brings the agent reasoning panel and the streaming SOAP note
                together so the AI feels active, observable, and clinically trustworthy.
              </p>
            </div>

            <nav className="flex flex-wrap gap-3">
              <NavLink to="/" end className={navLinkClassName}>
                Demo Workspace
              </NavLink>
              <NavLink to="/safe-zone" className={navLinkClassName}>
                Navigate Away Test
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DemoPage />} />
            <Route path="/safe-zone" element={<InterruptionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
