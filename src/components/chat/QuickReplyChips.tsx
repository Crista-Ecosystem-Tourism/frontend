import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Users, Compass, Clock, Send, Map, Pencil, X } from 'lucide-react'
import type { SuggestedReplyGroup } from '@/types'

interface QuickReplyChipsProps {
  groups: SuggestedReplyGroup[]
  onSend: (message: string) => void
  allPreferencesFilled: boolean
}

const iconMap: Record<string, React.ReactNode> = {
  wallet: <Wallet className="w-3.5 h-3.5" />,
  users: <Users className="w-3.5 h-3.5" />,
  compass: <Compass className="w-3.5 h-3.5" />,
  clock: <Clock className="w-3.5 h-3.5" />,
}

export function QuickReplyChips({ groups, onSend, allPreferencesFilled }: QuickReplyChipsProps) {
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [showCustom, setShowCustom] = useState<Record<string, boolean>>({})

  const handleSelect = (category: string, value: string) => {
    setSelections(prev => {
      if (prev[category] === value) {
        const next = { ...prev }
        delete next[category]
        return next
      }
      return { ...prev, [category]: value }
    })
    // Clear custom input when selecting a chip
    setShowCustom(prev => ({ ...prev, [category]: false }))
    setCustomInputs(prev => {
      const next = { ...prev }
      delete next[category]
      return next
    })
  }

  const handleCustomToggle = (category: string) => {
    setShowCustom(prev => ({ ...prev, [category]: !prev[category] }))
    if (!showCustom[category]) {
      // Clear chip selection when opening custom input
      setSelections(prev => {
        const next = { ...prev }
        delete next[category]
        return next
      })
    }
  }

  const handleCustomChange = (category: string, value: string) => {
    setCustomInputs(prev => ({ ...prev, [category]: value }))
    if (value.trim()) {
      setSelections(prev => ({ ...prev, [category]: value.trim() }))
    } else {
      setSelections(prev => {
        const next = { ...prev }
        delete next[category]
        return next
      })
    }
  }

  const handleSend = () => {
    const parts: string[] = []
    for (const group of groups) {
      const val = selections[group.category]
      if (val) {
        parts.push(`${group.label}: ${val}`)
      }
    }
    if (parts.length > 0) {
      onSend(parts.join(', '))
      setSelections({})
      setCustomInputs({})
      setShowCustom({})
    }
  }

  const handleBuildItinerary = () => {
    onSend('Составь маршрут по дням')
    setSelections({})
    setCustomInputs({})
    setShowCustom({})
  }

  const hasSelections = Object.keys(selections).length > 0

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

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        {hasSelections && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSend}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Send className="w-3 h-3" />
            Отправить выбранное
          </motion.button>
        )}

        {allPreferencesFilled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleBuildItinerary}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 transition-all shadow-sm"
          >
            <Map className="w-3 h-3" />
            Составить маршрут
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
