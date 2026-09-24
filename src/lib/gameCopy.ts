import type { InterfaceLanguage } from './settingsCopy'
import type { QuestCategory, QuestPoint } from '../mocks/game'

interface GameCopy {
  back: string
  backToWorldMap: string
  firstTrip: string
  pilotTag: string
  passportLoading: string
  passportUnavailable: string
  retryPassport: string
  passportSource: string
  stamps: (count: number) => string
  savedRoutes: (routes: string) => string
  noSavedRoutes: string
  suitcaseSource: string
  tripsAndGoals: (trips: number, goals: number) => string
  suitcaseLoading: string
  suitcaseUnavailable: (error: string) => string
  suitcaseLoadFailed: string
  retrySuitcase: string
  noTrips: string
  openSuitcase: string
  liveModeNote: string
  worldCoverage: string
  backToMap: string
  openCountriesCount: (count: number) => string
  questsCount: (done: number, total: number) => string
  worldMap: string
  worldMapHint: string
  openInProgress: string
  blankSpots: string
  countryFocus: string
  completedPercent: (percent: number) => string
  focusComplete: string
  percentToPremium: (percent: number) => string
  weeklyTrack: string
  lessonProgress: (lesson: number, total: number, percent: number) => string
  courseLocked: string
  categoryProgress: (country: string) => string
  savings: string
  amountOfTarget: (target: string) => string
  ticketDown: (percent: number) => string
  ticketUp: (percent: number) => string
  weeklySavings: (amount: string) => string
  passport: string
  closedCountries: (count: number) => string
  resetProgress: string
  pilotCitiesNote: string
  closed: string
  regions: string
  regionUnlockHint: string
  visited: string
  blankSpotLegend: string
  questionOfDay: string
  questPoints: string
  categoryProgressTitle: string
  regionUnlockNote: string
  unopenedCountry: (country: string) => string
  openCountryHint: string
  countryClosed: string
  cityCount: (count: number) => string
  countryClosedFully: string
  questCategories: string
  categoryNames: Record<QuestCategory, string>
  noRegions: (country: string) => string
  worldMapBlankSpot: string
  passportOwner: string
  document: string
  countriesLabel: string
  stampsLabel: string
  countrySeals: string
  visitMarks: string
  page: (number: number) => string
  share: string
  emptyPage: string
  firstStampHint: string
  passportDisclaimer: string
  pilotLabel: string
  cityPilotNames: Record<'st-petersburg' | 'sochi', string>
  pilotNodeNames: Record<string, string>
  pilotNodeStates: { completed: string; unlocked: string; locked: string }
  pilotComplete: string
  pilotContentLanguageNote: string
  source: string
  openSource: string
  truthOrMyth: string
  timeline: string
  correctXp: (xp: number) => string
  tryAgain: string
  saveAnswerFailed: string
  questUnavailable: string
}

const copy: Record<InterfaceLanguage, GameCopy> = {
  ru: {
    back: 'Назад', backToWorldMap: 'К карте мира', firstTrip: 'Первое путешествие', pilotTag: 'Россия · пилот',
    passportLoading: 'Загружаем игровой паспорт…', passportUnavailable: 'Игровой паспорт временно недоступен.',
    retryPassport: 'Повторить загрузку паспорта', passportSource: 'Тревел-паспорт · серверные данные',
    stamps: (count) => `${count} штампов`, savedRoutes: (routes) => `Сохранённые маршруты: ${routes}`,
    noSavedRoutes: 'Сохранённых маршрутов пока нет.', suitcaseSource: 'Мой чемодан · данные Suitcase',
    tripsAndGoals: (trips, goals) => `${trips} активных поездок · ${goals} целей`,
    suitcaseLoading: 'Загружаем поездки и цели…', suitcaseUnavailable: (error) => `Данные чемодана временно недоступны: ${error}`,
    suitcaseLoadFailed: 'Не удалось загрузить данные «Моего чемодана».',
    retrySuitcase: 'Повторить загрузку чемодана', noTrips: 'Поездок пока нет.', openSuitcase: 'Открыть чемодан',
    liveModeNote: 'У маршрута десять проверяемых сервером точек. После них открывается финальный круг из трёх вопросов и городской штамп. Карта мира, ежедневные квизы и ручное закрытие точек пока доступны только в демонстрационном режиме.',
    worldCoverage: 'Охват мира', backToMap: 'Назад', openCountriesCount: (count) => `${count} из 195 стран`,
    questsCount: (done, total) => `${done} из ${total} квестов`, worldMap: 'Карта мира',
    worldMapHint: 'Нажмите на открытую страну, чтобы попасть в её регионы и квесты',
    openInProgress: 'Открыто, идёт прогресс', blankSpots: 'Белые пятна', countryFocus: 'Фокус страны',
    completedPercent: (percent) => `${percent}% закрыто`, focusComplete: 'Фокус закрыт',
    percentToPremium: (percent) => `До премиум-слоя ${percent}%`, weeklyTrack: 'Еженедельный трек',
    lessonProgress: (lesson, total, percent) => `Урок ${lesson} из ${total}, пройдено ${percent}%`,
    courseLocked: 'Курс по стране появится после её открытия', categoryProgress: (country) => `Категории по стране ${country}`,
    savings: 'Копилка', amountOfTarget: (target) => `из ${target}`,
    ticketDown: (percent) => `Билет подешевел на ${percent}%`, ticketUp: (percent) => `Билет подорожал на ${percent}%`,
    weeklySavings: (amount) => `Рекомендуем откладывать ${amount} ₽ в неделю`, passport: 'Тревел-паспорт',
    closedCountries: (count) => `Закрыто стран: ${count}`, resetProgress: 'Сбросить прогресс',
    pilotCitiesNote: 'Пилотные города фазы 0: Москва, Санкт-Петербург и Сочи. Прогресс сохраняется в браузере.',
    closed: 'Закрыта', regions: 'Регионы', regionUnlockHint: 'Регион раскрывается, когда вы закрываете в нём первую точку',
    visited: 'Вы здесь были', blankSpotLegend: 'Белое пятно', questionOfDay: 'Вопрос дня', questPoints: 'Точки квестов',
    categoryProgressTitle: 'Прогресс по категориям', regionUnlockNote: 'Города, где вы закрыли хотя бы одну точку, раскрывают свой регион на карте страны.',
    unopenedCountry: (country) => `${country} ещё белое пятно на вашей карте`,
    openCountryHint: 'Постройте маршрут в эту страну в разделе Маршрут, и здесь появятся регионы, города и точки квестов.',
    countryClosed: 'Страна закрыта полностью', countryClosedFully: 'Страна закрыта полностью', cityCount: russianCityCount,
    questCategories: 'Категории', noRegions: (country) => `Регионы для страны ${country} пока не размечены`,
    categoryNames: { sights: 'Достопримечательности', food: 'Кухня', traditions: 'Традиции' },
    worldMapBlankSpot: 'Белое пятно: маршрут сюда ещё не строили',
    passportOwner: 'Владелец', document: 'Документ', countriesLabel: 'Стран', stampsLabel: 'Штампов',
    countrySeals: 'Печати за закрытые страны', visitMarks: 'Отметки о посещении', page: (number) => `Страница ${number}`,
    share: 'Поделиться', emptyPage: 'Страница пока чистая', firstStampHint: 'Закройте все квесты города, чтобы получить первый штамп.',
    passportDisclaimer: 'Штамп за город выдаётся при закрытии всех его квестов, за страну — при закрытии всех городов. Это документ Crista, не связанный с государственными паспортами.',
    pilotLabel: 'Контентный пилот · серверный путь', cityPilotNames: { 'st-petersburg': 'Санкт-Петербург', sochi: 'Сочи' },
    pilotNodeNames: {
      'spb-hermitage': 'Эрмитаж', 'spb-peterhof': 'Петергоф', 'spb-collection': 'Коллекция Эрмитажа',
      'spb-fountains': 'Фонтаны Петергофа', 'spb-peterhof-history': 'Первое упоминание Петергофа',
      'sochi-national-park': 'Сочинский национальный парк', 'sochi-dendrarium': 'Дендрарий', 'sochi-forest': 'Горные леса',
      'sochi-mzymta': 'Река Мзымта', 'sochi-park-area': 'Площадь национального парка',
    }, pilotNodeStates: { completed: 'Пройдено', unlocked: 'Открыто', locked: 'Закрыто' },
    pilotComplete: 'Маршрут завершён. Все факты сохранены с первоисточниками.',
    pilotContentLanguageNote: 'Тексты фактов и вопросов пока доступны только на русском — это проверенное серверное издание.',
    source: 'Источник', openSource: 'открыть', truthOrMyth: 'Правда или миф', timeline: 'Временная шкала',
    correctXp: (xp) => `Верно! +${xp} XP`, tryAgain: 'Почти! Попробуйте ещё раз.', saveAnswerFailed: 'Не удалось сохранить ответ. Попробуйте ещё раз.',
    questUnavailable: 'Квест пока недоступен.',
  },
  en: {
    back: 'Back', backToWorldMap: 'Back to world map', firstTrip: 'Your first trip', pilotTag: 'Russia · pilot',
    passportLoading: 'Loading game passport…', passportUnavailable: 'Game passport is temporarily unavailable.',
    retryPassport: 'Retry loading passport', passportSource: 'Travel passport · server data',
    stamps: (count) => `${count} stamps`, savedRoutes: (routes) => `Saved itineraries: ${routes}`,
    noSavedRoutes: 'No saved itineraries yet.', suitcaseSource: 'My suitcase · Suitcase data',
    tripsAndGoals: (trips, goals) => `${trips} active trips · ${goals} goals`,
    suitcaseLoading: 'Loading trips and goals…', suitcaseUnavailable: (error) => `Suitcase data is temporarily unavailable: ${error}`,
    suitcaseLoadFailed: 'Could not load suitcase data.',
    retrySuitcase: 'Retry loading suitcase', noTrips: 'No trips yet.', openSuitcase: 'Open suitcase',
    liveModeNote: 'This itinerary has ten stops verified by the server. Completing them unlocks a final round of three questions and a city stamp. The world map, daily quizzes, and manual stop completion are currently available in demo mode only.',
    worldCoverage: 'World coverage', backToMap: 'Back', openCountriesCount: (count) => `${count} of 195 countries`,
    questsCount: (done, total) => `${done} of ${total} quests`, worldMap: 'World map',
    worldMapHint: 'Select an unlocked country to explore its regions and quests',
    openInProgress: 'Unlocked · in progress', blankSpots: 'Undiscovered', countryFocus: 'Country focus',
    completedPercent: (percent) => `${percent}% complete`, focusComplete: 'Focus complete',
    percentToPremium: (percent) => `${percent}% to the premium tier`, weeklyTrack: 'Weekly track',
    lessonProgress: (lesson, total, percent) => `Lesson ${lesson} of ${total}, ${percent}% complete`,
    courseLocked: 'The country course will appear once it is unlocked', categoryProgress: (country) => `Progress by category for ${country}`,
    savings: 'Savings goal', amountOfTarget: (target) => `of ${target}`, 
    ticketDown: (percent) => `Ticket price down ${percent}%`, ticketUp: (percent) => `Ticket price up ${percent}%`,
    weeklySavings: (amount) => `Suggested weekly savings: RUB ${amount}`, passport: 'Travel passport',
    closedCountries: (count) => `Countries completed: ${count}`, resetProgress: 'Reset progress',
    pilotCitiesNote: 'Phase 0 pilot cities: Moscow, Saint Petersburg, and Sochi. Progress is stored in this browser.',
    closed: 'Completed', regions: 'Regions', regionUnlockHint: 'A region is revealed when you complete your first stop there',
    visited: 'Visited', blankSpotLegend: 'Undiscovered', questionOfDay: 'Question of the day', questPoints: 'Quest stops',
    categoryProgressTitle: 'Progress by category', regionUnlockNote: 'Completing at least one stop in a city reveals its region on the country map.',
    unopenedCountry: (country) => `${country} is still undiscovered on your map`,
    openCountryHint: 'Plan a trip to this country in the Itinerary section to reveal its regions, cities, and quest stops.',
    countryClosed: 'Country fully completed', countryClosedFully: 'Country fully completed', cityCount: (count) => `${count} cities`,
    questCategories: 'Categories', noRegions: (country) => `Regions for ${country} are not mapped yet`,
    categoryNames: { sights: 'Sightseeing', food: 'Food', traditions: 'Traditions' },
    worldMapBlankSpot: 'Undiscovered: no itinerary has been planned here yet',
    passportOwner: 'Holder', document: 'Document', countriesLabel: 'Countries', stampsLabel: 'Stamps',
    countrySeals: 'Seals for completed countries', visitMarks: 'Visit stamps', page: (number) => `Page ${number}`,
    share: 'Share', emptyPage: 'This page is still blank', firstStampHint: 'Complete every quest in a city to earn your first stamp.',
    passportDisclaimer: 'Earn a city stamp by completing all its quests, and a country seal by completing all its cities. This Crista document is not a government passport.',
    pilotLabel: 'Content pilot · server path', cityPilotNames: { 'st-petersburg': 'Saint Petersburg', sochi: 'Sochi' },
    pilotNodeNames: {
      'spb-hermitage': 'The Hermitage', 'spb-peterhof': 'Peterhof', 'spb-collection': 'The Hermitage collection',
      'spb-fountains': 'Peterhof fountains', 'spb-peterhof-history': 'The first mention of Peterhof',
      'sochi-national-park': 'Sochi National Park', 'sochi-dendrarium': 'Sochi Arboretum', 'sochi-forest': 'Mountain forests',
      'sochi-mzymta': 'Mzymta River', 'sochi-park-area': 'National park area',
    },
    pilotNodeStates: { completed: 'Completed', unlocked: 'Open', locked: 'Locked' },
    pilotComplete: 'Route complete. All facts include their original sources.',
    pilotContentLanguageNote: 'Fact and question text is currently available only in Russian, the verified server edition.',
    source: 'Source', openSource: 'open', truthOrMyth: 'True or false', timeline: 'Timeline',
    correctXp: (xp) => `Correct! +${xp} XP`, tryAgain: 'Not quite. Try again.', saveAnswerFailed: 'Could not save your answer. Please try again.',
    questUnavailable: 'This quest is temporarily unavailable.',
  },
}

const questCopyEn: Record<string, [string, string]> = {
  'msk-1': ['Red Square', 'Reach Lobnoye Mesto and take a geotagged photo'],
  'msk-2': ['Saint Basil’s Cathedral', 'Find the chapel that gave the cathedral its popular name'],
  'msk-3': ['Tretyakov Gallery', 'Find the Vrubel room'],
  'msk-4': ['Pokrovka pishki', 'Try this local pastry on a weekday before noon'],
  'msk-5': ['VDNKh', 'Walk around the Friendship of Nations fountain'],
  'spb-1': ['The Hermitage', 'Find the Peacock Clock in the Pavilion Hall'],
  'spb-2': ['Church of the Savior on Spilled Blood', 'Look closely at the mosaic above the west entrance'],
  'spb-3': ['Palace Bridge opening', 'Arrive at 1:10 a.m. and capture the bridge opening'],
  'spb-4': ['Bolshaya Konyushennaya pirozhki café', 'Try a pirozhok and coffee the Leningrad way'],
  'spb-5': ['Peter and Paul Fortress', 'Wait for the noon cannon shot'],
  'spb-6': ['Nevsky Prospekt', 'Walk from the Admiralty to Vosstaniya Square'],
  'sochi-1': ['Olympic Park', 'Find the Olympic flame cauldron'],
  'sochi-2': ['Rosa Khutor', 'Take the lift up to 2,320 metres'],
  'sochi-3': ['Tea plantations', 'Try Krasnodar tea where it is grown'],
  'sochi-4': ['Sochi Arboretum', 'Ride the cable car above the park'],
  'tb-1': ['Abanotubani sulfur baths', 'Look beneath the brick domes in the old town'],
  'tb-2': ['Narikala Fortress', 'Take the cable car up at sunset'],
  'tb-3': ['Khinkali on Mtatsminda', 'Eat khinkali without piercing the dough'],
  'bt-1': ['Ali and Nino statue', 'Wait for the figures to pass through one another'],
  'bt-2': ['Adjarian khachapuri', 'Stir the egg yolk into the butter without burning yourself'],
  'is-1': ['Hagia Sophia', 'Find the Byzantine mosaics in the upper gallery'],
  'is-2': ['Grand Bazaar', 'Bargain and bring the price down by at least a third'],
  'is-3': ['Balık ekmek by Galata Bridge', 'Try a fish sandwich served straight from a boat'],
  'be-1': ['Grand Place', 'Walk around the square and find the bakers’ guild house'],
  'be-2': ['Manneken Pis', 'Catch him in costume: his outfit changes more than a hundred times a year'],
  'be-3': ['Street waffles', 'Choose a Liège waffle, not a Brussels one, and eat it without cutlery'],
  'be-4': ['Belfry of Bruges', 'Climb 366 steps and listen for the carillon'],
  'be-5': ['Bruges canals', 'Take a canal trip and count the bridges'],
  'be-6': ['Belgian chocolate', 'Try pralines where they were invented'],
}

function russianCityCount(count: number) {
  const lastTwo = count % 100
  const last = count % 10
  const unit = lastTwo >= 11 && lastTwo <= 14
    ? 'городов'
    : last === 1
      ? 'город'
      : last >= 2 && last <= 4
        ? 'города'
        : 'городов'
  return `${count} ${unit}`
}

export function getGameCopy(language: InterfaceLanguage) {
  return copy[language]
}

export function getQuestCopy(quest: QuestPoint, language: InterfaceLanguage) {
  if (language === 'ru') return { title: quest.title, hint: quest.hint }
  const translated = questCopyEn[quest.id]
  return translated ? { title: translated[0], hint: translated[1] } : { title: quest.title, hint: quest.hint }
}
