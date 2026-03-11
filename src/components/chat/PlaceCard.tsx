import { useState, useRef, useEffect, MutableRefObject } from 'react'
import { Star, Heart, X } from 'lucide-react'
import { Place } from '@/types'
import { useApp } from '@/context/AppContext'
import { StarRating } from '@/components/ui/StarRating'
import { motion, AnimatePresence } from 'framer-motion'

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

const scoreLabels = ['', 'Может быть', 'Неплохо', 'Хорошо', 'Очень хочу', 'Обязательно!']

export function PlaceCard({ place, dragRef }: PlaceCardProps) {
  const { scorePlaceSelection, setSelectedPlace, ratePlace } = useApp()
  const emoji = typeEmoji[place.type]
  const [showScorePopup, setShowScorePopup] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup on outside click
  useEffect(() => {
    if (!showScorePopup) return
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowScorePopup(false)
      }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [showScorePopup])

  const handleCardClick = () => {
    if (dragRef?.current.moved) return
    setSelectedPlace(place)
  }

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowScorePopup(prev => !prev)
  }

  const handleScore = (score: number) => {
    scorePlaceSelection(place.id, score)
    setShowScorePopup(false)
  }

  return (
    <div className="relative flex-shrink-0 w-[160px]">
      {/* Card body */}
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

          {/* Score badge */}
          {place.selected && place.score && (
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/90 text-white text-[10px] font-semibold">
              {place.score} б.
            </div>
          )}

          {/* Heart button */}
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

      {/* Score Popup — outside overflow-hidden card */}
      <AnimatePresence>
        {showScorePopup && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-[44px] right-0 z-50 w-[148px] rounded-lg overflow-hidden
              bg-surface border border-border shadow-xl shadow-black/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2 pt-2 pb-1">
              <p className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Баллы для паутинки
              </p>
              <div className="flex flex-col gap-0.5">
                {[5, 4, 3, 2, 1].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScore(score)}
                    className={`
                      flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors
                      ${place.score === score
                        ? 'bg-primary/15 text-primary'
                        : 'hover:bg-surface-hover text-text'
                      }
                    `}
                  >
                    <span className="text-xs font-bold w-4 text-center">{score}</span>
                    <span className="text-[10px] text-text-secondary leading-tight">
                      {scoreLabels[score]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Unpin */}
            {place.selected && (
              <button
                onClick={() => handleScore(0)}
                className="w-full flex items-center gap-2 px-4 py-2 border-t border-border
                  text-error hover:bg-error/10 transition-colors"
              >
                <X className="w-3 h-3" />
                <span className="text-[11px] font-medium">Открепить</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
