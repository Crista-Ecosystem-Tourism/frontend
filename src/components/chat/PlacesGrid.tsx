import { useRef, useCallback, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Place } from '@/types'
import { PlaceCard } from './PlaceCard'
import { useApp } from '@/context/AppContext'

interface PlacesGridProps {
  places: Place[]
  cityName?: string
}

export function PlacesGrid({ places: messagePlaces, cityName }: PlacesGridProps) {
  const { places: globalPlaces } = useApp()

  // Merge: use global places (which have latest ratings/scores) but keep message places order
  const places = useMemo(() => {
    if (globalPlaces.length === 0) return messagePlaces
    const globalMap = new Map(globalPlaces.map(p => [p.id, p]))
    return messagePlaces.map(mp => globalMap.get(mp.id) || mp)
  }, [messagePlaces, globalPlaces])
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  if (!places || places.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      })
    }
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el || e.button !== 0) return
    drag.current = { active: true, startX: e.clientX, scrollLeft: el.scrollLeft, moved: false }
    el.style.scrollBehavior = 'auto'
    el.style.cursor = 'grabbing'
  }, [])

  // Use window-level listeners so drag works even if cursor leaves the container
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current.active) return
      const el = scrollRef.current
      if (!el) return
      const dx = e.clientX - drag.current.startX
      if (Math.abs(dx) > 3) drag.current.moved = true
      el.scrollLeft = drag.current.scrollLeft - dx
    }

    const onMouseUp = () => {
      if (!drag.current.active) return
      const el = scrollRef.current
      if (el) {
        el.style.scrollBehavior = 'smooth'
        el.style.cursor = ''
      }
      drag.current.active = false
      // Reset moved flag on next frame so the click that fires right after mouseup is still blocked
      if (drag.current.moved) {
        requestAnimationFrame(() => { drag.current.moved = false })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

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
            <ChevronLeft className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-6 h-6 rounded-full bg-surface-light hover:bg-surface-hover flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Cards scroll — drag to scroll */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1 select-none"
        style={{ scrollBehavior: 'smooth', cursor: 'grab' }}
        onMouseDown={onMouseDown}
      >
        {places.map((place, index) => (
          <PlaceCard
            key={place.id}
            place={place}
            index={index}
            dragRef={drag}
          />
        ))}
      </div>
    </div>
  )
}
