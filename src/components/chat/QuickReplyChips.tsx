import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Users, Compass, Clock, Map, Pencil, X, PlaneTakeoff } from 'lucide-react'
import type { SuggestedReplyGroup } from '@/types'

interface QuickReplyChipsProps {
  groups: SuggestedReplyGroup[]
  selections: Record<string, string>
  onSelectionsChange: (selections: Record<string, string>) => void
  onBuildItinerary: () => void
  allPreferencesFilled: boolean
}

const iconMap: Record<string, React.ReactNode> = {
  wallet: <Wallet className="w-3.5 h-3.5" />,
  users: <Users className="w-3.5 h-3.5" />,
  compass: <Compass className="w-3.5 h-3.5" />,
  clock: <Clock className="w-3.5 h-3.5" />,
  plane: <PlaneTakeoff className="w-3.5 h-3.5" />,
}

export function QuickReplyChips({ groups, selections, onSelectionsChange, onBuildItinerary, allPreferencesFilled }: QuickReplyChipsProps) {
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [showCustom, setShowCustom] = useState<Record<string, boolean>>({})

  // Reset local UI state when selections are cleared from outside (after send)
  useEffect(() => {
    if (Object.keys(selections).length === 0) {
      setCustomInputs({})
      setShowCustom({})
    }
  }, [selections])

  const handleSelect = (category: string, value: string) => {
    const next = { ...selections }
    if (next[category] === value) {
      delete next[category]
    } else {
      next[category] = value
    }
    onSelectionsChange(next)
    // Clear custom input when selecting a chip
    setShowCustom(prev => ({ ...prev, [category]: false }))
    setCustomInputs(prev => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })
  }

  const handleCustomToggle = (category: string) => {
    setShowCustom(prev => ({ ...prev, [category]: !prev[category] }))
    if (!showCustom[category]) {
      // Clear chip selection when opening custom input
      const next = { ...selections }
      delete next[category]
      onSelectionsChange(next)
    }
  }

  const handleCustomChange = (category: string, value: string) => {
    setCustomInputs(prev => ({ ...prev, [category]: value }))
    const next = { ...selections }
    if (value.trim()) {
      next[category] = value.trim()
    } else {
      delete next[category]
    }
    onSelectionsChange(next)
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="px-1 pb-2 space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {groups.map((group) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-1.5"
          >
            {/* Group label */}
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium">
              <span className="text-primary">{iconMap[group.icon] || iconMap.compass}</span>
              {group.label}
            </div>

            {/* Option chips */}
            <div className="flex flex-wrap gap-1.5">
              {group.options.map((opt) => {
                const isSelected = selections[group.category] === opt.value && !showCustom[group.category]
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(group.category, opt.value)}
                    className={`
                      group relative flex flex-col items-start gap-0.5
                      px-3 py-1.5 rounded-xl text-left
                      border transition-all duration-150
                      ${isSelected
                        ? 'bg-primary/15 border-primary/40 text-primary shadow-sm shadow-primary/10'
                        : 'bg-surface-hover/50 border-border/30 text-text hover:bg-surface-hover hover:border-border/50'
                      }
                    `}
                  >
                    <span className="text-xs font-medium leading-tight">{opt.label}</span>
                    <span className={`text-[10px] leading-tight ${isSelected ? 'text-primary/70' : 'text-text-muted'}`}>
                      {opt.description}
                    </span>
                  </button>
                )
              })}

              {/* Custom input toggle */}
              {group.allow_custom && (
                <button
                  onClick={() => handleCustomToggle(group.category)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs
                    border transition-all duration-150
                    ${showCustom[group.category]
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-surface-hover/30 border-dashed border-border/40 text-text-muted hover:text-text hover:border-border/60'
                    }
                  `}
                >
                  {showCustom[group.category] ? <X className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                  Свой вариант
                </button>
              )}
            </div>

            {/* Custom input field */}
            <AnimatePresence>
              {showCustom[group.category] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="text"
                    value={customInputs[group.category] || ''}
                    onChange={(e) => handleCustomChange(group.category, e.target.value)}
                    placeholder={`Введите ${group.label.toLowerCase()}...`}
                    className="w-full px-3 py-1.5 rounded-lg text-xs bg-surface border border-border/40 text-text placeholder:text-text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Build itinerary button */}
      {allPreferencesFilled && (
        <div className="flex items-center gap-2 pt-1">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onBuildItinerary}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all shadow-sm"
          >
            <Map className="w-3 h-3" />
            Составить маршрут
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
