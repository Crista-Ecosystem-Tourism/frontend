import { ArrowLeft, Share2, Stamp as StampIcon, Lock } from 'lucide-react'
import { GlassPanel, Chip, IconButton, DisplayTitle } from '@/components/ui/glass'
import { Button } from '@/components/ui/button'
import { gameCountries, type GameCountry } from '@/mocks/game'
import { cn } from '@/lib/utils'

interface TravelPassportProps {
  onBack: () => void
  countryProgress: (iso: string) => number
  cityProgress: (country: GameCountry, cityId: string) => number
  ownerName: string
}

interface StampData {
  id: string
  title: string
  subtitle: string
  earned: boolean
  /** Полное закрытие страны даёт крупный штамп */
  major: boolean
  tilt: number
}

/**
 * Штамп в паспорте. Нарисован геометрией, а не картинкой: двойное кольцо,
 * лёгкий наклон и «выцветшая» краска, как у настоящего оттиска.
 */
function Stamp({ stamp }: { stamp: StampData }) {
  if (!stamp.earned) {
    return (
      <div
        className={cn(
          'flex aspect-square flex-col items-center justify-center gap-2 rounded-full',
          'border-2 border-dashed border-white/[0.12] p-4 text-center'
        )}
      >
        <Lock className="h-4 w-4 text-text-muted" aria-hidden="true" />
        <span className="font-sans text-[11px] leading-tight text-text-muted">
          {stamp.title}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center rounded-full p-4 text-center',
        'border-[3px] transition-transform duration-slow ease-standard hover:rotate-0',
        stamp.major
          ? 'border-primary/70 bg-primary/[0.09] text-primary'
          : 'border-accent-soft/60 bg-accent/[0.07] text-accent-soft'
      )}
      style={{ transform: `rotate(${stamp.tilt}deg)` }}
    >
      {/* Внутреннее кольцо оттиска */}
      <span
        className={cn(
          'pointer-events-none absolute inset-[7px] rounded-full border',
          stamp.major ? 'border-primary/40' : 'border-accent-soft/35'
        )}
        aria-hidden="true"
      />
      <span className="relative font-display text-lg font-semibold uppercase leading-none tracking-tight">
        {stamp.title}
      </span>
      <span className="relative mt-1.5 font-sans text-[10px] uppercase tracking-wide opacity-80">
        {stamp.subtitle}
      </span>
    </div>
  )
}

export function TravelPassport({
  onBack,
  countryProgress,
  cityProgress,
  ownerName,
}: TravelPassportProps) {
  const opened = gameCountries.filter((c) => c.opened)

  const stamps: StampData[] = []
  opened.forEach((country, ci) => {
    const cp = countryProgress(country.iso)
    stamps.push({
      id: `country-${country.iso}`,
      title: country.name,
      subtitle: cp === 100 ? 'страна закрыта' : `${cp}% пройдено`,
      earned: cp === 100,
      major: true,
      tilt: ((ci % 3) - 1) * 4,
    })
    country.cities.forEach((city, idx) => {
      const p = cityProgress(country, city.id)
      stamps.push({
        id: `city-${city.id}`,
        title: city.name,
        subtitle: p === 100 ? 'город закрыт' : `${p}%`,
        earned: p === 100,
        major: false,
        tilt: (((ci + idx) % 5) - 2) * 3.5,
      })
    })
  })

  const earned = stamps.filter((s) => s.earned)

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[900px] items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <IconButton label="Назад к карте" variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft />
            </IconButton>
            <h1 className="truncate font-display text-2xl font-semibold text-text">
              Тревел-паспорт
            </h1>
          </div>
          <Chip size="sm">
            <StampIcon />
            <span className="tabular">{earned.length} из {stamps.length}</span>
          </Chip>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[900px] space-y-6 px-5 py-8 sm:px-6">
        {/* Разворот паспорта */}
        <GlassPanel className="overflow-hidden p-0">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.07] p-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-text-muted">
                Владелец паспорта
              </p>
              <DisplayTitle as="h2" className="!text-3xl">{ownerName}</DisplayTitle>
              <p className="mt-1 font-sans text-sm tabular text-text-secondary">
                Штампов собрано: {earned.length}
              </p>
            </div>
            <Button variant="secondary" disabled={earned.length === 0}>
              <Share2 />
              Поделиться
            </Button>
          </div>

          {earned.length === 0 ? (
            <div className="px-8 py-14 text-center">
              <StampIcon className="mx-auto mb-3 h-9 w-9 text-text-muted" aria-hidden="true" />
              <p className="font-sans text-sm text-text-secondary">Паспорт пока чистый</p>
              <p className="mx-auto mt-1 max-w-[44ch] font-sans text-xs leading-relaxed text-text-muted">
                Закройте все квесты города, чтобы получить первый штамп.
                Полное закрытие страны даёт крупный штамп на разворот.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3 md:grid-cols-4">
              {stamps.map((s) => (
                <Stamp key={s.id} stamp={s} />
              ))}
            </div>
          )}
        </GlassPanel>

        <p className="flex items-start gap-2 rounded-lg border border-dashed border-white/[0.12] p-4 font-sans text-xs leading-relaxed text-text-muted">
          <StampIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Штамп за город выдаётся при закрытии всех его квестов, за страну при закрытии всех городов.
          Паспорт можно опубликовать одной ссылкой вместе с Crista Wrapped.
        </p>
      </div>
    </div>
  )
}
