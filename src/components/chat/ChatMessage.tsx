import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import { ChatMessage as ChatMessageType } from '@/types'
import { PlacesGrid } from './PlacesGrid'

interface ChatMessageProps {
  message: ChatMessageType
  index: number
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user'

  const formatContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-primary">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      {/* Message row */}
      <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary text-white' : 'bg-surface-light text-primary'
        }`}>
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>

        {/* Bubble */}
        <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
          isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-surface-light text-text rounded-tl-sm'
        }`}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {formatContent(message.content)}
          </div>
        </div>
      </div>

      {/* Places carousel */}
      {!isUser && message.places && message.places.length > 0 && (
        <div className="mt-3 pl-9">
          <PlacesGrid places={message.places} cityName={message.cityName} />
        </div>
      )}

      {/* Time */}
      <div className={`mt-1 text-[10px] text-text-muted ${isUser ? 'text-right pr-9' : 'pl-9'}`}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  )
}
