// Core domain types for AI Travel Planner v2

// Map place with coordinates
export interface Place {
  id: string
  name: string
  description: string
  type: 'attraction' | 'restaurant' | 'hotel' | 'nature' | 'culture' | 'entertainment'
  coordinates: [number, number] // [lat, lng]
  imageUrl?: string
  rating?: number
  address?: string
  selected?: boolean
  priceRange?: string
  duration?: string
}

// Chat message
export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  places?: Place[] // Places mentioned in this message
  cityName?: string
}

// User state
export type AuthState = 'guest' | 'registered' | 'subscribed'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  authState: AuthState
  subscription?: SubscriptionPlan
}

// Subscription plans
export type SubscriptionPlan = 'basic' | 'pro' | 'premium'

export interface PlanDetails {
  id: SubscriptionPlan
  name: string
  price: number
  priceLabel: string
  features: string[]
  popular?: boolean
}

// Saved route
export interface SavedRoute {
  id: string
  name: string
  destination: string
  days: number
  places: Place[]
  createdAt: string
}

// Modal states
export type ModalType = 'auth' | 'subscription' | 'payment' | 'save-route' | null

// === Backend API types ===

export interface BackendPlace {
  id?: string | null
  name?: string | null
  city?: string | null
  country?: string | null
  description?: string | null
  latitude?: number | null
  longitude?: number | null
  rating?: number | null
  review_count?: number | null
  subtype?: string | null
  activities?: string | null
  postalcode?: string | null
  page_content?: string | null
  [key: string]: unknown
}

export interface BackendSearchResult {
  query: string
  places: BackendPlace[]
  count: number
}

export interface BackendPreferences {
  city?: string | null
  destination_type?: string | null
  budget?: string | null
  travel_companions?: string | null
  activities?: string[]
  duration_days?: number | null
}

export interface BackendRouteMetadata {
  graph_id: string
  build_time_seconds: number
  nodes_count: number
  edges_count: number
  alternatives_count: number
  metrics: Record<string, unknown>
}

export interface BackendMessageOut {
  message: string
  search_results?: BackendSearchResult[] | null
  conversation_complete: boolean
  has_search_results: boolean
  preferences?: BackendPreferences | null
  route_geojson?: Record<string, unknown> | null
  route_metadata?: BackendRouteMetadata | null
}

export interface BackendSessionOutAnon {
  id: string
  title?: string | null
  secret: string
}

export interface BackendHistoryOut {
  session_id: string
  messages: unknown[]
}

export interface SessionState {
  sessionId: string
  sessionSecret: string
}
