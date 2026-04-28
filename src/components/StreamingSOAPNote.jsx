import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SOAP_SECTIONS = [
  {
    title: 'Subjective',
    content:
      'Patient reports three days of sore throat, dry cough, and fatigue without chest pain or shortness of breath. Appetite is mildly reduced, and over the counter acetaminophen provided partial relief.',
  },
  {
    title: 'Objective',
    content:
      'Temperature 99.4 Fahrenheit, heart rate 88, blood pressure 118 over 74, oxygen saturation 98 percent on room air. Mild pharyngeal erythema present without exudate. Lungs are clear bilaterally.',
  },
  {
    title: 'Assessment',
    content:
      'Presentation is most consistent with an uncomplicated viral upper respiratory infection with mild pharyngitis. No current signs of pneumonia, dehydration, or bacterial sinusitis.',
  },
  {
    title: 'Plan',
    content:
      'Continue supportive care with hydration, salt water gargles, and acetaminophen as needed. Monitor for fever above 101, worsening cough, dyspnea, or symptoms persisting beyond seven days. Follow up with primary care if symptoms progress.',
  },
]

const ICD_SUGGESTION = 'ICD-10 Suggestion: J06.9 - Acute upper respiratory infection, Unspecified'

const tokenizedSections = SOAP_SECTIONS.map((section) => ({
  ...section,
  words: section.content.split(' '),
}))

const totalWords = tokenizedSections.reduce(
  (sum, section) => sum + section.words.length,
  0,
)

function StreamingSOAPNote({ sessionId, onComplete }) {
  const [visibleWordCount, setVisibleWordCount] = useState(0)
  const [hasReceivedFirstToken, setHasReceivedFirstToken] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)
  const firstTokenTimeoutRef = useRef(null)
  const completionNotifiedRef = useRef(false)

  const visibleSections = useMemo(() => {
    let remainingWords = visibleWordCount

    return tokenizedSections.map((section) => {
      const count = Math.max(0, Math.min(section.words.length, remainingWords))
      remainingWords -= count

      return {
        ...section,
        visibleWords: section.words.slice(0, count),
      }
    })
  }, [visibleWordCount])

  const lastVisibleSectionIndex = useMemo(
    () =>
      visibleSections.reduce(
        (lastIndex, section, index) =>
          section.visibleWords.length > 0 ? index : lastIndex,
        -1,
      ),
    [visibleSections],
  )

  const finalizeStream = () => {
    window.clearTimeout(firstTokenTimeoutRef.current)
    window.clearInterval(intervalRef.current)
    setVisibleWordCount(totalWords)
    setHasReceivedFirstToken(true)
    setIsComplete(true)

    if (!completionNotifiedRef.current) {
      completionNotifiedRef.current = true
      onComplete?.({
        sessionId,
        totalWords,
      })
    }
  }

  useEffect(() => {
    firstTokenTimeoutRef.current = window.setTimeout(() => {
      setHasReceivedFirstToken(true)

      intervalRef.current = window.setInterval(() => {
        setVisibleWordCount((current) => Math.min(current + 3, totalWords))
      }, 240)
    }, 900)

    return () => {
      window.clearTimeout(firstTokenTimeoutRef.current)
      window.clearInterval(intervalRef.current)
    }
  }, [onComplete, sessionId])

  useEffect(() => {
    if (visibleWordCount < totalWords) {
      return
    }

    window.clearInterval(intervalRef.current)
    setIsComplete(true)

    if (!completionNotifiedRef.current) {
      completionNotifiedRef.current = true
      onComplete?.({
        sessionId,
        totalWords,
      })
    }
  }, [onComplete, sessionId, visibleWordCount])

  return (
    <section className="glass-panel note-shadow flex h-full flex-col px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="section-label">Streaming SOAP Note</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950">
            Live Note Generation
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Session <span className="font-mono font-medium text-slate-900">{sessionId}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={finalizeStream}
          disabled={isComplete}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Stream / Reveal All
        </button>
      </div>

      <div className="mt-5 flex-1 overflow-hidden rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-200">
        {!hasReceivedFirstToken ? (
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-3 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-800 shadow-sm"
          >
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
            Generating your clinical note...
          </motion.div>
        ) : (
          <div className="space-y-5">
            {visibleSections.map((section, index) => {
              if (section.visibleWords.length === 0) {
                return null
              }

              const isActiveSection = index === lastVisibleSectionIndex && !isComplete

              return (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white bg-white p-4 shadow-sm"
                >
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-display text-lg font-semibold text-slate-950"
                  >
                    {section.title}
                  </motion.h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-[15px]">
                    {section.visibleWords.join(' ')}
                    {isActiveSection ? (
                      <span className="cursor-blink ml-1 inline-block h-5 w-0.5 translate-y-1 bg-sky-500 align-middle" />
                    ) : null}
                  </p>
                </motion.article>
              )
            })}

            <AnimatePresence>
              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                    Coding Assist
                  </p>
                  <p className="mt-2 text-sm font-medium text-emerald-900">
                    {ICD_SUGGESTION}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}

export default StreamingSOAPNote
