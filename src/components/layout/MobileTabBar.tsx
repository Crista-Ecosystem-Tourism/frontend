import { motion } from 'framer-motion'
import { MessageSquare, Map } from 'lucide-react'
import { useApp } from '@/context/AppContext'

const tabs = [
  { key: 'chat' as const, label: 'Чат', icon: MessageSquare },
  { key: 'map' as const, label: 'Карта', icon: Map },
]

export function MobileTabBar() {
  const { mobileActiveTab, setMobileActiveTab } = useApp()

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {tabs.map((tab) => {
          const isActive = mobileActiveTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setMobileActiveTab(tab.key)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <tab.icon
                className={`w-4 h-4 relative z-10 ${isActive ? 'text-white' : 'text-text-secondary'}`}
              />
              <span
                className={`relative z-10 ${isActive ? 'text-white' : 'text-text-secondary'}`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
