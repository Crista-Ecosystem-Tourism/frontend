import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { ChatMessage, Place, User, AuthState, SubscriptionPlan, ModalType, SavedRoute } from '@/types'
import { welcomeMessage, generateAIResponse, createUserMessage } from '@/mocks/chat'
import { getPlacesByCity, getCityCenter, getCityName, parisPlaces, georgiaPlaces, baliPlaces, altaiPlaces, kyotoPlaces, spbPlaces, kenyaPlaces } from '@/mocks/places'
import { delay, generateId } from '@/lib/utils'

type Theme = 'light' | 'dark'

// Chat history item
export interface ChatHistoryItem {
  id: string
  title: string
  destination: string
  messages: ChatMessage[]
  places: Place[]
  createdAt: string
}

// Trip data for suggestions
interface TripData {
  id: string
  title: string
  cityName: string
  places: Place[]
  userQuery: string
  aiResponse: string
}

const tripDataMap: Record<string, TripData> = {
  'paris-weekend': {
    id: 'paris-weekend',
    title: 'Париж на выходные',
    cityName: 'Париж',
    places: parisPlaces,
    userQuery: 'Хочу провести романтический уикенд в Париже',
    aiResponse: `Прекрасный выбор! 💕 **Париж** — город любви и романтики!

Я подобрал для вас **${parisPlaces.length} лучших мест** для романтического уикенда. Эйфелева башня на закате, прогулка по Монмартру, ужин с видом на Сену — всё это ждёт вас:`,
  },
  'georgia-food': {
    id: 'georgia-food',
    title: 'Гастротур по Грузии',
    cityName: 'Грузия',
    places: georgiaPlaces,
    userQuery: 'Планирую гастрономический тур по Грузии',
    aiResponse: `Отличный выбор! 🍷 **Грузия** — рай для гурманов!

Хинкали, хачапури, вино из квеври — вас ждёт невероятное гастрономическое приключение. Вот **${georgiaPlaces.length} мест**, которые обязательно стоит посетить:`,
  },
  'bali-beaches': {
    id: 'bali-beaches',
    title: 'Пляжи Бали',
    cityName: 'Бали',
    places: baliPlaces,
    userQuery: 'Ищу идеальный пляжный отдых на Бали',
    aiResponse: `Великолепно! 🌴 **Бали** — остров богов и райских пляжей!

Лазурные воды, закаты в beach-клубах, храмы на скалах — вот **${baliPlaces.length} мест**, которые сделают ваш отдых незабываемым:`,
  },
  'altai-trekking': {
    id: 'altai-trekking',
    title: 'Горы Алтая',
    cityName: 'Алтай',
    places: altaiPlaces,
    userQuery: 'Хочу отправиться в треккинг по горам Алтая',
    aiResponse: `Потрясающе! ⛰️ **Алтай** — сердце Сибири и место силы!

Снежные вершины, бирюзовые озёра, марсианские пейзажи — вас ждёт настоящее приключение. Вот **${altaiPlaces.length} мест** для вашего треккинга:`,
  },
  'kyoto-culture': {
    id: 'kyoto-culture',
    title: 'Культура Киото',
    cityName: 'Киото',
    places: kyotoPlaces,
    userQuery: 'Интересует культурная программа в Киото',
    aiResponse: `Прекрасный выбор! 🎎 **Киото** — душа Японии и хранитель традиций!

Храмы, гейши, бамбуковые рощи — здесь время течёт иначе. Вот **${kyotoPlaces.length} мест** для погружения в японскую культуру:`,
  },
  'europe-tour': {
    id: 'europe-tour',
    title: 'Тур по Европе',
    cityName: 'Париж',
    places: parisPlaces,
    userQuery: 'Планирую путешествие по Европе на 2 недели',
    aiResponse: `Отличный план! 🇪🇺 Начнём ваш **тур по Европе** с Парижа!

Для двух недель я рекомендую маршрут: Париж → Амстердам → Берлин → Прага. Вот **${parisPlaces.length} мест** для старта в Париже:`,
  },
  'spb-excursions': {
    id: 'spb-excursions',
    title: 'Санкт-Петербург',
    cityName: 'Санкт-Петербург',
    places: spbPlaces,
    userQuery: 'Хочу организовать экскурсии по Санкт-Петербургу',
    aiResponse: `Великолепно! 🏛️ **Санкт-Петербург** — культурная столица России!

Эрмитаж, белые ночи, разводные мосты — город поразит вас своей красотой. Вот **${spbPlaces.length} мест**, которые обязательно стоит увидеть:`,
  },
  'kenya-safari': {
    id: 'kenya-safari',
    title: 'Сафари в Кении',
    cityName: 'Кения',
    places: kenyaPlaces,
    userQuery: 'Мечтаю о сафари в Кении',
    aiResponse: `Невероятно! 🦁 **Кения** — родина настоящего африканского сафари!

Львы, слоны, Великая миграция — вас ждёт приключение всей жизни. Вот **${kenyaPlaces.length} мест** для вашего сафари:`,
  },
}

interface AppContextType {
  // Theme
  theme: Theme
  toggleTheme: () => void

  // User & Auth
  user: User | null
  authState: AuthState
  login: (provider: 'yandex' | 'google') => void
  logout: () => void
  subscribe: (plan: SubscriptionPlan) => void

  // Chat
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (content: string) => Promise<void>

  // Chat History
  chatHistory: ChatHistoryItem[]
  currentChatId: string | null
  loadChat: (chatId: string) => void
  newChat: () => void
  loadTripChat: (tripId: string) => void
  
  // Map
  places: Place[]
  selectedPlace: Place | null
  setSelectedPlace: (place: Place | null) => void
  mapCenter: [number, number]
  mapZoom: number
  togglePlaceSelection: (placeId: string) => void
  
  // Routes
  savedRoutes: SavedRoute[]
  saveCurrentRoute: (name: string) => void
  
  // Modals
  activeModal: ModalType
  openModal: (modal: ModalType) => void
  closeModal: () => void
  selectedPlan: SubscriptionPlan | null
  setSelectedPlan: (plan: SubscriptionPlan | null) => void

  // Navigation
  goHome: () => void
  
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
    if (document.documentElement.classList.contains('dark')) {
      return 'dark'
    }
  }
  return 'dark'
}

// Create mock chat history with places
function createMockChatHistory(): ChatHistoryItem[] {
  const cities = [
    { name: 'Краснодар', title: 'Краснодар на выходные', days: 3 },
    { name: 'Москва', title: 'Неделя в Москве', days: 7 },
    { name: 'Санкт-Петербург', title: 'Питер весной', days: 5 },
    { name: 'Сочи', title: 'Сочи летом', days: 4 },
    { name: 'Казань', title: 'Казань 3 дня', days: 3 },
  ]

  return cities.map((city, index) => {
    const places = getPlacesByCity(city.name)
    const cityName = getCityName(city.name)
    
    const userMessage: ChatMessage = {
      id: `user-hist-${index}`,
      role: 'user',
      content: `Планирую ${city.name} на ${city.days} дня`,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
    }
    
    const aiMessage: ChatMessage = {
      id: `ai-hist-${index}`,
      role: 'assistant',
      content: `Отличный выбор! 🎉 **${cityName}** — прекрасное место для путешествия!\n\nЯ подобрал для вас **${places.length} интересных мест** на ${city.days} дня. Вот самые популярные:`,
      createdAt: new Date(Date.now() - (index + 1) * 86400000 + 1000).toISOString(),
      places,
      cityName,
    }

    return {
      id: `chat-${index + 1}`,
      title: city.title,
      destination: cityName,
      messages: [welcomeMessage, userMessage, aiMessage],
      places,
      createdAt: new Date(Date.now() - (index + 1) * 86400000).toISOString(),
    }
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  
  // User
  const [user, setUser] = useState<User | null>(null)
  const [authState, setAuthState] = useState<AuthState>('guest')
  
  // Chat History
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => createMockChatHistory())
  const [currentChatId, setCurrentChatId] = useState<string | null>(null) // Start with null for Home view
  
  // Get current chat data

  const currentChat = chatHistory.find(c => c.id === currentChatId)
  
  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>(currentChat?.messages || [welcomeMessage])
  const [isTyping, setIsTyping] = useState(false)
  
  // Map
  const [places, setPlaces] = useState<Place[]>(currentChat?.places || [])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    if (currentChat?.destination) {
      return getCityCenter(currentChat.destination)
    }
    return [45.0355, 38.9753]
  })
  const [mapZoom, setMapZoom] = useState(12)
  
  // Routes
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])
  
  // Modals
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  
  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auth prompt flag
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', theme)
    } catch { /* ignore */ }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // Auth functions
  const login = useCallback((provider: 'yandex' | 'google') => {
    const mockUser: User = {
      id: 'user-1',
      name: provider === 'yandex' ? 'Иван Петров' : 'Ivan Petrov',
      email: provider === 'yandex' ? 'ivan@yandex.ru' : 'ivan@gmail.com',
      authState: 'registered',
    }
    setUser(mockUser)
    setAuthState('registered')
    setActiveModal(null)
    
    setTimeout(() => {
      setActiveModal('subscription')
    }, 500)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAuthState('guest')
    setCurrentChatId(null)
  }, [])

  // Navigation - go to home screen
  const goHome = useCallback(() => {
    setCurrentChatId(null)
  }, [])

  const subscribe = useCallback((plan: SubscriptionPlan) => {
    if (user) {
      setUser({ ...user, authState: 'subscribed', subscription: plan })
      setAuthState('subscribed')
    }
    setActiveModal(null)
  }, [user])

  // Load chat from history
  const loadChat = useCallback((chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId)
    if (chat) {
      setCurrentChatId(chatId)
      setMessages(chat.messages)
      setPlaces(chat.places)
      setSelectedPlace(null)
      
      if (chat.destination) {
        setMapCenter(getCityCenter(chat.destination))
        setMapZoom(13)
      }
    }
  }, [chatHistory])

  // Create new chat
  const newChat = useCallback(() => {
    const newId = `chat-${generateId()}`
    setCurrentChatId(newId)
    setMessages([welcomeMessage])
    setPlaces([])
    setSelectedPlace(null)
    setMapCenter([55.7558, 37.6173]) // Default to Moscow
    setMapZoom(10)
  }, [])

  // Load a pre-made trip chat from suggestions
  const loadTripChat = useCallback((tripId: string) => {
    const tripData = tripDataMap[tripId]
    if (!tripData) return

    const newId = `trip-${tripId}-${generateId()}`

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: tripData.userQuery,
      createdAt: new Date().toISOString(),
    }

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: tripData.aiResponse,
      createdAt: new Date().toISOString(),
      places: tripData.places,
      cityName: tripData.cityName,
    }

    setCurrentChatId(newId)
    setMessages([welcomeMessage, userMessage, aiMessage])
    setPlaces(tripData.places)
    setSelectedPlace(null)
    setMapCenter(getCityCenter(tripData.cityName))
    setMapZoom(13)

    // Add to chat history
    setChatHistory(prev => [
      {
        id: newId,
        title: tripData.title,
        destination: tripData.cityName,
        messages: [welcomeMessage, userMessage, aiMessage],
        places: tripData.places,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }, [])

  // Chat functions
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMsg = createUserMessage(content)
    setMessages(prev => [...prev, userMsg])

    setIsTyping(true)
    await delay(1500 + Math.random() * 1000)

    const { message: aiResponse, places: newPlaces } = generateAIResponse(content)
    
    setMessages(prev => [...prev, aiResponse])
    setIsTyping(false)

    if (newPlaces.length > 0) {
      setPlaces(newPlaces)
      const center = getCityCenter(content)
      setMapCenter(center)
      setMapZoom(13)
      
      // Update chat history
      const cityName = getCityName(content)
      if (currentChatId) {
        setChatHistory(prev => {
          const existingIndex = prev.findIndex(c => c.id === currentChatId)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = {
              ...updated[existingIndex],
              messages: [...updated[existingIndex].messages, userMsg, aiResponse],
              places: newPlaces,
            }
            return updated
          }
          return [
            {
              id: currentChatId,
              title: `${cityName} ${new Date().toLocaleDateString('ru')}`,
              destination: cityName,
              messages: [welcomeMessage, userMsg, aiResponse],
              places: newPlaces,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]
        })
      }
      
      if (authState === 'guest' && !hasShownAuthPrompt) {
        setTimeout(() => {
          setActiveModal('auth')
          setHasShownAuthPrompt(true)
        }, 2000)
      }
    }
  }, [authState, hasShownAuthPrompt, currentChatId])

  // Toggle place selection
  const togglePlaceSelection = useCallback((placeId: string) => {
    if (authState !== 'subscribed') {
      setActiveModal('subscription')
      return
    }
    
    setPlaces(prev => prev.map(p => 
      p.id === placeId ? { ...p, selected: !p.selected } : p
    ))
  }, [authState])

  // Save route
  const saveCurrentRoute = useCallback((name: string) => {
    if (authState !== 'subscribed') {
      setActiveModal('subscription')
      return
    }
    
    const selectedPlaces = places.filter(p => p.selected)
    if (selectedPlaces.length === 0) return
    
    const newRoute: SavedRoute = {
      id: `route-${Date.now()}`,
      name,
      destination: 'Краснодар',
      days: 3,
      places: selectedPlaces,
      createdAt: new Date().toISOString(),
    }
    
    setSavedRoutes(prev => [...prev, newRoute])
    setActiveModal(null)
  }, [authState, places])

  // Modal functions
  const openModal = useCallback((modal: ModalType) => {
    setActiveModal(modal)
  }, [])

  const closeModal = useCallback(() => {
    setActiveModal(null)
    setSelectedPlan(null)
  }, [])

  const value: AppContextType = {
    theme,
    toggleTheme,
    user,
    authState,
    login,
    logout,
    subscribe,
    messages,
    isTyping,
    sendMessage,
    chatHistory,
    currentChatId,
    loadChat,
    newChat,
    loadTripChat,
    places,
    selectedPlace,
    setSelectedPlace,
    mapCenter,
    mapZoom,
    togglePlaceSelection,
    savedRoutes,
    saveCurrentRoute,
    activeModal,
    openModal,
    closeModal,
    selectedPlan,
    setSelectedPlan,
    goHome,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
