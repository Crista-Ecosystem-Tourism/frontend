import { motion } from 'framer-motion'
import { X, Star, Clock, Wallet, MapPin, Navigation, Check, Plus, Heart } from 'lucide-react'
import { Place } from '@/types'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'


interface PlaceDetailPanelProps {
  place: Place
  onClose: () => void
}

const typeLabels: Record<Place['type'], { label: string; emoji: string }> = {
  attraction: { label: 'Достопримечательность', emoji: '🏛️' },
  restaurant: { label: 'Ресторан', emoji: '🍽️' },
  hotel: { label: 'Отель', emoji: '🏨' },
  nature: { label: 'Природа', emoji: '🌳' },
  culture: { label: 'Культура', emoji: '🎭' },
  entertainment: { label: 'Развлечения', emoji: '🎪' },
}

export function PlaceDetailPanel({ place, onClose }: PlaceDetailPanelProps) {
  const { togglePlaceSelection, authState, openModal } = useApp()
  const typeInfo = typeLabels[place.type]

  const handleAddToRoute = () => {
    if (authState !== 'subscribed') {
      openModal('subscription')
      return
    }
    togglePlaceSelection(place.id)
  }

  const handleOpenMaps = () => {
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent(place.name + ' ' + (place.address || ''))}`
    window.open(url, '_blank')
  }

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-[360px] bg-surface border-l border-border shadow-2xl z-[1001] flex flex-col"
    >
      {/* Header Image */}
      <div className="relative h-48 flex-shrink-0">
        {place.imageUrl ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-6xl">{typeInfo.emoji}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm flex items-center gap-1.5">
          <span>{typeInfo.emoji}</span>
          <span>{typeInfo.label}</span>
        </div>

        {/* Selected badge */}
        {place.selected && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-sm flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>В маршруте</span>
          </div>
        )}

        {/* Title on image */}
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-xl font-bold text-white mb-1 line-clamp-2">{place.name}</h2>
          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white font-medium">{place.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Address */}
        {place.address && (
          <div className="flex items-start gap-2 mb-4 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-4">
          {place.duration && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-sm">
              <Clock className="w-4 h-4 text-text-muted" />
              <span className="text-text">{place.duration}</span>
            </div>
          )}
          {place.priceRange && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light text-sm">
              <Wallet className="w-4 h-4 text-text-muted" />
              <span className="text-text">{place.priceRange}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text mb-2">Описание</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Coordinates */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-text mb-2">Координаты</h3>
          <p className="text-sm text-text-muted font-mono">
            {place.coordinates[0].toFixed(4)}, {place.coordinates[1].toFixed(4)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border space-y-2 flex-shrink-0">
        <Button
          className="w-full gap-2"
          onClick={handleAddToRoute}
          variant={place.selected ? 'default' : 'outline'}
        >
          {place.selected ? (
            <>
              <Check className="w-4 h-4" />
              В маршруте
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Добавить в маршрут
            </>
          )}
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleOpenMaps}>
            <Navigation className="w-4 h-4" />
            Маршрут
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Heart className="w-4 h-4" />
            В избранное
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

