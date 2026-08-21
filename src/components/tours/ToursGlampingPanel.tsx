import { useState } from 'react'
import { ArrowLeft, MapPin, Clock, Users, Star, Tent, Compass } from 'lucide-react'
import { GlassPanel, IconButton, DisplayTitle } from '@/components/ui/glass'
import { Button } from '@/components/ui/button'
import { Img } from '@/components/ui/Img'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

interface ToursGlampingPanelProps {
  onBack: () => void
}

interface Offer {
  id: string
  title: string
  place: string
  image: string
  price: number
  duration: string
  group: string
  rating: number
  highlights: string[]
}

const tours: Offer[] = [
  {
    id: 'kazbegi',
    title: 'Казбеги и Гергетская церковь',
    place: 'Грузия, из Тбилиси',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&q=80',
    price: 6800,
    duration: '1 день',
    group: 'до 8 человек',
    rating: 4.9,
    highlights: ['Трансфер из центра', 'Гид на русском', 'Обед в Гудаури'],
  },
  {
    id: 'spb-canals',
    title: 'Каналы и разводные мосты',
    place: 'Санкт-Петербург',
    image: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=900&q=80',
    price: 3200,
    duration: '3 часа, ночью',
    group: 'до 12 человек',
    rating: 4.8,
    highlights: ['Прогулка на катере', 'Развод Дворцового моста', 'Плед и чай'],
  },
  {
    id: 'rosa-peak',
    title: 'Роза Пик и альпийские луга',
    place: 'Сочи, Красная Поляна',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
    price: 5400,
    duration: '6 часов',
    group: 'до 10 человек',
    rating: 4.7,
    highlights: ['Три канатных дороги', 'Высота 2320 м', 'Треккинг по маршруту'],
  },
]

const glamping: Offer[] = [
  {
    id: 'karelia',
    title: 'Купольные шатры на озере',
    place: 'Карелия, Ладога',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=900&q=80',
    price: 11500,
    duration: 'за ночь',
    group: '2 гостя',
    rating: 4.9,
    highlights: ['Панорамный купол', 'Баня на дровах', 'Завтрак включён'],
  },
  {
    id: 'altai',
    title: 'Домики с видом на хребет',
    place: 'Алтай, Чемал',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80',
    price: 8900,
    duration: 'за ночь',
    group: '4 гостя',
    rating: 4.8,
    highlights: ['Панорамные окна', 'Терраса с очагом', 'Без соседей в радиусе километра'],
  },
]

function OfferCard({ offer, onPlan }: { offer: Offer; onPlan: () => void }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/[0.09] bg-white/[0.05] transition duration-base ease-standard hover:-translate-y-0.5 hover:border-white/[0.16]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img
          src={offer.image}
          alt={offer.title}
          className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="photo-scrim absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-2xl font-semibold leading-tight text-white">
            {offer.title}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-sans text-xs text-white/75">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {offer.place}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {offer.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {offer.group}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" />
            <span className="tabular">{offer.rating}</span>
          </span>
        </div>

        <ul className="mb-4 space-y-1.5">
          {offer.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 font-sans text-xs text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-sm">
            <span className="font-semibold tabular text-text">
              {offer.price.toLocaleString('ru')} ₽
            </span>
            <span className="text-text-muted"> с человека</span>
          </span>
          <Button variant="secondary" size="sm" onClick={onPlan}>
            Подробнее
          </Button>
        </div>
      </div>
    </article>
  )
}

export function ToursGlampingPanel({ onBack }: ToursGlampingPanelProps) {
  const { newChat, sendMessage } = useApp()
  const [tab, setTab] = useState<'tours' | 'glamping'>('tours')

  const list = tab === 'tours' ? tours : glamping

  const plan = (offer: Offer) => {
    newChat()
    setTimeout(() => sendMessage(`Расскажи подробнее: ${offer.title}, ${offer.place}`), 100)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-5 py-3 sm:px-6">
          <IconButton label="Назад" variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft />
          </IconButton>
          <h1 className="font-display text-2xl font-semibold text-text">Туры и глемпинг</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-6">
        <p className="mb-6 max-w-[68ch] font-accent text-lg leading-relaxed text-text-secondary">
          Готовые маршруты с гидом и места для ночёвки, которые не похожи на отель.
          Всё подобрано под ваши прошлые поездки.
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {([
            { key: 'tours' as const, label: 'Туры', icon: Compass, count: tours.length },
            { key: 'glamping' as const, label: 'Глемпинг', icon: Tent, count: glamping.length },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-medium transition duration-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                tab === t.key
                  ? 'bg-teal-700 text-white'
                  : 'text-text-secondary hover:bg-white/[0.08] hover:text-text'
              )}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
              <span className={cn('text-xs tabular', tab === t.key ? 'text-white/70' : 'text-text-muted')}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onPlan={() => plan(offer)} />
          ))}
        </div>

        <GlassPanel className="mt-6 p-5">
          <DisplayTitle as="h2" className="!text-2xl">Бронирование через партнёров</DisplayTitle>
          <p className="mt-2 max-w-[62ch] font-sans text-sm leading-relaxed text-text-secondary">
            Цены и наличие мест здесь показаны для примера. Партнёрские букинги подключаются
            во второй фазе вместе с живым ценообразованием.
          </p>
        </GlassPanel>
      </div>
    </div>
  )
}
