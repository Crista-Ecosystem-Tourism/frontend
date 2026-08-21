import { useState } from 'react'
import {
  ArrowLeft, Globe2, Lock, Flame, PiggyBank, Trophy, CheckCircle2,
  Circle, TrendingDown, MapPin, ChevronRight, BookOpenCheck,
} from 'lucide-react'
import { GlassPanel, Chip, DisplayTitle, IconButton } from '@/components/ui/glass'
import { cn } from '@/lib/utils'

type GamePanelProps = {
  onBack: () => void
}

interface CountryTile {
  id: string
  name: string
  flag: string
  progress: number
  opened: boolean
}

const countries: CountryTile[] = [
  { id: 'ru', name: 'Россия', flag: '🇷🇺', progress: 62, opened: true },
  { id: 'ge', name: 'Грузия', flag: '🇬🇪', progress: 28, opened: true },
  { id: 'tr', name: 'Турция', flag: '🇹🇷', progress: 9, opened: true },
  { id: 'it', name: 'Италия', flag: '🇮🇹', progress: 0, opened: false },
  { id: 'jp', name: 'Япония', flag: '🇯🇵', progress: 0, opened: false },
  { id: 'id', name: 'Индонезия', flag: '🇮🇩', progress: 0, opened: false },
  { id: 'fr', name: 'Франция', flag: '🇫🇷', progress: 0, opened: false },
  { id: 'th', name: 'Таиланд', flag: '🇹🇭', progress: 0, opened: false },
  { id: 'ae', name: 'ОАЭ', flag: '🇦🇪', progress: 0, opened: false },
  { id: 'es', name: 'Испания', flag: '🇪🇸', progress: 0, opened: false },
  { id: 'de', name: 'Германия', flag: '🇩🇪', progress: 0, opened: false },
  { id: 'eg', name: 'Египет', flag: '🇪🇬', progress: 0, opened: false },
]

const categoryProgress = [
  { label: 'Достопримечательности', value: 74, tint: 'bg-teal-400' },
  { label: 'Кухня', value: 55, tint: 'bg-[#E3C878]' },
  { label: 'Традиции', value: 40, tint: 'bg-accent-soft' },
]

function ProgressRing({ value, size = 60 }: { value: number; size?: number }) {
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" className="stroke-white/10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        stroke="var(--brand-teal-500)"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (value / 100) * circumference}
      />
    </svg>
  )
}

export function GamePanel({ onBack }: GamePanelProps) {
  const [dailyDone, setDailyDone] = useState(false)
  const focusCountry = countries[0]

  return (
    <div className="h-full overflow-y-auto">
      {/* Шапка */}
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <IconButton label="Назад" variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft />
            </IconButton>
            <h1 className="truncate font-display text-2xl font-semibold text-text">Охват мира</h1>
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Chip size="sm">
              <Globe2 />
              <span className="tabular">3 из 195 стран</span>
            </Chip>
            <Chip size="sm" variant="active">
              <Flame />
              <span className="tabular">Стрик 12 дней</span>
            </Chip>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] space-y-8 px-5 py-8 sm:px-6">
        {/* Карта мира с туманом войны */}
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-text">Карта мира</h2>
            <p className="hidden text-xs text-text-muted sm:block">
              Клик по открытой стране ведёт к городам и точкам квестов
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {countries.map((c) => (
              <button
                key={c.id}
                type="button"
                disabled={!c.opened}
                aria-label={
                  c.opened
                    ? `${c.name}, открыто ${c.progress} процентов`
                    : 'Страна скрыта туманом войны'
                }
                title={c.opened ? c.name : 'Скрыто туманом войны. Постройте маршрут, чтобы открыть'}
                className={cn(
                  'group relative aspect-square overflow-hidden rounded-lg border transition duration-base ease-standard',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                  c.opened
                    ? 'cursor-pointer border-white/[0.09] bg-white/[0.05] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/[0.09]'
                    : 'cursor-not-allowed border-white/[0.05] bg-white/[0.02]'
                )}
              >
                <span className="flex h-full w-full flex-col items-center justify-center gap-1.5">
                  <span className={cn('text-3xl leading-none', !c.opened && 'opacity-25 grayscale')}>
                    {c.flag}
                  </span>
                  <span
                    className={cn(
                      'px-1 text-center font-sans text-[11px] font-medium leading-tight',
                      c.opened ? 'text-text-secondary' : 'text-transparent'
                    )}
                  >
                    {c.opened ? c.name : '?'}
                  </span>
                </span>

                {/* Туман войны: живой слой, а не серая заглушка */}
                {!c.opened && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="absolute inset-0 animate-fog-pulse bg-[radial-gradient(ellipse_at_50%_40%,rgba(107,91,255,0.32),rgba(11,10,23,0.9))] backdrop-blur-[3px]" />
                    <Lock className="relative h-4 w-4 text-white/45" aria-hidden="true" />
                  </span>
                )}

                {c.opened && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 font-sans text-[10px] font-bold tabular text-primary">
                    {c.progress}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Фокус страны */}
        <GlassPanel className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="relative flex items-center justify-center">
                <ProgressRing value={focusCountry.progress} />
                <span className="absolute text-xl leading-none">{focusCountry.flag}</span>
              </span>
              <span>
                <span className="block font-sans text-xs uppercase tracking-wide text-text-muted">
                  Фокус страны
                </span>
                <DisplayTitle as="h2" className="!text-3xl">
                  {focusCountry.name}
                </DisplayTitle>
                <span className="mt-0.5 block font-sans text-sm tabular text-text-secondary">
                  {focusCountry.progress}% закрыто
                </span>
              </span>
            </div>
            <Chip variant="accent">До премиум-слоя 38%</Chip>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <GlassPanel variant="flat" className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-xs uppercase tracking-wide text-text-muted">
                  Ежедневный трек
                </span>
                <span className="flex items-center gap-1 font-sans text-xs font-bold tabular text-primary">
                  <Flame className="h-3.5 w-3.5" /> 12
                </span>
              </div>
              <button
                onClick={() => setDailyDone((v) => !v)}
                aria-pressed={dailyDone}
                className="flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {dailyDone ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
                )}
                <span>
                  <span
                    className={cn(
                      'block font-sans text-sm font-medium text-text',
                      dailyDone && 'text-text-muted line-through'
                    )}
                  >
                    Фраза дня: «Гамарджоба» это привет по-грузински
                  </span>
                  <span className="mt-0.5 block font-sans text-xs text-text-muted">
                    Мини-квест, 60 секунд
                  </span>
                </span>
              </button>
            </GlassPanel>

            <GlassPanel variant="flat" className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-xs uppercase tracking-wide text-text-muted">
                  Еженедельный трек
                </span>
                <BookOpenCheck className="h-4 w-4 text-accent-soft" aria-hidden="true" />
              </div>
              <p className="mb-3 font-sans text-sm font-medium text-text">
                Онлайн-курс: «История Кавказа за 10 минут»
              </p>
              <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent" style={{ width: '45%' }} />
              </div>
              <p className="font-sans text-xs tabular text-text-muted">Урок 3 из 6, пройдено 45%</p>
            </GlassPanel>
          </div>

          <div className="space-y-2.5">
            {categoryProgress.map((cat) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate font-sans text-xs text-text-secondary sm:w-44">
                  {cat.label}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className={cn('h-full rounded-full', cat.tint)} style={{ width: `${cat.value}%` }} />
                </div>
                <span className="w-9 text-right font-sans text-xs font-semibold tabular text-text-muted">
                  {cat.value}%
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Копилка */}
        <GlassPanel className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
              <PiggyBank className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-sans text-xs uppercase tracking-wide text-text-muted">
                Копилка
              </span>
              <span className="block font-display text-xl font-semibold text-text">
                Батуми, 5 дней
              </span>
            </span>
          </div>

          <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-primary" style={{ width: '58%' }} />
          </div>
          <div className="mb-4 flex items-center justify-between font-sans text-sm">
            <span className="font-semibold tabular text-text">
              34 800 ₽ <span className="font-normal text-text-muted">из 60 000 ₽</span>
            </span>
            <span className="tabular text-text-muted">58%</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Chip variant="active" size="sm">
              <TrendingDown />
              Билет подешевел на 12%
            </Chip>
            <span className="font-sans text-xs tabular text-text-muted">
              Рекомендуем откладывать 2 100 ₽ в неделю
            </span>
          </div>
        </GlassPanel>

        {/* Тревел-паспорт */}
        <button className="group flex w-full items-center justify-between rounded-lg border border-white/[0.09] bg-white/[0.05] p-4 text-left transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>
              <span className="block font-sans text-sm font-semibold text-text">Тревел-паспорт</span>
              <span className="block font-sans text-xs text-text-muted">
                Собрано 3 штампа, смотрите в профиле
              </span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>

        <p className="flex items-start gap-2 px-1 font-sans text-xs leading-relaxed text-text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Пилотные города фазы 0: Москва, Санкт-Петербург и Сочи. Полный режим появится в фазе 1.
        </p>
      </div>
    </div>
  )
}
