import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { MobileTabBar } from './MobileTabBar'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TravelMap } from '@/components/map/TravelMap'
import { PlaceDetailPanel } from '@/components/map/PlaceDetailPanel'
import { InspirationBoard } from '@/components/home/InspirationBoard'
import { HomeInput } from '@/components/home/HomeInput'
import { AuthModal } from '@/components/modals/AuthModal'
import { SubscriptionModal } from '@/components/modals/SubscriptionModal'
import { PaymentModal } from '@/components/modals/PaymentModal'
import { useApp } from '@/context/AppContext'
import { useMediaBreakpoint } from '@/hooks/useMediaBreakpoint'
import { useResizableSplit } from '@/hooks/useResizableSplit'

export function MainLayout() {
  const { currentChatId, newChat, sendMessage, mobileActiveTab, selectedPlace, setSelectedPlace } = useApp()
  const breakpoint = useMediaBreakpoint()
  const { ratio, isDragging, handleMouseDown, handleDoubleClick, containerRef } = useResizableSplit({
    minLeftPx: 320,
    minRightPx: 300,
    defaultRatio: 0.4,
    storageKey: 'chat-map-split-ratio',
  })

  const handleHomeInput = async (text: string) => {
    newChat()
    setTimeout(() => {
      sendMessage(text)
    }, 100)
  }

  const isHome = !currentChatId

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-text font-sans selection:bg-primary/30">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-60 pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/20 via-background to-background opacity-60 pointer-events-none" />

      {/* Sidebar - hidden on mobile */}
      <div className="flex h-full relative z-10">
        {breakpoint !== 'mobile' && <Sidebar />}

        {/* Main Content Area */}
        <main className="flex-1 relative h-full min-w-0">
          <AnimatePresence mode="wait">
            {isHome ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="w-full h-full relative z-0"
              >
                <InspirationBoard onSelect={(place) => handleHomeInput(`Хочу посетить ${place}`)} />
                <HomeInput onSend={handleHomeInput} />
              </motion.div>
            ) : (
              <motion.div
                key="chat-layout"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="w-full h-full"
              >
                {/* Mobile layout */}
                {breakpoint === 'mobile' && (
                  <div className="relative w-full h-full">
                    {/* Chat - always mounted, crossfade */}
                    <motion.div
                      animate={{
                        opacity: mobileActiveTab === 'chat' ? 1 : 0,
                        scale: mobileActiveTab === 'chat' ? 1 : 0.98,
                      }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 pb-20"
                      style={{ pointerEvents: mobileActiveTab === 'chat' ? 'auto' : 'none' }}
                    >
                      <ChatPanel />
                    </motion.div>

                    {/* Map - always mounted, crossfade */}
                    <motion.div
                      animate={{
                        opacity: mobileActiveTab === 'map' ? 1 : 0,
                        scale: mobileActiveTab === 'map' ? 1 : 0.98,
                      }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 pb-20 rounded-3xl overflow-hidden"
                      style={{ pointerEvents: mobileActiveTab === 'map' ? 'auto' : 'none' }}
                    >
                      <TravelMap />
                    </motion.div>

                    {/* Mobile PlaceDetailPanel — rendered outside map for visibility */}
                    <AnimatePresence>
                      {selectedPlace && (
                        <PlaceDetailPanel
                          place={selectedPlace}
                          onClose={() => setSelectedPlace(null)}
                          breakpoint="mobile"
                        />
                      )}
                    </AnimatePresence>

                    {/* Tab bar */}
                    <MobileTabBar />
                  </div>
                )}

                {/* Tablet layout */}
                {breakpoint === 'tablet' && (
                  <div className="flex w-full h-full p-2 gap-2">
                    <div className="w-[55%] h-full flex-shrink-0 flex flex-col">
                      <ChatPanel />
                    </div>
                    <div className="w-[45%] h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <div className="absolute inset-0 pointer-events-none z-10 rounded-2xl ring-1 ring-inset ring-white/10" />
                      <TravelMap />
                    </div>
                  </div>
                )}

                {/* Desktop layout */}
                {breakpoint === 'desktop' && (
                  <div ref={containerRef} className="flex w-full h-full p-4 gap-0">
                    {/* Chat Panel */}
                    <div
                      className="h-full flex-shrink-0 flex flex-col pr-0"
                      style={{ width: `${ratio * 100}%` }}
                    >
                      <ChatPanel />
                    </div>

                    {/* Draggable divider */}
                    <div
                      className="relative flex-shrink-0 z-20 flex items-center justify-center group"
                      style={{ width: '12px' }}
                    >
                      <div
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                        onDoubleClick={handleDoubleClick}
                        className={`absolute inset-y-0 w-3 cursor-col-resize flex items-center justify-center
                          ${isDragging ? 'bg-primary/10' : ''}`}
                      >
                        <div
                          className={`w-[3px] h-12 rounded-full transition-colors
                            ${isDragging ? 'bg-primary' : 'bg-border group-hover:bg-primary/60'}`}
                        />
                      </div>
                    </div>

                    {/* Map */}
                    <div className="flex-1 h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                      <div className="absolute inset-0 pointer-events-none z-10 rounded-3xl ring-1 ring-inset ring-white/10" />
                      <TravelMap />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AuthModal />
      <SubscriptionModal />
      <PaymentModal />
    </div>
  )
}
