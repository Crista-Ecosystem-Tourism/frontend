import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react'
import { ChatMessage, Place, User, AuthState, SubscriptionPlan, ModalType, SavedRoute, SessionState, BackendRouteMetadata, BackendPreferences, SuggestedReplyGroup } from '@/types'
import { welcomeMessage, generateAIResponse, createUserMessage } from '@/mocks/chat'
import { getPlacesByCity, getCityCenter, getCityName, parisPlaces, georgiaPlaces, baliPlaces, altaiPlaces, kyotoPlaces, spbPlaces, kenyaPlaces } from '@/mocks/places'
import { delay, generateId } from '@/lib/utils'
import { isMockMode, checkHealth, createSession, sendMessage as apiSendMessage, loadSession, clearSession, listSessions, getHistory } from '@/api/chatApi'
import { mapMessageOutToChatMessage, mapHistoryToMessages, computeMapCenter, computeMapZoom } from '@/api/mappers'
import { ApiError } from '@/api/chatApi'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout, getToken } from '@/api/authApi'
import { buildGraph } from '@/api/graphApi'

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
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  authLoading: boolean
  authError: string | null
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
  ratePlace: (placeId: string, rating: number) => void
  graphGeoJSON: Record<string, unknown> | null
  buildingGraph: boolean
  buildPlaceGraph: () => Promise<void>

  // Routes
  savedRoutes: SavedRoute[]
  saveCurrentRoute: (name: string) => void
  
  // Modals
  activeModal: ModalType
  openModal: (modal: ModalType) => void
  closeModal: () => void
  selectedPlan: SubscriptionPlan | null
  setSelectedPlan: (plan: SubscriptionPlan | null) => void

  // Mobile tab
  mobileActiveTab: 'chat' | 'map'
  setMobileActiveTab: (tab: 'chat' | 'map') => void

  // Navigation
  goHome: () => void
  
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void

  // Backend
  backendAvailable: boolean
  apiError: string | null
  clearApiError: () => void
  routeGeoJSON: Record<string, unknown> | null
  routeMetadata: BackendRouteMetadata | null
  preferences: BackendPreferences | null
  suggestedReplies: SuggestedReplyGroup[] | null
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
  
  // Chat History — mock history only when using mocks
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() =>
    isMockMode() ? createMockChatHistory() : []
  )
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
  
  // Mobile tab
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'map'>('chat')

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auth
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [hasShownAuthPrompt, setHasShownAuthPrompt] = useState(false)

  // Backend integration
  const [backendAvailable, setBackendAvailable] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [routeGeoJSON, setRouteGeoJSON] = useState<Record<string, unknown> | null>(null)
  const [routeMetadata, setRouteMetadata] = useState<BackendRouteMetadata | null>(null)
  const [preferences, setPreferences] = useState<BackendPreferences | null>(null)
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReplyGroup[] | null>(null)
  const [graphGeoJSON, setGraphGeoJSON] = useState<Record<string, unknown> | null>(null)
  const [buildingGraph, setBuildingGraph] = useState(false)
  const sessionRef = useRef<SessionState | null>(loadSession())

  // Helper: restore chat history from a session
  const restoreSessionHistory = useCallback(async (sessionId: string, sessionSecret: string) => {
    try {
      console.log('[restore] Loading history for session:', sessionId)
      const historyOut = await getHistory(sessionId, sessionSecret, 'full')
      console.log('[restore] History response:', historyOut)
      const msgs = mapHistoryToMessages(historyOut.messages, sessionId)
      console.log('[restore] Mapped messages:', msgs.length)
      if (msgs.length > 0) {
        setMessages([welcomeMessage, ...msgs])
        setCurrentChatId(sessionId)
        sessionRef.current = { sessionId, sessionSecret }
      }
    } catch (err) {
      console.error('[restore] Failed to load history:', err)
    }
  }, [])

  // Health check + restore auth + restore chat on mount
  useEffect(() => {
    if (isMockMode()) {
      setBackendAvailable(false)
      return
    }

    const init = async () => {
      const ok = await checkHealth()
      console.log('[init] Health check:', ok)
      setBackendAvailable(ok)
      if (!ok) return

      const savedSession = sessionRef.current
      console.log('[init] Saved session from sessionStorage:', savedSession)
      console.log('[init] Auth token present:', !!getToken())

      // Restore user session from stored token
      if (getToken()) {
        try {
          const authUser = await getMe()
          setUser({
            id: authUser.id,
            name: authUser.name || '',
            email: authUser.email,
            authState: 'registered',
          })
          setAuthState('registered')

          const sessions = await listSessions()
          if (sessions && sessions.length > 0) {
            setChatHistory(sessions.map(s => ({
              id: s.id,
              title: s.title || 'Без названия',
              destination: '',
              messages: [],
              places: [],
              createdAt: s.updated_at || new Date().toISOString(),
            })))

            // Restore last active session (first in list = most recent)
            const lastSession = savedSession && sessions.some(s => s.id === savedSession.sessionId)
              ? savedSession
              : { sessionId: sessions[0].id, sessionSecret: '' }
            await restoreSessionHistory(lastSession.sessionId, lastSession.sessionSecret)
          }
        } catch {
          // Token invalid/expired — stay as guest
        }
      } else if (savedSession) {
        // Anonymous user — restore session from sessionStorage
        await restoreSessionHistory(savedSession.sessionId, savedSession.sessionSecret)
      }
    }

    init()
  }, [restoreSessionHistory])

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
  const loadUserSessions = useCallback(async () => {
    try {
      const sessions = await listSessions()
      setChatHistory(sessions.map(s => ({
        id: s.id,
        title: s.title || 'Без названия',
        destination: '',
        messages: [],
        places: [],
        createdAt: s.updated_at || new Date().toISOString(),
      })))
    } catch { /* ignore — user may have no sessions */ }
  }, [])

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { user: authUser } = await apiLogin(email, password)
      setUser({
        id: authUser.id,
        name: authUser.name || '',
        email: authUser.email,
        authState: 'registered',
      })
      setAuthState('registered')
      setActiveModal(null)
      await loadUserSessions()
    } catch (error) {
      const msg = error instanceof ApiError ? error.detail : 'Ошибка входа'
      setAuthError(msg)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [loadUserSessions])

  const registerWithEmail = useCallback(async (email: string, password: string, name: string) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const { user: authUser } = await apiRegister(email, password, name)
      setUser({
        id: authUser.id,
        name: authUser.name || '',
        email: authUser.email,
        authState: 'registered',
      })
      setAuthState('registered')
      setActiveModal(null)
    } catch (error) {
      const msg = error instanceof ApiError ? error.detail : 'Ошибка регистрации'
      setAuthError(msg)
      throw error
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
    setAuthState('guest')
    setCurrentChatId(null)
    setAuthError(null)
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

  // Clear API error
  const clearApiError = useCallback(() => {
    setApiError(null)
  }, [])

  // Ensure we have an active session
  const ensureSession = useCallback(async (): Promise<SessionState> => {
    if (sessionRef.current) return sessionRef.current
    const session = await createSession()
    sessionRef.current = session
    return session
  }, [])

  // Load chat from history — fetches messages from backend if needed
  const loadChat = useCallback(async (chatId: string) => {
    setCurrentChatId(chatId)
    setSelectedPlace(null)
    setRouteGeoJSON(null)
    setRouteMetadata(null)
    setPreferences(null)
    setSuggestedReplies(null)

    const chat = chatHistory.find(c => c.id === chatId)

    // If messages already loaded locally
    if (chat && chat.messages.length > 0) {
      setMessages(chat.messages)
      setPlaces(chat.places)
      if (chat.places.length > 0) {
        setMapCenter(computeMapCenter(chat.places))
        setMapZoom(computeMapZoom(chat.places))
      }
      // Set session ref so new messages go to this session
      sessionRef.current = { sessionId: chatId, sessionSecret: '' }
      return
    }

    // Load from backend
    if (!isMockMode() && backendAvailable) {
      try {
        const secret = sessionRef.current?.sessionId === chatId
          ? sessionRef.current.sessionSecret
          : ''
        const historyOut = await getHistory(chatId, secret, 'full')
        const restoredMessages = mapHistoryToMessages(historyOut.messages, chatId)
        const loadedMessages = restoredMessages.length > 0
          ? [welcomeMessage, ...restoredMessages]
          : [welcomeMessage]
        setMessages(loadedMessages)
        setPlaces([])
        sessionRef.current = { sessionId: chatId, sessionSecret: secret }

        // Update chatHistory entry with loaded messages
        setChatHistory(prev => prev.map(c =>
          c.id === chatId ? { ...c, messages: loadedMessages } : c
        ))
      } catch {
        setMessages([welcomeMessage])
        setPlaces([])
        sessionRef.current = { sessionId: chatId, sessionSecret: '' }
      }
    } else if (chat) {
      setMessages(chat.messages.length > 0 ? chat.messages : [welcomeMessage])
      setPlaces(chat.places)
    }
  }, [chatHistory, backendAvailable])

  // Create new chat
  const newChat = useCallback(async () => {
    setMessages([welcomeMessage])
    setPlaces([])
    setSelectedPlace(null)
    setMapCenter([55.7558, 37.6173]) // Default to Moscow
    setMapZoom(10)
    setRouteGeoJSON(null)
    setRouteMetadata(null)
    setPreferences(null)
    setSuggestedReplies(null)
    setApiError(null)

    // Create session on backend immediately to get correct ID
    if (!isMockMode() && backendAvailable) {
      try {
        const session = await createSession()
        sessionRef.current = session
        setCurrentChatId(session.sessionId)
        return
      } catch {
        // Backend unavailable — fall through to local ID
      }
    }

    // Fallback: local ID for mock/offline mode
    const newId = `chat-${generateId()}`
    setCurrentChatId(newId)
    sessionRef.current = null
    clearSession()
  }, [backendAvailable])

  // Chat functions
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMsg = createUserMessage(content)
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setApiError(null)
    setSuggestedReplies(null)

    const useMocks = isMockMode() || !backendAvailable

    try {
      let aiResponse: ChatMessage
      let newPlaces: Place[] = []

      if (useMocks) {
        // Mock path
        await delay(1500 + Math.random() * 1000)
        const mockResult = generateAIResponse(content)
        aiResponse = mockResult.message
        newPlaces = mockResult.places
      } else {
        // Real API path
        const session = await ensureSession()

        // Sync currentChatId with backend session ID if they differ
        if (currentChatId !== session.sessionId) {
          const oldId = currentChatId
          setCurrentChatId(session.sessionId)
          setChatHistory(prev => prev.map(c =>
            c.id === oldId ? { ...c, id: session.sessionId } : c
          ))
        }

        const response = await apiSendMessage(
          session.sessionId,
          content,
          session.sessionSecret
        )

        const mapped = mapMessageOutToChatMessage(response)
        aiResponse = mapped.chatMessage
        newPlaces = mapped.places

        // Save preferences if present
        if (mapped.preferences) setPreferences(mapped.preferences)

        // Update suggested replies
        setSuggestedReplies(mapped.suggestedReplies)

        // Save route data if present
        if (response.route_geojson) setRouteGeoJSON(response.route_geojson)
        if (response.route_metadata) setRouteMetadata(response.route_metadata)
      }

      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)

      if (newPlaces.length > 0) {
        setPlaces(newPlaces)

        if (useMocks) {
          const center = getCityCenter(content)
          setMapCenter(center)
          setMapZoom(13)
        } else {
          setMapCenter(computeMapCenter(newPlaces))
          setMapZoom(computeMapZoom(newPlaces))
        }

        // Update chat history
        const cityName = useMocks ? getCityName(content) : (newPlaces[0]?.address?.split(',')[0] || 'Путешествие')
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
    } catch (error) {
      setIsTyping(false)

      let errorMessage: string
      if (error instanceof ApiError) {
        if (error.status === 403) {
          // Session invalid — reset and retry will create new one
          sessionRef.current = null
          clearSession()
          errorMessage = 'Сессия истекла. Пожалуйста, отправьте сообщение ещё раз.'
        } else if (error.status >= 500) {
          errorMessage = 'Сервер временно недоступен. Попробуйте позже.'
        } else {
          errorMessage = error.detail
        }
      } else {
        // Network error — fall back to mocks on next call
        setBackendAvailable(false)
        errorMessage = 'Не удалось подключиться к серверу. Переключаемся на офлайн-режим.'
      }

      setApiError(errorMessage)
      const systemMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        content: errorMessage,
        createdAt: new Date().toISOString(),
      }
      setMessages(prev => [...prev, systemMsg])
    }
  }, [authState, hasShownAuthPrompt, currentChatId, backendAvailable, ensureSession])

  // Load a pre-made trip chat from suggestions
  const loadTripChat = useCallback((tripId: string) => {
    const tripData = tripDataMap[tripId]
    if (!tripData) return

    const useMocks = isMockMode() || !backendAvailable

    if (!useMocks) {
      // When backend is available, start a new chat and send the query via API
      const newId = `trip-${tripId}-${generateId()}`
      setCurrentChatId(newId)
      setMessages([welcomeMessage])
      setPlaces([])
      setSelectedPlace(null)
      setRouteGeoJSON(null)
      setRouteMetadata(null)
      setPreferences(null)
      setSuggestedReplies(null)
      setApiError(null)
      sessionRef.current = null
      clearSession()
      // Send the trip query through the real API pipeline
      setTimeout(() => sendMessage(tripData.userQuery), 100)
      return
    }

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
  }, [backendAvailable, sendMessage])

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

  // Rate a place (1-5 stars, 0 = clear)
  const ratePlace = useCallback((placeId: string, rating: number) => {
    setPlaces(prev => prev.map(p =>
      p.id === placeId ? { ...p, userRating: rating || undefined } : p
    ))
  }, [])

  // Build place graph ("паутинка") from rated places
  const buildPlaceGraph = useCallback(async () => {
    const ratedPlaces = places.filter(p => p.userRating && p.userRating > 0)
    if (ratedPlaces.length < 2) return
    setBuildingGraph(true)
    try {
      const result = await buildGraph(ratedPlaces)
      setGraphGeoJSON(result.geojson)
    } catch (e) {
      console.error('Graph build error:', e)
      setApiError('Ошибка построения паутинки')
    } finally {
      setBuildingGraph(false)
    }
  }, [places])

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

  // Wrapped setSelectedPlace: auto-switch to map on mobile when selecting a place
  const handleSetSelectedPlace = useCallback((place: Place | null) => {
    setSelectedPlace(place)
    if (place) {
      setMobileActiveTab('map')
    }
  }, [])

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
    loginWithEmail,
    registerWithEmail,
    logout,
    authLoading,
    authError,
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
    setSelectedPlace: handleSetSelectedPlace,
    mapCenter,
    mapZoom,
    togglePlaceSelection,
    ratePlace,
    graphGeoJSON,
    buildingGraph,
    buildPlaceGraph,
    savedRoutes,
    saveCurrentRoute,
    activeModal,
    openModal,
    closeModal,
    selectedPlan,
    setSelectedPlan,
    mobileActiveTab,
    setMobileActiveTab,
    goHome,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    backendAvailable,
    apiError,
    clearApiError,
    routeGeoJSON,
    routeMetadata,
    preferences,
    suggestedReplies,
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
