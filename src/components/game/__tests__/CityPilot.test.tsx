import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CityPilot } from '../CityPilot'

const { answerCityQuestMock, getCityPathMock, getCityQuestMock, useAppMock } = vi.hoisted(() => ({
  answerCityQuestMock: vi.fn(),
  getCityPathMock: vi.fn(),
  getCityQuestMock: vi.fn(),
  useAppMock: vi.fn(),
}))
const englishQuest = {
  quest: { id: 'spb-hermitage', kind: 'quiz', position: 1, prerequisite_quest_id: null },
  content: {
    id: 'spb-hermitage-v1', country: { id: 'ru', name: 'Russia', city: 'Saint Petersburg' },
    chris: { name: 'Chris', intro: 'Continue the route.' }, scene: { title: 'The Hermitage', mode: 'quiz' },
    fact: { text: 'The Hermitage dates the museum’s founding to 1764.', source_url: 'https://example.test/source', source_label: 'The State Hermitage Museum' },
    question: { id: 'q1', text: 'In what year was it founded?', options: [{ id: '1764', label: '1764' }] },
    reward: { xp: 5, stamp_title: 'Hermitage Stamp' },
  },
  content_language: 'en', profile: { xp: 0, energy: 5, streak: 0 },
  daily: { timezone: 'Europe/Moscow', streak: 0, completed_quests: 0, goal: 1, goal_reached: false },
  completed: false, stamp: null,
}

vi.mock('@/api/gameApi', () => ({
  getCityPath: getCityPathMock,
  getCityQuest: getCityQuestMock,
  answerCityQuest: answerCityQuestMock,
}))
vi.mock('@/context/AppContext', () => ({ useApp: useAppMock }))

describe('CityPilot localization boundary', () => {
  beforeEach(() => {
    getCityPathMock.mockReset()
    getCityQuestMock.mockReset()
    answerCityQuestMock.mockReset()
    useAppMock.mockReset()
    getCityPathMock.mockResolvedValue({
      city: { id: 'st-petersburg', name: 'Санкт-Петербург', tier: 1, required_quest_count: 1, completion_stamp: null },
      profile: { xp: 0, energy: 5, streak: 0 },
      daily: { timezone: 'Europe/Moscow', streak: 0, completed_quests: 0, goal: 1, goal_reached: false },
      nodes: [{ id: 'spb-hermitage', kind: 'quiz', position: 1, completed: false, unlocked: true, prerequisite_quest_id: null, district: null }],
      boss: null,
    })
    getCityQuestMock.mockResolvedValue({
      quest: { id: 'spb-hermitage', kind: 'quiz', position: 1, prerequisite_quest_id: null },
      content: {
        id: 'spb-hermitage-v1', country: { id: 'RU', name: 'Россия', city: 'Санкт-Петербург' },
        chris: { name: 'Крис', intro: 'Привет' }, scene: { title: 'Эрмитаж', mode: 'quiz' },
        fact: { text: 'Проверенный факт', source_url: 'https://example.test/source', source_label: 'Первоисточник' },
        question: { id: 'q1', text: 'В каком году?', options: [{ id: '1764', label: '1764' }] },
        reward: { xp: 5, stamp_title: 'Штамп' },
      },
      profile: { xp: 0, energy: 5, streak: 0 },
      daily: { timezone: 'Europe/Moscow', streak: 0, completed_quests: 0, goal: 1, goal_reached: false },
      completed: false, stamp: null,
    })
    answerCityQuestMock.mockResolvedValue({ correct: true, xp_awarded: 5, profile: { xp: 5, energy: 5, streak: 1 }, daily: { timezone: 'Europe/Moscow', streak: 1, completed_quests: 1, goal: 1, goal_reached: true }, completed: true, stamp: { key: 'spb-hermitage', title: 'Hermitage Stamp', earned_at: '2026-09-24' }, explanation: 'Correct explanation' })
  })

  it('requests and renders the published English edition in English UI', async () => {
    useAppMock.mockReturnValue({ language: 'en' })
    render(<CityPilot cityId="st-petersburg" signedIn refreshKey={0} onCompleted={() => undefined} />)

    expect(await screen.findByText('Saint Petersburg')).toBeTruthy()
    expect(screen.getByText(/The Hermitage/)).toBeTruthy()
    expect(screen.getByText('Open')).toBeTruthy()
    expect(getCityPathMock).toHaveBeenCalledWith('st-petersburg')
    getCityQuestMock.mockResolvedValueOnce(englishQuest)
    fireEvent.click(screen.getByRole('button', { name: /The Hermitage/ }))
    expect(getCityQuestMock).toHaveBeenCalledWith('st-petersburg', 'spb-hermitage', 'en')
    expect(await screen.findByText('The Hermitage dates the museum’s founding to 1764.')).toBeTruthy()
    expect(screen.getByText('In what year was it founded?')).toBeTruthy()
    expect(screen.queryByText(/currently available only in Russian/)).toBeNull()
    expect(screen.getByRole('link', { name: 'Source: The State Hermitage Museum' }).getAttribute('href')).toBe('https://example.test/source')
    fireEvent.click(screen.getByRole('button', { name: '1764' }))
    expect(await screen.findByText('Correct! +5 XP')).toBeTruthy()
    expect(answerCityQuestMock).toHaveBeenCalledWith('st-petersburg', 'spb-hermitage', '1764', 'en')
  })

  it('keeps Russian server content without adding an English-only notice in Russian UI', async () => {
    useAppMock.mockReturnValue({ language: 'ru' })
    render(<CityPilot cityId="st-petersburg" signedIn refreshKey={0} onCompleted={() => undefined} />)

    expect(await screen.findByText('Санкт-Петербург')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Эрмитаж/ }))
    expect(await screen.findByText('Проверенный факт')).toBeTruthy()
    expect(screen.queryByText(/verified server edition/)).toBeNull()
  })
})
