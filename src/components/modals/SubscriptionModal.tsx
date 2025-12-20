import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import { subscriptionPlans } from '@/mocks/subscriptions'
import { PlanDetails, SubscriptionPlan } from '@/types'
import { cn } from '@/lib/utils'

function PlanCard({ plan, isSelected, onSelect }: {
  plan: PlanDetails
  isSelected: boolean
  onSelect: () => void
}) {
  const icons: Record<SubscriptionPlan, typeof Star> = {
    basic: Star,
    pro: Sparkles,
    premium: Crown,
  }
  const Icon = icons[plan.id]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'relative p-4 rounded-xl border-2 cursor-pointer transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50',
        plan.popular && 'ring-2 ring-primary ring-offset-2 ring-offset-surface'
      )}
      onClick={onSelect}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
          Популярный
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          plan.id === 'premium' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
            plan.id === 'pro' ? 'bg-gradient-to-br from-primary to-accent' :
              'bg-surface-light'
        )}>
          <Icon className={cn(
            'w-5 h-5',
            plan.id === 'basic' ? 'text-text-muted' : 'text-white'
          )} />
        </div>
        <div>
          <h3 className="font-semibold text-text">{plan.name}</h3>
          <p className="text-lg font-bold text-primary">{plan.priceLabel}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export function SubscriptionModal() {
  const { activeModal, closeModal, openModal, selectedPlan, setSelectedPlan } = useApp()
  const isOpen = activeModal === 'subscription'

  const handleContinue = () => {
    if (selectedPlan) {
      openModal('payment')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Выберите тариф
          </DialogTitle>
          <DialogDescription className="text-center">
            Чтобы формировать маршруты и выбирать места, оформите подписку
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 grid gap-4 md:grid-cols-3">
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlanCard
                plan={plan}
                isSelected={selectedPlan === plan.id}
                onSelect={() => setSelectedPlan(plan.id)}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={closeModal} className="flex-1">
            Позже
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="flex-1"
          >
            Продолжить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

