import { MutableRefObject } from 'react'
import { Star, Heart } from 'lucide-react'
import { Place } from '@/types'
import { useApp } from '@/context/AppContext'
import { StarRating } from '@/components/ui/StarRating'

interface PlaceCardProps {
  place: Place
  index: number
  dragRef?: MutableRefObject<{ active: boolean; moved: boolean }>
}

const typeEmoji: Record<Place['type'], string> = {
  attraction: '🏛️',
  restaurant: '🍽️',
  hotel: '🏨',
  nature: '🌳',
  culture: '🎭',
  entertainment: '🎪',
}

export function PlaceCard({ place, dragRef }: PlaceCardProps) {
  const { togglePlaceSelection, setSelectedPlace, ratePlace } = useApp()
  const emoji = typeEmoji[place.type]

  const handleCardClick = () => {
    if (dragRef?.current.moved) return
    setSelectedPlace(place)
  }

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    togglePlaceSelection(place.id)
  }

  return (
    <div className="relative flex-shrink-0 w-[160px]">
      <div
        onClick={handleCardClick}
        className={`
          rounded-xl overflow-hidden cursor-pointer
          bg-surface border border-border/50 hover:border-primary/30
          shadow-sm hover:shadow-md transition-all duration-200
          ${place.selected ? 'ring-2 ring-primary' : ''}
        `}
      >
        {/* Image */}
        <div className="relative h-[100px]">
          {place.imageUrl ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-3xl">{emoji}</span>
            </div>
          )}

          {/* Rating badge */}
          {place.rating && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
              {place.rating}
            </div>
          )}

          {/* Heart button — toggle add to route */}
          <button
            onClick={handleHeartClick}
            className={`
              absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center
              transition-all duration-200 backdrop-blur-sm
              ${place.selected
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-black/40 text-white/90 hover:bg-black/60 hover:scale-110'
              }
            `}
          >
            <Heart className={`w-3.5 h-3.5 ${place.selected ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-2">
          <h4 className="font-medium text-xs text-text line-clamp-1">{place.name}</h4>
          <p className="text-[10px] text-text-secondary line-clamp-2 mt-0.5">{place.description}</p>
          <div className="mt-1 flex items-center justify-between">
            <StarRating
              value={place.userRating || 0}
              onChange={(r) => ratePlace(place.id, r)}
              size="sm"
            />
            {place.priceRange && (
              <span className="text-[10px] font-medium text-primary">{place.priceRange}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
