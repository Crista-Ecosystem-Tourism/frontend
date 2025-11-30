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
