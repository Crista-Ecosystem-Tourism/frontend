import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Place } from '@/types'
import { Button } from '@/components/ui/button'
import { PlaceDetailPanel } from './PlaceDetailPanel'
import 'leaflet/dist/leaflet.css'

// Type icons
const typeEmojis: Record<Place['type'], string> = {
  attraction: '🏛️',
  restaurant: '🍽️',
  hotel: '🏨',
  nature: '🌳',
  culture: '🎭',
  entertainment: '🎪',
}

// Create custom marker icon
function createMarkerIcon(place: Place) {
  const emoji = typeEmojis[place.type]
  const isSelected = place.selected

  return new DivIcon({
    className: 'custom-marker',
    html: `
      <div class="relative group cursor-pointer">
        <div class="w-10 h-10 rounded-full ${isSelected ? 'bg-primary ring-2 ring-white' : 'bg-white'} 
          shadow-lg flex items-center justify-center text-lg border-2 ${isSelected ? 'border-primary' : 'border-gray-200'}
          transition-transform hover:scale-110">
          ${emoji}
        </div>
        ${isSelected ? `
          <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

// Map center updater component
function MapUpdater({ center, zoom, selectedPlace }: {
  center: [number, number]
  zoom: number
  selectedPlace: Place | null
}) {
  const map = useMap()

  useEffect(() => {
    if (selectedPlace) {
      map.setView(selectedPlace.coordinates, 15, { animate: true, duration: 0.5 })
    } else {
      map.setView(center, zoom, { animate: true, duration: 0.5 })
    }
  }, [map, center, zoom, selectedPlace])

  return null
}

export function TravelMap() {
  const { places, mapCenter, mapZoom, selectedPlace, setSelectedPlace, routeGeoJSON } = useApp()
  const selectedCount = places.filter(p => p.selected).length

  return (
    <div className="h-full w-full relative">
      {/* Map hint overlay */}
      <AnimatePresence>
        {places.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1000] flex items-center justify-center bg-surface/90 backdrop-blur-sm"
          >
            <div className="text-center p-6 max-w-md">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Карта вашего путешествия
              </h3>
              <p className="text-text-secondary">
                Выберите чат из истории слева или напишите куда планируете поехать,
                и здесь появятся рекомендуемые места для посещения
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full"
        style={{ background: 'var(--color-surface)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={mapCenter} zoom={mapZoom} selectedPlace={selectedPlace} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates}
            icon={createMarkerIcon(place)}
            eventHandlers={{
              click: () => setSelectedPlace(place),
            }}
          />
        ))}

        {routeGeoJSON && (
          <GeoJSON
            key={JSON.stringify(routeGeoJSON)}
            data={routeGeoJSON as unknown as GeoJSON.GeoJsonObject}
            style={{
              color: '#6366f1',
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>

      {/* Place detail panel */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailPanel
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </AnimatePresence>

      {/* Selected places count - show when no detail panel */}
      <AnimatePresence>
        {selectedCount > 0 && !selectedPlace && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 z-[1000] bg-primary text-white rounded-lg p-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Выбрано мест: {selectedCount}
              </span>
              <Button size="sm" variant="secondary">
                Сохранить маршрут
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
