import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Globe2, Lock, Flame, PiggyBank, Trophy, CheckCircle2,
  Circle, TrendingDown, Sparkles, MapPin, ChevronRight, BookOpenCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type GamePanelProps = {
  onBack: () => void
}

interface CountryTile {
  id: string
  name: string
  flag: string
  progress: number // 0-100, only meaningful if opened
  opened: boolean
  cities?: string[]
}

const countries: CountryTile[] = [
  { id: 'ru', name: 'Россия', flag: '🇷🇺', progress: 62, opened: true, cities: ['Москва', 'Санкт-Петербург', 'Сочи'] },
  { id: 'ge', name: 'Грузия', flag: '🇬🇪', progress: 28, opened: true, cities: ['Тбилиси', 'Батуми'] },
  { id: 'tr', name: 'Турция', flag: '🇹🇷', progress: 9, opened: true, cities: ['Стамбул'] },
  { id: 'it', name: '???', flag: '🇮🇹', progress: 0, opened: false },
  { id: 'jp', name: '???', flag: '🇯🇵', progress: 0, opened: false },
  { id: 'id', name: '???', flag: '🇮🇩', progress: 0, opened: false },
  { id: 'fr', name: '???', flag: '🇫🇷', progress: 0, opened: false },
  { id: 'th', name: '???', flag: '🇹🇭', progress: 0, opened: false },
  { id: 'ae', name: '???', flag: '🇦🇪', progress: 0, opened: false },
  { id: 'es', name: '???', flag: '🇪🇸', progress: 0, opened: false },
  { id: 'de', name: '???', flag: '🇩🇪', progress: 0, opened: false },
  { id: 'eg', name: '???', flag: '🇪🇬', progress: 0, opened: false },
]

const categoryProgress = [
  { label: 'Достопримечательности', value: 74, color: 'bg-emerald-500' },
  { label: 'Кухня', value: 55, color: 'bg-amber-500' },
  { label: 'Традиции', value: 40, color: 'bg-violet-500' },
]

function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="stroke-border" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        stroke="var(--color-accent)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

export function GamePanel({ onBack }: GamePanelProps) {
  const [dailyDone, setDailyDone] = useState(false)
  const focusCountry = countries[0]

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="flex-shrink-0 p-4 pb-3 border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-primary shrink-0" />
              <h1 className="text-xl font-bold text-text">Игра — охват мира</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-light border border-border text-xs font-semibold text-text-secondary">
              <Globe2 className="w-3.5 h-3.5 text-primary" /> 3 / 195 стран
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-semibold text-orange-500">
              <Flame className="w-3.5 h-3.5" /> Стрик 12 дней
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-8">
        {/* World map with fog of war */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Карта мира</h2>
            <span className="text-xs text-text-muted">Клик по стране открывает города и точки квестов</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {countries.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'relative aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 overflow-hidden transition-transform',
                  c.opened
                    ? 'border-border bg-surface-light cursor-pointer hover:scale-[1.03] hover:border-primary/40'
                    : 'border-border/50 bg-surface cursor-not-allowed'
                )}
                title={c.opened ? c.name : 'Скрыто туманом войны — начните маршрут, чтобы открыть'}
              >
                {!c.opened && (
                  <div className="absolute inset-0 backdrop-blur-[3px] bg-background/60 z-10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-text-muted" />
                  </div>
                )}
                <span className={cn('text-3xl', !c.opened && 'grayscale opacity-40 blur-[1px]')}>{c.flag}</span>
                <span className={cn('text-[11px] font-semibold text-text-secondary', !c.opened && 'opacity-40')}>
                  {c.opened ? c.name : '???'}
                </span>
                {c.opened && (
                  <span className="absolute top-1.5 right-1.5 text-[10px] font-bold text-primary bg-primary/10 rounded-full px-1.5 py-0.5">
                    {c.progress}%
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Focus country */}
        <section className="rounded-3xl border border-border bg-surface-light/50 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <ProgressRing value={focusCountry.progress} />
              <div className="-ml-14 sm:-ml-14 flex flex-col items-center justify-center w-14">
                <span className="text-lg">{focusCountry.flag}</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-text-muted font-bold">Фокус страны</p>
                <h3 className="text-lg font-bold text-text">{focusCountry.name} · {focusCountry.progress}% закрыто</h3>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5" /> До премиум-слоя 38%
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Daily track */}
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Ежедневный трек</span>
                <span className="flex items-center gap-1 text-orange-500 text-xs font-bold"><Flame className="w-3.5 h-3.5" /> 12</span>
              </div>
              <button
                onClick={() => setDailyDone(v => !v)}
                className="w-full flex items-start gap-3 text-left rounded-xl p-3 hover:bg-surface-hover transition-colors"
              >
                {dailyDone ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn('text-sm font-medium text-text', dailyDone && 'line-through text-text-muted')}>
                    Фраза дня: «Гамарджоба» — привет по-грузински
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">Мини-квест · 60 секунд</p>
                </div>
              </button>
            </div>

            {/* Weekly track */}
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Еженедельный трек</span>
                <BookOpenCheck className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-medium text-text mb-2">Онлайн-курс: «История Кавказа за 10 минут»</p>
              <div className="h-2 rounded-full bg-surface-light overflow-hidden mb-1.5">
                <div className="h-full bg-accent rounded-full" style={{ width: '45%' }} />
              </div>
              <p className="text-xs text-text-muted">Урок 3 из 6 · 45% пройдено</p>
            </div>
          </div>

          {/* Category progress */}
          <div className="space-y-2.5">
            {categoryProgress.map(cat => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-40 flex-shrink-0">{cat.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                  <div className={cn('h-full rounded-full', cat.color)} style={{ width: `${cat.value}%` }} />
                </div>
                <span className="text-xs font-semibold text-text-muted w-9 text-right">{cat.value}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Piggy bank */}
        <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface-light/50 to-transparent p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-text-muted font-bold">Копилка</p>
              <h3 className="text-lg font-bold text-text">Цель: Батуми, 5 дней</h3>
            </div>
          </div>
          <div className="h-3 rounded-full bg-surface overflow-hidden mb-2">
            <div className="h-full bg-primary rounded-full" style={{ width: '58%' }} />
          </div>
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="font-semibold text-text">34 800 ₽ <span className="text-text-muted font-normal">из 60 000 ₽</span></span>
            <span className="text-text-muted">58%</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 rounded-full px-3 py-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> Цена авиабилета упала на 12% — отличный момент отложить
            </span>
            <span className="text-xs text-text-muted">Рекомендуем откладывать ~2 100 ₽ / нед.</span>
          </div>
        </section>

        {/* Travel passport teaser */}
        <section className="flex items-center justify-between rounded-2xl border border-border bg-surface-light/40 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-text">Тревел-паспорт</p>
              <p className="text-xs text-text-muted">3 штампа собрано · смотрите в профиле</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Открыть <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>

        <section className="flex items-center gap-2 text-xs text-text-muted px-1">
          <MapPin className="w-3.5 h-3.5" />
          Пилотные города фазы 0: Москва, Санкт-Петербург, Сочи — полный подробный режим появится в фазе 1.
        </section>
      </div>
    </div>
  )
}
