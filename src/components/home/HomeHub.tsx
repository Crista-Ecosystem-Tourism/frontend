import { useState, useRef, type KeyboardEvent } from 'react'
import {
  ArrowRight,
  ArrowUp,
  CloudSun,
  Compass,
  Flame,
  MapPin,
  Mic,
  PiggyBank,
  Sparkles,
} from 'lucide-react'
import { GlassPanel, IconButton, Chip, StatTile, ListRow, DisplayTitle } from '@/components/ui/glass'
import { Img } from '@/components/ui/Img'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'

interface HomeHubProps {
  onSend: (message: string) => void
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=2000&q=80'

const suggestions = [
  { label: 'Санкт-Петербург за 3 дня', tripId: 'spb-excursions' },
  { label: 'Гастротур по Грузии', tripId: 'georgia-food' },
  { label: 'Горы Алтая', tripId: 'altai-trekking' },
  { label: 'Культура Киото', tripId: 'kyoto-culture' },
  { label: 'Пляжи Бали', tripId: 'bali-beaches' },
]

const nearby = [
  {
    id: 'spb-hermitage',
    title: 'Эрмитаж',
    subtitle: 'Главный музей страны',
    location: 'Дворцовая площадь',
    imageUrl: 'https://images.unsplash.com/photo-1583002083441-9d5e0e0f4b9e?w=200&q=80',
  },
  {
    id: 'spb-spilled-blood',
    title: 'Спас на Крови',
    subtitle: 'Русская мозаика и купола',
    location: 'Канал Грибоедова',
    imageUrl: 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=200&q=80',
  },
  {
    id: 'spb-bridge',
    title: 'Дворцовый мост',
    subtitle: 'Развод в 01:10',
    location: 'Нева',
    imageUrl: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=200&q=80',
  },
]

const destinations = [
  {
    id: 'venice',
    title: 'Венеция',
    country: 'Италия',
    tag: 'Культура',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
  },
  {
    id: 'norway',
    title: 'Лофотены',
    country: 'Норвегия',
    tag: 'Природа',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
  },
  {
    id: 'kyoto',
    title: 'Киото',
    country: 'Япония',
    tag: 'Традиции',
    imageUrl: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&q=80',
  },
  {
    id: 'cinque',
    title: 'Чинкве-Терре',
    country: 'Италия',
    tag: 'Побережье',
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80',
  },
]

/* ---------------------------------------------------------------- Composer */

function Composer({ onSend }: { onSend: (message: string) => void }) {
  const { loadTripChat } = useApp()
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed) return
    onSend(trimmed)
    setMessage('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const autoGrow = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`
  }

  return (
    <div>
      <GlassPanel variant="photo" radius="xl" className="p-2">
        <div className="flex items-end gap-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>

          <label htmlFor="home-composer" className="sr-only">
            Опишите поездку, которую хотите спланировать
          </label>
          <textarea
            id="home-composer"
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={autoGrow}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Грузия, 5 дней, 80 тысяч"
            className="max-h-32 min-h-[44px] flex-1 resize-none overflow-hidden bg-transparent py-3 font-sans text-base leading-relaxed text-text outline-none placeholder:text-text-muted"
          />

          <div className="flex shrink-0 items-center gap-1.5 pb-0.5">
            <IconButton label="Голосовой ввод" variant="ghost" className="hidden sm:inline-flex">
              <Mic />
            </IconButton>
            <IconButton
              label="Построить маршрут"
              variant="solid"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <ArrowUp />
            </IconButton>
          </div>
        </div>
      </GlassPanel>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Chip
            key={s.tripId}
            interactive
            role="button"
            tabIndex={0}
            onClick={() => loadTripChat(s.tripId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                loadTripChat(s.tripId)
              }
            }}
          >
            {s.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- ProgressRing */

function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" className="stroke-white/10" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        stroke="var(--color-accent)"
        strokeDasharray={c}
        strokeDashoffset={c - (value / 100) * c}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ HomeHub */

export function HomeHub({ onSend }: HomeHubProps) {
  const { setMainView } = useApp()

  return (
    <div className="h-full overflow-y-auto scrollbar-hidden">
      {/* Фотооснова: композиция стоит на снимке, а не на сером фоне.
          Затемнение многослойное, чтобы текст читался на любом кадре. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] overflow-hidden">
        <Img
          src={HERO_IMAGE}
          alt="Панорама города на воде"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="photo-scrim-x absolute inset-0" />
        <div className="absolute inset-0 photo-scrim" />
      </div>

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 pt-10 sm:px-8 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          {/* Левая колонка: главная работа продукта.
              Контент виден сразу: движение здесь украшает, но ничего не открывает. */}
          <div className="flex min-w-0 flex-col justify-center pt-4 lg:pt-10">
            <DisplayTitle size="xl" className="max-w-[16ch]">
              Куда отправимся?
            </DisplayTitle>
            <p className="mt-4 max-w-[52ch] font-accent text-lg leading-relaxed text-text-secondary sm:text-xl">
              Опишите поездку словами. Crista соберёт маршрут, посчитает бюджет и откроет страну
              на вашей карте мира.
            </p>

            <div className="mt-8 max-w-2xl">
              <Composer onSend={onSend} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              <StatTile icon={<CloudSun />} value="12°C" label="Санкт-Петербург, облачно" />
              <StatTile icon={<Compass />} value="34 страны" label="Открыто из 195" />
              <StatTile icon={<Flame />} value="18 дней" label="Текущий стрик" />
            </div>
          </div>

          {/* Правая колонка: личное состояние, вход в остальные разделы */}
          <div className="flex flex-col gap-4">
            <GlassPanel variant="photo" className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-sans text-xs uppercase tracking-wide text-text-muted">
                    Фокус страны
                  </p>
                  <p className="mt-1 truncate font-display text-2xl font-semibold text-text">
                    Италия
                  </p>
                </div>
                <div className="relative shrink-0">
                  <ProgressRing value={62} />
                  <span className="absolute inset-0 flex items-center justify-center font-sans text-xs font-semibold tabular text-text">
                    62%
                  </span>
                </div>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-text-secondary">
                Осталось 4 задания недели, чтобы закрыть кухню региона.
              </p>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => setMainView('game')}
              >
                Продолжить в Игре
                <ArrowRight />
              </Button>
            </GlassPanel>

            <GlassPanel variant="photo" className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/[0.07] text-primary">
                  <PiggyBank className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-text">Копилка на Рим</p>
                  <p className="font-sans text-xs text-text-muted tabular">
                    47 200 из 118 400 ₽
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-primary" style={{ width: '39.8%' }} />
              </div>
              <p className="mt-3 font-sans text-xs text-text-secondary">
                Билеты подешевели на 6 300 ₽ за неделю.
              </p>
            </GlassPanel>

            <GlassPanel variant="photo" className="p-2.5">
              <div className="flex items-baseline justify-between px-2.5 pb-1 pt-1.5">
                <h2 className="font-sans text-sm font-semibold text-text">Рядом с вами</h2>
                <button
                  onClick={() => setMainView('saved')}
                  className="font-sans text-xs text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Все места
                </button>
              </div>
              <div className="flex flex-col">
                {nearby.map((n) => (
                  <ListRow
                    key={n.id}
                    imageUrl={n.imageUrl}
                    title={n.title}
                    subtitle={n.subtitle}
                    meta={
                      <>
                        <MapPin />
                        {n.location}
                      </>
                    }
                    onClick={() => onSend(`Расскажи про ${n.title}`)}
                    action={
                      <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                    }
                  />
                ))}
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Открытия: горизонтальная лента, не сетка одинаковых карточек */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-[28px]">
              Куда едут сейчас
            </h2>
            <button
              onClick={() => setMainView('inspiration')}
              className="shrink-0 font-sans text-sm text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Смотреть все
            </button>
          </div>

          <div className="-mx-5 mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 scrollbar-hidden sm:-mx-8 sm:px-8">
            {destinations.map((d) => (
              <button
                key={d.id}
                onClick={() => onSend(`Хочу поехать в ${d.title}, ${d.country}`)}
                className="group relative w-[240px] shrink-0 snap-start overflow-hidden rounded-lg text-left transition duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-[280px]"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <Img
                    src={d.imageUrl}
                    alt={`${d.title}, ${d.country}`}
                    className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
                  />
                </div>
                <div className="absolute inset-0 photo-scrim" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-2xl font-semibold leading-tight text-white">
                    {d.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-white/70">
                    <MapPin className="h-3 w-3" />
                    {d.country}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
