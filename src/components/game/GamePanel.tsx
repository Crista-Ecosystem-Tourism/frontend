import { useMemo, useState } from 'react'
import {
  ArrowLeft, Globe2, Flame, PiggyBank, Trophy, CheckCircle2,
  Circle, TrendingDown, MapPin, ChevronRight, BookOpenCheck, RotateCcw,
} from 'lucide-react'
import { GlassPanel, Chip, DisplayTitle, IconButton } from '@/components/ui/glass'
import { WorldMap } from './WorldMap'
import { CountryQuests } from './CountryQuests'
import { useGameProgress } from '@/hooks/useGameProgress'
import { gameCountries, findCountry, questCategoryLabel } from '@/mocks/game'
import { cn } from '@/lib/utils'

type GamePanelProps = {
  onBack: () => void
}

const categoryTint: Record<string, string> = {
  sights: 'bg-teal-400',
  food: 'bg-[#E3C878]',
  traditions: 'bg-accent-soft',
}

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
  const [selectedIso, setSelectedIso] = useState<string>('RU')

  const {
    isDone, toggleQuest, countryProgress, cityProgress, categoryProgress, stats, resetProgress,
  } = useGameProgress()

  const country = findCountry(selectedIso) ?? gameCountries[0]
  const progress = countryProgress(country.iso)
  const categories = categoryProgress(country.iso)

  // Фокус страны: та, что открыта и ещё не закрыта полностью
  const focus = useMemo(
    () => gameCountries.find((c) => c.opened && countryProgress(c.iso) < 100) ?? gameCountries[0],
    [countryProgress]
  )
  const focusProgress = countryProgress(focus.iso)

  return (
    <div className="h-full overflow-y-auto">
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
              <span className="tabular">{stats.openedCountries} из 195 стран</span>
            </Chip>
            <Chip size="sm" variant="active">
              <Trophy />
              <span className="tabular">{stats.doneQuests} из {stats.totalQuests} квестов</span>
            </Chip>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] space-y-8 px-5 py-8 sm:px-6">
        {/* Карта мира */}
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-text">Карта мира</h2>
            <p className="hidden font-sans text-xs text-text-muted sm:block">
              Открытые страны подсвечены. Нажмите, чтобы увидеть города и квесты
            </p>
          </div>

          <GlassPanel className="relative h-[420px] overflow-hidden p-0 sm:h-[480px]">
            {/* Атмосферное свечение под картой */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(107,91,255,0.16),transparent_70%)]" />
            <WorldMap
              progressByIso={countryProgress}
              selectedIso={selectedIso}
              onSelect={setSelectedIso}
            />
          </GlassPanel>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs text-text-muted">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-4 rounded-sm bg-primary/70" />
              Открыто, идёт прогресс
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-4 rounded-sm bg-violet-700" />
              Туман войны
            </span>
          </div>
        </section>

        {/* Квесты выбранной страны */}
        <section>
          <CountryQuests
            country={country}
            isDone={isDone}
            onToggle={toggleQuest}
            progress={progress}
            cityProgress={cityProgress}
          />
        </section>

        {/* Фокус страны */}
        <GlassPanel className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="relative flex items-center justify-center">
                <ProgressRing value={focusProgress} />
                <span className="absolute text-xl leading-none" aria-hidden="true">{focus.flag}</span>
              </span>
              <span>
                <span className="block font-sans text-xs uppercase tracking-wide text-text-muted">
                  Фокус страны
                </span>
                <DisplayTitle as="h2" className="!text-3xl">{focus.name}</DisplayTitle>
                <span className="mt-0.5 block font-sans text-sm tabular text-text-secondary">
                  {focusProgress}% закрыто
                </span>
              </span>
            </div>
            {focusProgress === 100 ? (
              <Chip variant="active"><Trophy /> Фокус закрыт</Chip>
            ) : (
              <Chip variant="accent">До премиум-слоя {100 - focusProgress}%</Chip>
            )}
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
                  <span className={cn('block font-sans text-sm font-medium text-text', dailyDone && 'text-text-muted line-through')}>
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

          {/* Категории считаются из реальных квестов выбранной страны */}
          <p className="mb-2.5 font-sans text-xs text-text-muted">
            Категории по стране {country.name}
          </p>
          <div className="space-y-2.5">
            {(Object.keys(questCategoryLabel) as Array<keyof typeof questCategoryLabel>).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate font-sans text-xs text-text-secondary sm:w-44">
                  {questCategoryLabel[key]}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-slow ease-standard', categoryTint[key])}
                    style={{ width: `${categories[key]}%` }}
                  />
                </div>
                <span className="w-9 text-right font-sans text-xs font-semibold tabular text-text-muted">
                  {categories[key]}%
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

        {/* Паспорт и сброс */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="group flex flex-1 items-center justify-between gap-4 rounded-lg border border-white/[0.09] bg-white/[0.05] p-4 text-left transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            <span className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>
                <span className="block font-sans text-sm font-semibold text-text">Тревел-паспорт</span>
                <span className="block font-sans text-xs tabular text-text-muted">
                  Закрыто стран: {stats.closedCountries}
                </span>
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>

          <button
            onClick={resetProgress}
            className="flex items-center gap-2 rounded-lg border border-white/[0.09] px-4 py-3 font-sans text-sm text-text-muted transition-colors hover:border-white/[0.16] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Сбросить прогресс
          </button>
        </div>

        <p className="flex items-start gap-2 px-1 font-sans text-xs leading-relaxed text-text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Пилотные города фазы 0: Москва, Санкт-Петербург и Сочи. Прогресс сохраняется в браузере.
        </p>
      </div>
    </div>
  )
}
