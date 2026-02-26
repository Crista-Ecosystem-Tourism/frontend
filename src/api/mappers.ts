import type { Place, ChatMessage, BackendPlace, BackendSearchResult, BackendMessageOut, BackendPreferences } from '@/types'
import { generateId } from '@/lib/utils'

// Subtype → Place type mapping
const subtypeMap: Record<string, Place['type']> = {
  'ресторан': 'restaurant',
  'кафе': 'restaurant',
  'бар': 'restaurant',
  'кофейня': 'restaurant',
  'столовая': 'restaurant',
  'пиццерия': 'restaurant',
  'пекарня': 'restaurant',
  'музей': 'culture',
  'театр': 'culture',
  'галерея': 'culture',
  'библиотека': 'culture',
  'храм': 'culture',
  'церковь': 'culture',
  'собор': 'culture',
  'мечеть': 'culture',
  'монастырь': 'culture',
  'парк': 'nature',
  'сад': 'nature',
  'пляж': 'nature',
  'озеро': 'nature',
  'река': 'nature',
  'гора': 'nature',
  'лес': 'nature',
  'заповедник': 'nature',
  'отель': 'hotel',
  'гостиница': 'hotel',
  'хостел': 'hotel',
  'кинотеатр': 'entertainment',
  'клуб': 'entertainment',
  'аквапарк': 'entertainment',
  'зоопарк': 'entertainment',
  'цирк': 'entertainment',
  'аттракцион': 'entertainment',
}

function mapSubtypeToType(subtype?: string | null): Place['type'] {
  if (!subtype) return 'attraction'
  const lower = subtype.toLowerCase()
  for (const [key, value] of Object.entries(subtypeMap)) {
    if (lower.includes(key)) return value
  }
  return 'attraction'
}

/** Map a single BackendPlace to a frontend Place */
export function mapBackendPlace(bp: BackendPlace, index: number): Place {
  const description = bp.description || bp.page_content || ''
  const addressParts = [bp.city, bp.country].filter(Boolean)

  return {
    id: bp.id || `backend-place-${index}-${generateId()}`,
    name: bp.name || 'Без названия',
    description,
    type: mapSubtypeToType(bp.subtype),
    coordinates: [bp.latitude ?? 0, bp.longitude ?? 0],
    rating: bp.rating ?? undefined,
    address: addressParts.length > 0 ? addressParts.join(', ') : undefined,
  }
}

/** Map an array of BackendPlace to frontend Place[], filtering out places without coordinates */
export function mapBackendPlaces(backendPlaces: BackendPlace[]): Place[] {
  return backendPlaces
    .filter(bp => bp.latitude != null && bp.longitude != null && (bp.latitude !== 0 || bp.longitude !== 0))
    .map((bp, i) => mapBackendPlace(bp, i))
}

/** Flatten multiple BackendSearchResult into a deduplicated Place[] */
export function flattenSearchResults(results: BackendSearchResult[]): Place[] {
  const allBackendPlaces: BackendPlace[] = []
  const seenIds = new Set<string>()

  for (const result of results) {
    for (const place of result.places) {
      const id = place.id || ''
      if (id && seenIds.has(id)) continue
      if (id) seenIds.add(id)
      allBackendPlaces.push(place)
    }
  }

  return mapBackendPlaces(allBackendPlaces)
}

/** Map a BackendMessageOut to a ChatMessage, extracted places, and preferences */
export function mapMessageOutToChatMessage(
  response: BackendMessageOut
): { chatMessage: ChatMessage; places: Place[]; preferences: BackendPreferences | null } {
  const content = response.message
  let places: Place[] = []

  if (response.search_results && response.search_results.length > 0) {
    places = flattenSearchResults(response.search_results)
  }

  const chatMessage: ChatMessage = {
    id: `ai-${Date.now()}-${generateId()}`,
    role: 'assistant',
    content,
    createdAt: new Date().toISOString(),
    places: places.length > 0 ? places : undefined,
  }

  return { chatMessage, places, preferences: response.preferences ?? null }
}

/** Compute map center from a list of places */
export function computeMapCenter(places: Place[]): [number, number] {
  if (places.length === 0) return [55.7558, 37.6173] // Default: Moscow

  const sumLat = places.reduce((sum, p) => sum + p.coordinates[0], 0)
  const sumLng = places.reduce((sum, p) => sum + p.coordinates[1], 0)

  return [sumLat / places.length, sumLng / places.length]
}

/** Compute appropriate zoom level based on place spread */
export function computeMapZoom(places: Place[]): number {
  if (places.length <= 1) return 14

  const lats = places.map(p => p.coordinates[0])
  const lngs = places.map(p => p.coordinates[1])

  const latSpread = Math.max(...lats) - Math.min(...lats)
  const lngSpread = Math.max(...lngs) - Math.min(...lngs)
  const maxSpread = Math.max(latSpread, lngSpread)

  if (maxSpread > 10) return 5
  if (maxSpread > 5) return 7
  if (maxSpread > 2) return 9
  if (maxSpread > 0.5) return 11
  if (maxSpread > 0.1) return 13
  return 14
}
