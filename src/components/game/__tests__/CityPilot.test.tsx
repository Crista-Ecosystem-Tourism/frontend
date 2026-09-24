import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CityPilot } from '../CityPilot'

const { getCityPathMock, getCityQuestMock, useAppMock } = vi.hoisted(() => ({
  getCityPathMock: vi.fn(),
  getCityQuestMock: vi.fn(),
  useAppMock: vi.fn(),
}))

vi.mock('@/api/gameApi', () => ({
  getCityPath: getCityPathMock,
  getCityQuest: getCityQuestMock,
  answerCityQuest: vi.fn(),
}))
vi.mock('@/context/AppContext', () => ({ useApp: useAppMock }))

describe('CityPilot localization boundary', () => {
  beforeEach(() => {
    getCityPathMock.mockReset()
    getCityQuestMock.mockReset()
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
  })

  it('localizes path chrome but clearly identifies Russian server-authored learning content in English UI', async () => {
    useAppMock.mockReturnValue({ language: 'en' })
    render(<CityPilot cityId="st-petersburg" signedIn refreshKey={0} onCompleted={() => undefined} />)

    expect(await screen.findByText('Saint Petersburg')).toBeTruthy()
    expect(screen.getByText(/The Hermitage/)).toBeTruthy()
    expect(screen.getByText('Open')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /The Hermitage/ }))
    expect(await screen.findByText('Fact and question text is currently available only in Russian, the verified server edition.')).toBeTruthy()
    expect(screen.getByText('Проверенный факт')).toBeTruthy()
    expect(screen.getByText('В каком году?')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Source: Первоисточник' }).getAttribute('href')).toBe('https://example.test/source')
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
