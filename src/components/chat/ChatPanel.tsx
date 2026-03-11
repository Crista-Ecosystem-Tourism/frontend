import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { PreferenceChips } from './PreferenceChips'
import { QuickReplyChips } from './QuickReplyChips'
import { formatChipSelections, mergeMessage } from './formatChipSelections'

export function ChatPanel() {
  const { messages, isTyping, sendMessage, goHome, preferences, suggestedReplies } = useApp()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [chipSelections, setChipSelections] = useState<Record<string, string>>({})

  // Reset chip selections when suggested replies change (new AI response)
  useEffect(() => {
    setChipSelections({})
  }, [suggestedReplies])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const hasChipSelections = Object.keys(chipSelections).length > 0

  // Combined send: merges chip selections + user text into one message
  const handleCombinedSend = useCallback((textMessage: string) => {
    const chipText = formatChipSelections(chipSelections, suggestedReplies ?? [])
    const combined = mergeMessage(chipText, textMessage)
    if (combined) {
      sendMessage(combined)
      setChipSelections({})
    }
  }, [chipSelections, suggestedReplies, sendMessage])

  const handleBuildItinerary = useCallback(() => {
    sendMessage('Составь маршрут по дням')
    setChipSelections({})
  }, [sendMessage])

  return (
    <div className="h-full flex flex-col bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border/30 bg-surface/30">
        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="w-9 h-9 rounded-xl bg-surface-hover hover:bg-surface-light flex items-center justify-center transition-colors"
            title="На главную"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-text text-sm">AI Помощник</h1>
            <p className="text-[10px] text-primary">В сети</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>

      {/* Preference chips + Quick replies + Input */}
      <div className="flex-shrink-0 p-3 border-t border-border/30 bg-surface/30">
        <PreferenceChips preferences={preferences} />
        {suggestedReplies && suggestedReplies.length > 0 ? (
          <QuickReplyChips
            groups={suggestedReplies}
            selections={chipSelections}
            onSelectionsChange={setChipSelections}
            onBuildItinerary={handleBuildItinerary}
            allPreferencesFilled={false}
          />
        ) : preferences && !suggestedReplies && (preferences.city || preferences.destination_type) ? (
          <QuickReplyChips
            groups={[]}
            selections={chipSelections}
            onSelectionsChange={setChipSelections}
            onBuildItinerary={handleBuildItinerary}
            allPreferencesFilled={true}
          />
        ) : null}
        <ChatInput
          onSend={handleCombinedSend}
          disabled={isTyping}
          hasChipSelections={hasChipSelections}
        />
      </div>
    </div>
  )
}
