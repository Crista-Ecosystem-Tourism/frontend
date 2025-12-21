import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { TravelMap } from '@/components/map/TravelMap'
import { InspirationBoard } from '@/components/home/InspirationBoard'
import { HomeInput } from '@/components/home/HomeInput'
import { AuthModal } from '@/components/modals/AuthModal'
import { SubscriptionModal } from '@/components/modals/SubscriptionModal'
import { PaymentModal } from '@/components/modals/PaymentModal'
import { useApp } from '@/context/AppContext'

export function MainLayout() {
  const { currentChatId, newChat, sendMessage } = useApp()

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

      {/* Sidebar - Always present but glassmorphic */}
      <div className="flex h-full relative z-10">
        <Sidebar />

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
                className="w-full h-full flex p-4 gap-4"
              >
                {/* Chat Panel - Floating Glass Card */}
                <div className="w-full md:w-[450px] lg:w-[500px] flex-shrink-0 h-full relative flex flex-col">
                  <ChatPanel />
                </div>

                {/* Map - Floating Glass Card */}
                <div className="hidden md:block flex-1 h-full relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 pointer-events-none z-10 rounded-3xl ring-1 ring-inset ring-white/10" />
                  <TravelMap />
                </div>
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
