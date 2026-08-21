import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, Search, MapPin, Landmark, UtensilsCrossed, Sparkles,
  Wallet, Globe, Bus, HandHeart, MessageCircleQuestion, ShieldAlert, Pencil, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataPanelProps {
  onBack: () => void
}

interface CountryArticle {
  id: string
  name: string
  flag: string
  cover: string
  summary: string
  history: string
  cuisine: string
  traditions: string
  practical: { label: string; value: string; icon: typeof Wallet }[]
}

const articles: CountryArticle[] = [
  {
    id: 'ru',
    name: 'Россия',
    flag: '🇷🇺',
    cover: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80',
    summary: 'Самая большая страна мира — от Балтики до Тихого океана, с богатым культурным наследием и разнообразной кухней.',
    history: 'Тысячелетняя история от Киевской Руси до современной федерации: империя, революция 1917 года, советский период и переход к рыночной экономике в 1990-х.',
    cuisine: 'Борщ, пельмени, блины, оливье, шашлык. Чаепитие — важная часть повседневной культуры.',
    traditions: 'Гостеприимство, баня, Новый год как главный семейный праздник, широкая Масленица.',
    practical: [
      { label: 'Виза', value: 'Требуется для большинства стран', icon: Globe },
      { label: 'Валюта', value: 'Российский рубль (₽)', icon: Wallet },
      { label: 'Транспорт', value: 'Метро, электрички, каршеринг', icon: Bus },
      { label: 'Этикет', value: 'Снимать обувь в гостях', icon: HandHeart },
    ],
  },
  {
    id: 'ge',
    name: 'Грузия',
    flag: '🇬🇪',
    cover: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80',
    summary: 'Гостеприимная страна на Кавказе с древними традициями виноделия и одной из самых узнаваемых кухонь мира.',
    history: 'Одна из первых стран, принявших христианство (IV век). Богатая история царств и влияние Персии, Османской империи и России.',
    cuisine: 'Хинкали, хачапури, вино из квеври, чурчхела. Тосты и застолье — «супра» — целый ритуал.',
    traditions: 'Многоголосое пение, тамада на застольях, культ гостеприимства.',
    practical: [
      { label: 'Виза', value: 'Безвизовый въезд для РФ до 1 года', icon: Globe },
      { label: 'Валюта', value: 'Лари (₾)', icon: Wallet },
      { label: 'Транспорт', value: 'Маршрутки, такси, канатные дороги', icon: Bus },
      { label: 'Разговорник', value: '«Гамарджоба» — привет', icon: MessageCircleQuestion },
    ],
  },
  {
    id: 'jp',
    name: 'Япония',
    flag: '🇯🇵',
    cover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
    summary: 'Страна восходящего солнца — гармония многовековых традиций и передовых технологий.',
    history: 'Эпоха самураев и сёгунов, реставрация Мэйдзи, стремительная модернизация после Второй мировой войны.',
    cuisine: 'Суши, рамен, темпура, кайсэки. Чайная церемония — искусство осознанности.',
    traditions: 'Этикет поклонов, обувь снимается у входа, культ вежливости и порядка.',
    practical: [
      { label: 'Виза', value: 'Требуется для граждан РФ', icon: Globe },
      { label: 'Валюта', value: 'Японская иена (¥)', icon: Wallet },
      { label: 'Транспорт', value: 'Синкансэн, метро, JR Pass', icon: Bus },
      { label: 'Экстренные службы', value: 'Полиция 110, скорая 119', icon: ShieldAlert },
    ],
  },
]

const categories = [
  { key: 'history', label: 'История', icon: Landmark },
  { key: 'cuisine', label: 'Кухня', icon: UtensilsCrossed },
  { key: 'traditions', label: 'Традиции', icon: Sparkles },
] as const

export function DataPanel({ onBack }: DataPanelProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [tab, setTab] = useState<'history' | 'cuisine' | 'traditions'>('history')
  const [query, setQuery] = useState('')

  const active = articles.find(a => a.id === openId)
  const filtered = articles.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))

  if (active) {
    return (
      <div className="flex flex-col h-full bg-background overflow-y-auto">
        <div className="flex-shrink-0 p-4 pb-3 border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <h1 className="text-xl font-bold text-text">CristaWiki</h1>
            </div>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto p-4 sm:p-6">
          <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden mb-6">
            <img src={active.cover} alt={active.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
              <span className="text-3xl">{active.flag}</span>
              <h2 className="text-2xl sm:text-3xl font-bold">{active.name}</h2>
            </div>
            <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1">
              <Pencil className="w-3 h-3" /> Редактируется сообществом
            </span>
          </div>

          <p className="text-text-secondary leading-relaxed mb-6">{active.summary}</p>

          <div className="flex gap-1.5 mb-5 bg-surface-light p-1 rounded-xl w-fit">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setTab(cat.key)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  tab === cat.key ? 'bg-surface-hover text-text shadow-sm' : 'text-text-secondary hover:text-text'
                )}
              >
                <cat.icon className="w-3.5 h-3.5" /> {cat.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface-light/40 p-5 mb-6 leading-relaxed text-text-secondary">
            {tab === 'history' && active.history}
            {tab === 'cuisine' && active.cuisine}
            {tab === 'traditions' && active.traditions}
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Практическая информация</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {active.practical.map(item => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="text-sm font-medium text-text">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="flex-shrink-0 p-4 pb-3 border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-xl font-bold text-text">CristaWiki</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto p-4 sm:p-6">
        <p className="text-text-secondary mb-5">
          Справочник по странам: история, кухня, традиции и практическая информация — единый источник контента для квестов, фокуса и маршрутов.
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по странам..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface-light text-sm text-text placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.button
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setOpenId(a.id); setTab('history') }}
                className="group text-left rounded-2xl border border-border bg-surface-light/40 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <div className="relative h-32">
                  <img src={a.cover} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                    <span className="text-xl">{a.flag}</span>
                    <span className="font-bold">{a.name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">{a.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {categories.map(cat => (
                        <span key={cat.key} className="text-[10px] font-semibold text-text-muted bg-surface rounded-full px-2 py-1">
                          {cat.label}
                        </span>
                      ))}
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 mt-6 rounded-xl border border-dashed border-border p-4 text-xs text-text-muted">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          Открытые статьи индексируются поисковиками — дополнительный канал органического трафика. Частичное редактирование доступно сообществу с модерацией.
        </div>
      </div>
    </div>
  )
}
