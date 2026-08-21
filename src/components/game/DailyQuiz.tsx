import { useMemo, useState } from 'react'
import { Check, X, Flame, Sparkles, ArrowRight, RotateCcw } from 'lucide-react'
import { GlassPanel, Chip } from '@/components/ui/glass'
import { Button } from '@/components/ui/button'
import { questionsForCountry } from '@/mocks/quiz'
import { cn } from '@/lib/utils'

interface DailyQuizProps {
  countryIso: string
  countryName: string
  answeredIds: Set<string>
  onAnswer: (questionId: string, correct: boolean) => void
  onReset: () => void
  streak: number
}

/**
 * Ежедневный вопрос про страну. Ядро ежедневного трека: одно короткое
 * задание, объяснение после ответа и очки в зачёт страны.
 */
export function DailyQuiz({
  countryIso,
  countryName,
  answeredIds,
  onAnswer,
  onReset,
  streak,
}: DailyQuizProps) {
  const [picked, setPicked] = useState<number | null>(null)

  const all = useMemo(() => questionsForCountry(countryIso), [countryIso])
  const remaining = all.filter((q) => !answeredIds.has(q.id))
  const current = remaining[0]

  const answered = picked !== null && current
  const isCorrect = answered ? picked === current.correct : false

  const submit = (index: number) => {
    if (picked !== null || !current) return
    setPicked(index)
    onAnswer(current.id, index === current.correct)
  }

  const next = () => setPicked(null)

  if (all.length === 0) {
    return (
      <GlassPanel variant="flat" className="p-4">
        <p className="font-sans text-sm text-text-muted">
          Вопросы появятся, когда {countryName} будет открыта
        </p>
      </GlassPanel>
    )
  }

  if (!current) {
    return (
      <GlassPanel variant="flat" className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-sans text-xs uppercase tracking-wide text-text-muted">
            Вопрос дня
          </span>
          <Chip size="sm" variant="active">
            <Flame />
            <span className="tabular">{streak}</span>
          </Chip>
        </div>
        <p className="mb-1 font-sans text-sm font-medium text-text">
          Вопросы по стране {countryName} закончились
        </p>
        <p className="mb-3 font-sans text-xs text-text-muted">
          Вы ответили на все {all.length}. Новые появятся завтра.
        </p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw />
          Пройти заново
        </Button>
      </GlassPanel>
    )
  }

  return (
    <GlassPanel variant="flat" className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="font-sans text-xs uppercase tracking-wide text-text-muted">
          Вопрос дня
        </span>
        <span className="flex items-center gap-2">
          <Chip size="sm">
            <span className="tabular">
              {all.length - remaining.length + 1} из {all.length}
            </span>
          </Chip>
          <Chip size="sm" variant="active">
            <Flame />
            <span className="tabular">{streak}</span>
          </Chip>
        </span>
      </div>

      <p className="mb-3 font-sans text-sm font-medium leading-relaxed text-text">
        {current.question}
      </p>

      <div className="space-y-2">
        {current.options.map((option, i) => {
          const isRight = i === current.correct
          const isPicked = picked === i
          return (
            <button
              key={option}
              onClick={() => submit(i)}
              disabled={picked !== null}
              aria-pressed={isPicked}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border p-3 text-left font-sans text-sm transition duration-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                picked === null && 'border-white/[0.09] text-text-secondary hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-text',
                picked !== null && isRight && 'border-primary/50 bg-primary/[0.1] text-text',
                picked !== null && isPicked && !isRight && 'border-error/50 bg-error/[0.1] text-text',
                picked !== null && !isRight && !isPicked && 'border-white/[0.06] text-text-muted'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  picked !== null && isRight && 'border-primary bg-primary text-ink-950',
                  picked !== null && isPicked && !isRight && 'border-error bg-error text-white',
                  (picked === null || (!isRight && !isPicked)) && 'border-white/20'
                )}
              >
                {picked !== null && isRight && <Check className="h-3 w-3" aria-hidden="true" />}
                {picked !== null && isPicked && !isRight && <X className="h-3 w-3" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="mt-3 rounded-md border border-white/[0.09] bg-white/[0.04] p-3">
          <p className="mb-1.5 flex items-center gap-2 font-sans text-sm font-semibold">
            {isCorrect ? (
              <>
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-primary">Верно, плюс {current.points} очков</span>
              </>
            ) : (
              <span className="text-text">Не угадали, но теперь знаете</span>
            )}
          </p>
          <p className="font-sans text-xs leading-relaxed text-text-secondary">
            {current.explanation}
          </p>
          {remaining.length > 1 && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={next}>
              Следующий вопрос
              <ArrowRight />
            </Button>
          )}
        </div>
      )}
    </GlassPanel>
  )
}
