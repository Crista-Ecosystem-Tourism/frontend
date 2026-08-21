import { ArrowLeft, Share2, Stamp as StampIcon, Lock, Globe2 } from 'lucide-react'
import { Chip, IconButton } from '@/components/ui/glass'
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
  major: boolean
  tilt: number
}

/**
 * Штамп нарисован геометрией: двойное кольцо, наклон и полупрозрачная
 * краска, как у оттиска. Это документ Crista, а не государственный паспорт.
 */
function Stamp({ stamp }: { stamp: StampData }) {
  if (!stamp.earned) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-full border-2 border-dashed border-ink-950/30 p-3 text-center">
        <Lock className="h-3.5 w-3.5 text-ink-950/50" aria-hidden="true" />
        <span className="font-sans text-[10px] font-medium leading-tight text-ink-950/60">
          {stamp.title}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex aspect-square flex-col items-center justify-center rounded-full p-3 text-center',
        'border-[3px] transition-transform duration-slow ease-standard hover:rotate-0',
        stamp.major
          ? 'border-[#1A6F7C]/75 bg-[#1A6F7C]/10 text-[#12545E]'
          : 'border-[#5B4BB8]/65 bg-[#5B4BB8]/10 text-[#463A94]'
      )}
      style={{ transform: `rotate(${stamp.tilt}deg)` }}
    >
      <span
        className={cn(
          'pointer-events-none absolute inset-[6px] rounded-full border',
          stamp.major ? 'border-[#1A6F7C]/45' : 'border-[#5B4BB8]/40'
        )}
        aria-hidden="true"
      />
      <span className="relative font-display text-base font-semibold uppercase leading-none tracking-tight">
        {stamp.title}
      </span>
      <span className="relative mt-1 font-sans text-[9px] uppercase tracking-wide opacity-75">
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
  const closedCountries = opened.filter((c) => countryProgress(c.iso) === 100)

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3 px-5 py-3 sm:px-6">
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

      <div className="mx-auto w-full max-w-[980px] space-y-6 px-5 py-8 sm:px-6">
        {/* Разворот: слева обложка документа, справа страница со штампами */}
        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* Обложка */}
          <div className="relative overflow-hidden rounded-lg border border-[#C9A227]/30 bg-gradient-to-br from-[#123840] via-[#0E2A31] to-[#0B1F24] p-6 shadow-lg">
            <div
              className="pointer-events-none absolute inset-3 rounded-md border border-[#C9A227]/25"
              aria-hidden="true"
            />
            <div className="relative flex h-full min-h-[320px] flex-col">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#C9A227]/80">
                Crista Online
              </p>

              <span className="mt-8 flex justify-center">
                <span className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#C9A227]/45">
                  <Globe2 className="h-11 w-11 text-[#C9A227]/85" aria-hidden="true" />
                </span>
              </span>

              <p className="mt-8 text-center font-display text-3xl font-semibold leading-tight text-[#F0E4C0]">
                Тревел-паспорт
              </p>
              <p className="mt-1 text-center font-sans text-[10px] uppercase tracking-[0.18em] text-[#C9A227]/70">
                Travel passport
              </p>

              <div className="mt-auto border-t border-[#C9A227]/25 pt-4">
                <p className="font-sans text-[10px] uppercase tracking-wide text-[#C9A227]/70">
                  Владелец
                </p>
                <p className="mt-0.5 truncate font-display text-xl font-semibold text-[#F0E4C0]">
                  {ownerName}
                </p>
                <p className="mt-2 font-sans text-[11px] tabular text-[#C9A227]/60">
                  Стран закрыто: {closedCountries.length} · Штампов: {earned.length}
                </p>
              </div>
            </div>
          </div>

          {/* Страница со штампами: бумага, а не тёмное стекло */}
          <div className="relative overflow-hidden rounded-lg border border-ink-950/10 bg-[linear-gradient(180deg,#F7F3E8_0%,#EFE9DB_100%)] p-6 shadow-lg">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-ink-950/10 pb-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-950/45">
                  Отметки о посещении
                </p>
                <p className="font-display text-2xl font-semibold text-ink-950/85">
                  Страница 1
                </p>
              </div>
              <Button variant="secondary" size="sm" disabled={earned.length === 0}>
                <Share2 />
                Поделиться
              </Button>
            </div>

            {earned.length === 0 ? (
              <div className="py-14 text-center">
                <StampIcon className="mx-auto mb-3 h-9 w-9 text-ink-950/25" aria-hidden="true" />
                <p className="font-sans text-sm text-ink-950/60">Страница пока чистая</p>
                <p className="mx-auto mt-1 max-w-[44ch] font-sans text-xs leading-relaxed text-ink-950/45">
                  Закройте все квесты города, чтобы получить первый штамп.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {stamps.map((s) => (
                  <Stamp key={s.id} stamp={s} />
                ))}
              </div>
            )}

            {/* Машиночитаемая строка внизу страницы, как в настоящем документе */}
            <p className="mt-6 select-none overflow-hidden truncate border-t border-ink-950/10 pt-3 font-mono text-[11px] tracking-[0.14em] text-ink-950/35">
              {`CRISTA<<${ownerName.toUpperCase().replace(/\s+/g, '<')}<<${
                closedCountries.map((c) => c.iso).join('<') || 'XXX'
              }`}
            </p>
          </div>
        </div>

        <p className="flex items-start gap-2 rounded-lg border border-dashed border-white/[0.12] p-4 font-sans text-xs leading-relaxed text-text-muted">
          <StampIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Штамп за город выдаётся при закрытии всех его квестов, за страну при закрытии всех городов.
          Это документ Crista, он не имеет отношения к государственным паспортам.
        </p>
      </div>
    </div>
  )
}
