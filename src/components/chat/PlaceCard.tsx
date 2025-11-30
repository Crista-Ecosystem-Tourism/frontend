import { Star, Heart } from 'lucide-react'
import { Place } from '@/types'
import { useApp } from '@/context/AppContext'

interface PlaceCardProps {
  place: Place
  index: number
}

const typeEmoji: Record<Place['type'], string> = {
  attraction: '🏛️',
  restaurant: '🍽️',
  hotel: '🏨',
  nature: '🌳',
  culture: '🎭',
  entertainment: '🎪',
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { togglePlaceSelection, setSelectedPlace } = useApp()
  const emoji = typeEmoji[place.type]

  return (
    <div
      onClick={() => setSelectedPlace(place)}
      className={`
        flex-shrink-0 w-[160px] rounded-xl overflow-hidden cursor-pointer
        bg-white border border-border/50 hover:border-primary/30
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

        {/* Rating */}
        {place.rating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {place.rating}
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            togglePlaceSelection(place.id)
          }}
          className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
            transition-colors ${place.selected ? 'bg-primary text-white' : 'bg-black/30 text-white hover:bg-black/50'}
          `}
        >
          <Heart className={`w-3 h-3 ${place.selected ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-2">
        <h4 className="font-medium text-xs text-text line-clamp-1">{place.name}</h4>
        <p className="text-[10px] text-text-secondary line-clamp-2 mt-0.5">{place.description}</p>
        {place.priceRange && (
          <p className="text-[10px] font-medium text-primary mt-1">{place.priceRange}</p>
        )}
      </div>
    </div>
  )
}
