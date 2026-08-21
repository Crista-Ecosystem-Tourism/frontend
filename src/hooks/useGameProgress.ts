import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  gameCountries,
  countryTotalPoints,
  findCountry,
  type GameCountry,
  type QuestCategory,
} from '@/mocks/game'

const STORAGE_KEY = 'crista-quest-progress'

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

/**
 * Прогресс по квестам. Хранится в localStorage: раздел Игра должен помнить
 * закрытые точки между переходами и перезагрузкой.
 */
export function useGameProgress() {
  const [doneIds, setDoneIds] = useState<Set<string>>(() => new Set(readStored()))

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...doneIds]))
    } catch {
      // приватный режим браузера: прогресс живёт только в этой сессии
    }
  }, [doneIds])

  const toggleQuest = useCallback((questId: string) => {
    setDoneIds((prev) => {
      const next = new Set(prev)
      if (next.has(questId)) next.delete(questId)
      else next.add(questId)
      return next
    })
  }, [])

  const isDone = useCallback((questId: string) => doneIds.has(questId), [doneIds])

  /** Процент закрытия страны по набранным очкам, а не по числу точек */
  const countryProgress = useCallback(
    (iso: string): number => {
      const country = findCountry(iso)
      if (!country) return 0
      const total = countryTotalPoints(country)
      if (total === 0) return 0
      const earned = country.cities.reduce(
        (sum, city) =>
          sum + city.quests.reduce((s, q) => (doneIds.has(q.id) ? s + q.points : s), 0),
        0
      )
      return Math.round((earned / total) * 100)
    },
    [doneIds]
  )

  const cityProgress = useCallback(
    (country: GameCountry, cityId: string): number => {
      const city = country.cities.find((c) => c.id === cityId)
      if (!city || city.quests.length === 0) return 0
      const done = city.quests.filter((q) => doneIds.has(q.id)).length
      return Math.round((done / city.quests.length) * 100)
    },
    [doneIds]
  )

  /** Прогресс по категориям в пределах страны */
  const categoryProgress = useCallback(
    (iso: string): Record<QuestCategory, number> => {
      const country = findCountry(iso)
      const empty: Record<QuestCategory, number> = { sights: 0, food: 0, traditions: 0 }
      if (!country) return empty

      const totals: Record<QuestCategory, { done: number; all: number }> = {
        sights: { done: 0, all: 0 },
        food: { done: 0, all: 0 },
        traditions: { done: 0, all: 0 },
      }

      country.cities.forEach((city) =>
        city.quests.forEach((q) => {
          totals[q.category].all += q.points
          if (doneIds.has(q.id)) totals[q.category].done += q.points
        })
      )

      return {
        sights: totals.sights.all ? Math.round((totals.sights.done / totals.sights.all) * 100) : 0,
        food: totals.food.all ? Math.round((totals.food.done / totals.food.all) * 100) : 0,
        traditions: totals.traditions.all
          ? Math.round((totals.traditions.done / totals.traditions.all) * 100)
          : 0,
      }
    },
    [doneIds]
  )

  const stats = useMemo(() => {
    const opened = gameCountries.filter((c) => c.opened)
    const closedFully = opened.filter((c) => countryProgress(c.iso) === 100).length
    const totalQuests = gameCountries.reduce(
      (sum, c) => sum + c.cities.reduce((s, city) => s + city.quests.length, 0),
      0
    )
    return {
      openedCountries: opened.length,
      closedCountries: closedFully,
      doneQuests: doneIds.size,
      totalQuests,
    }
  }, [doneIds, countryProgress])

  const resetProgress = useCallback(() => setDoneIds(new Set()), [])

  return {
    isDone,
    toggleQuest,
    countryProgress,
    cityProgress,
    categoryProgress,
    stats,
    resetProgress,
  }
}
