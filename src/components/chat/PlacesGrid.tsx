import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Place } from '@/types'
import { PlaceCard } from './PlaceCard'

interface PlacesGridProps {
  places: Place[]
  cityName?: string
}

export function PlacesGrid({ places, cityName }: PlacesGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!places || places.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -180 : 180,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-medium text-primary">Рекомендации</span>
          {cityName && <span>• {cityName}</span>}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-6 h-6 rounded-full bg-surface-light hover:bg-surface-hover flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-6 h-6 rounded-full bg-surface-light hover:bg-surface-hover flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards scroll */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {places.map((place, index) => (
          <PlaceCard key={place.id} place={place} index={index} />
        ))}
      </div>
    </div>
  )
}
