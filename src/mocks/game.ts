/**
 * Игровой слой: страны, города и точки квестов.
 * Фаза 0 по продуктовому документу: подробно проработаны пилотные города
 * (Москва, Санкт-Петербург, Сочи), соседние страны даны в меньшем объёме.
 */

export type QuestCategory = 'sights' | 'food' | 'traditions'

export interface QuestPoint {
  id: string
  title: string
  hint: string
  category: QuestCategory
  points: number
  /** [широта, долгота] */
  coordinates: [number, number]
}

export interface QuestCity {
  id: string
  name: string
  coordinates: [number, number]
  quests: QuestPoint[]
}

/** Ежедневный трек: короткое задание, держит стрик */
export interface DailyTrack {
  title: string
  hint: string
}

/** Еженедельный трек: развёрнутый материал по культуре страны */
export interface WeeklyTrack {
  title: string
  lesson: number
  totalLessons: number
  percent: number
}

/** Копилка под конкретное направление */
export interface SavingsGoal {
  destination: string
  current: number
  target: number
  /** Изменение цены билета в процентах, отрицательное значит подешевел */
  priceTrend: number
  weekly: number
}

export interface GameCountry {
  iso: string
  name: string
  flag: string
  /** Страна открыта, если по ней уже строился маршрут */
  opened: boolean
  cities: QuestCity[]
  daily?: DailyTrack
  weekly?: WeeklyTrack
  savings?: SavingsGoal
}

export const questCategoryLabel: Record<QuestCategory, string> = {
  sights: 'Достопримечательности',
  food: 'Кухня',
  traditions: 'Традиции',
}

export const gameCountries: GameCountry[] = [
  {
    iso: 'RU',
    name: 'Россия',
    flag: '🇷🇺',
    opened: true,
    daily: {
      title: 'Слово дня: «авось» это надежда на удачу без плана',
      hint: 'Мини-квест, 60 секунд',
    },
    weekly: {
      title: 'Онлайн-курс: «Русский авангард за 10 минут»',
      lesson: 3,
      totalLessons: 6,
      percent: 45,
    },
    savings: { destination: 'Санкт-Петербург, 4 дня', current: 21400, target: 48000, priceTrend: -8, weekly: 1800 },
    cities: [
      {
        id: 'msk',
        name: 'Москва',
        coordinates: [55.7558, 37.6173],
        quests: [
          { id: 'msk-1', title: 'Красная площадь', hint: 'Дойдите до Лобного места и сделайте фото с геометкой', category: 'sights', points: 20, coordinates: [55.7539, 37.6208] },
          { id: 'msk-2', title: 'Собор Василия Блаженного', hint: 'Найдите придел, давший собору народное имя', category: 'sights', points: 25, coordinates: [55.7525, 37.6231] },
          { id: 'msk-3', title: 'Третьяковская галерея', hint: 'Отыщите зал Врубеля', category: 'traditions', points: 30, coordinates: [55.7415, 37.6208] },
          { id: 'msk-4', title: 'Пышки на Покровке', hint: 'Попробуйте местную выпечку в будний день до полудня', category: 'food', points: 15, coordinates: [55.7585, 37.6455] },
          { id: 'msk-5', title: 'ВДНХ', hint: 'Обойдите фонтан «Дружба народов» по кругу', category: 'sights', points: 20, coordinates: [55.8263, 37.6377] },
        ],
      },
      {
        id: 'spb',
        name: 'Санкт-Петербург',
        coordinates: [59.9311, 30.3609],
        quests: [
          { id: 'spb-1', title: 'Эрмитаж', hint: 'Найдите часы «Павлин» в Павильонном зале', category: 'sights', points: 30, coordinates: [59.9398, 30.3146] },
          { id: 'spb-2', title: 'Спас на Крови', hint: 'Разглядите мозаику над западным входом', category: 'sights', points: 25, coordinates: [59.9401, 30.3288] },
          { id: 'spb-3', title: 'Развод Дворцового моста', hint: 'Придите к 01:10 и снимите момент развода', category: 'traditions', points: 35, coordinates: [59.9416, 30.3083] },
          { id: 'spb-4', title: 'Пышечная на Большой Конюшенной', hint: 'Возьмите пышку и кофе по-ленинградски', category: 'food', points: 15, coordinates: [59.9386, 30.3251] },
          { id: 'spb-5', title: 'Петропавловская крепость', hint: 'Дождитесь полуденного выстрела', category: 'traditions', points: 25, coordinates: [59.9500, 30.3167] },
          { id: 'spb-6', title: 'Невский проспект', hint: 'Пройдите от Адмиралтейства до площади Восстания', category: 'sights', points: 20, coordinates: [59.9311, 30.3609] },
        ],
      },
      {
        id: 'sochi',
        name: 'Сочи',
        coordinates: [43.5855, 39.7231],
        quests: [
          { id: 'sochi-1', title: 'Олимпийский парк', hint: 'Найдите чашу олимпийского огня', category: 'sights', points: 20, coordinates: [43.4025, 39.9564] },
          { id: 'sochi-2', title: 'Роза Хутор', hint: 'Поднимитесь на высоту 2320 метров', category: 'sights', points: 30, coordinates: [43.6708, 40.2969] },
          { id: 'sochi-3', title: 'Чайные плантации', hint: 'Попробуйте краснодарский чай там, где он растёт', category: 'food', points: 25, coordinates: [43.6333, 39.7500] },
          { id: 'sochi-4', title: 'Дендрарий', hint: 'Прокатитесь на канатной дороге над парком', category: 'traditions', points: 15, coordinates: [43.5686, 39.7414] },
        ],
      },
    ],
  },
  {
    iso: 'GE',
    name: 'Грузия',
    flag: '🇬🇪',
    opened: true,
    daily: {
      title: 'Фраза дня: «Гамарджоба» это привет по-грузински',
      hint: 'Мини-квест, 60 секунд',
    },
    weekly: {
      title: 'Онлайн-курс: «История Кавказа за 10 минут»',
      lesson: 3,
      totalLessons: 6,
      percent: 45,
    },
    savings: { destination: 'Батуми, 5 дней', current: 34800, target: 60000, priceTrend: -12, weekly: 2100 },
    cities: [
      {
        id: 'tbilisi',
        name: 'Тбилиси',
        coordinates: [41.7151, 44.8271],
        quests: [
          { id: 'tb-1', title: 'Серные бани Абанотубани', hint: 'Загляните под кирпичные купола в старом городе', category: 'traditions', points: 25, coordinates: [41.6884, 44.8090] },
          { id: 'tb-2', title: 'Крепость Нарикала', hint: 'Поднимитесь по канатной дороге на закате', category: 'sights', points: 30, coordinates: [41.6877, 44.8047] },
          { id: 'tb-3', title: 'Хинкали на Мтацминда', hint: 'Съешьте хинкали правильно, не проткнув тесто', category: 'food', points: 20, coordinates: [41.6952, 44.7920] },
        ],
      },
      {
        id: 'batumi',
        name: 'Батуми',
        coordinates: [41.6168, 41.6367],
        quests: [
          { id: 'bt-1', title: 'Статуя Али и Нино', hint: 'Дождитесь, когда фигуры пройдут сквозь друг друга', category: 'sights', points: 25, coordinates: [41.6520, 41.6350] },
          { id: 'bt-2', title: 'Аджарский хачапури', hint: 'Размешайте желток с маслом, не обжигаясь', category: 'food', points: 20, coordinates: [41.6460, 41.6400] },
        ],
      },
    ],
  },
  {
    iso: 'TR',
    name: 'Турция',
    flag: '🇹🇷',
    opened: true,
    daily: {
      title: 'Фраза дня: «Merhaba» это здравствуйте по-турецки',
      hint: 'Мини-квест, 60 секунд',
    },
    weekly: {
      title: 'Онлайн-курс: «Османская архитектура за 10 минут»',
      lesson: 1,
      totalLessons: 5,
      percent: 20,
    },
    savings: { destination: 'Стамбул, 6 дней', current: 12600, target: 71000, priceTrend: 4, weekly: 2600 },
    cities: [
      {
        id: 'istanbul',
        name: 'Стамбул',
        coordinates: [41.0082, 28.9784],
        quests: [
          { id: 'is-1', title: 'Айя-София', hint: 'Найдите византийские мозаики на верхней галерее', category: 'sights', points: 35, coordinates: [41.0086, 28.9802] },
          { id: 'is-2', title: 'Гранд-базар', hint: 'Проведите торг и снизьте цену хотя бы на треть', category: 'traditions', points: 25, coordinates: [41.0106, 28.9681] },
          { id: 'is-3', title: 'Балык-экмек у Галатского моста', hint: 'Возьмите рыбу в хлебе прямо с лодки', category: 'food', points: 20, coordinates: [41.0201, 28.9741] },
        ],
      },
    ],
  },
  { iso: 'IT', name: 'Италия', flag: '🇮🇹', opened: false, cities: [] },
  { iso: 'JP', name: 'Япония', flag: '🇯🇵', opened: false, cities: [] },
  { iso: 'FR', name: 'Франция', flag: '🇫🇷', opened: false, cities: [] },
  { iso: 'ES', name: 'Испания', flag: '🇪🇸', opened: false, cities: [] },
  { iso: 'TH', name: 'Таиланд', flag: '🇹🇭', opened: false, cities: [] },
  { iso: 'AE', name: 'ОАЭ', flag: '🇦🇪', opened: false, cities: [] },
  { iso: 'DE', name: 'Германия', flag: '🇩🇪', opened: false, cities: [] },
  { iso: 'EG', name: 'Египет', flag: '🇪🇬', opened: false, cities: [] },
  { iso: 'ID', name: 'Индонезия', flag: '🇮🇩', opened: false, cities: [] },
]

/** Страны, доступные для прохождения: по ним есть контент */
export const openedCountryIso = new Set(
  gameCountries.filter((c) => c.opened).map((c) => c.iso)
)

export function findCountry(iso: string): GameCountry | undefined {
  return gameCountries.find((c) => c.iso === iso)
}

export function countryTotalPoints(country: GameCountry): number {
  return country.cities.reduce(
    (sum, city) => sum + city.quests.reduce((s, q) => s + q.points, 0),
    0
  )
}
