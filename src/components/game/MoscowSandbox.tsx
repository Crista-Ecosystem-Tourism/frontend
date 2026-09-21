import { useEffect, useState } from 'react'
import { BookOpenCheck, CheckCircle2, Compass } from 'lucide-react'
import { ApiError } from '@/api/chatApi'
import { getMoscowSandbox, type MoscowSandboxState } from '@/api/gameApi'
import { Chip, GlassPanel } from '@/components/ui/glass'

/** Review content becomes available only after the server has issued the city stamp. */
export function MoscowSandbox({
  signedIn,
  refreshKey,
}: {
  signedIn: boolean
  refreshKey: number
}) {
  const [state, setState] = useState<MoscowSandboxState | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!signedIn) return
    let active = true
    getMoscowSandbox()
      .then((result) => {
        if (!active) return
        setState(result)
        setError(null)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        if (requestError instanceof ApiError && requestError.status === 409) {
          setState(null)
          setError(null)
          return
        }
        setError(requestError instanceof ApiError ? requestError.message : 'не удалось открыть песочницу')
      })
    return () => { active = false }
  }, [refreshKey, signedIn])

  if (!signedIn) return null
  if (error) {
    return (
      <GlassPanel variant="flat" className="border-danger/30 p-4 font-sans text-sm text-text-secondary">
        Песочница Москвы пока недоступна: {error}.
      </GlassPanel>
    )
  }
  if (!state) return null

  return (
    <GlassPanel variant="flat" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-sans text-xs uppercase tracking-wide text-text-muted">Свободное исследование</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-text">Песочница Москвы</h2>
          <p className="mt-2 max-w-2xl font-sans text-sm leading-6 text-text-secondary">
            Городской круг завершён. Возвращайся к фактам, проверяй себя вопросами и открывай первоисточники без новых наград и списания энергии.
          </p>
        </div>
        <Chip size="sm" variant="active"><CheckCircle2 /> {state.city_stamp.title}</Chip>
      </div>
      <div className="mt-5 space-y-3">
        {state.lessons.map((lesson) => (
          <details key={lesson.id} className="rounded-md border border-white/10 bg-panel-2/60 p-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 font-sans text-sm font-medium text-text">
              <Compass className="h-4 w-4 text-primary" /> {lesson.position}. {lesson.title}
            </summary>
            <div className="mt-4 space-y-3 pl-7">
              <p className="font-sans text-sm leading-6 text-text-secondary">{lesson.fact.text}</p>
              <p className="font-sans text-sm leading-6 text-text-secondary">{lesson.explanation}</p>
              <p className="font-display text-base font-semibold text-text">Проверь себя: {lesson.question.text}</p>
              <a className="inline-flex items-center gap-2 font-sans text-xs text-primary hover:underline" href={lesson.fact.source_url} target="_blank" rel="noreferrer">
                <BookOpenCheck className="h-4 w-4" /> Источник: {lesson.fact.source_label ?? 'Открыть источник'}
              </a>
            </div>
          </details>
        ))}
      </div>
    </GlassPanel>
  )
}
