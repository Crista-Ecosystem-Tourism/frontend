import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MoscowQuest } from '../MoscowQuest'

const { getMoscowQuestMock, useAppMock } = vi.hoisted(() => ({
  getMoscowQuestMock: vi.fn(),
  useAppMock: vi.fn(),
}))

vi.mock('@/api/gameApi', () => ({ getMoscowQuest: getMoscowQuestMock, answerMoscowQuest: vi.fn() }))
vi.mock('@/context/AppContext', () => ({ useApp: useAppMock }))

describe('MoscowQuest localization', () => {
  beforeEach(() => {
    getMoscowQuestMock.mockReset()
    useAppMock.mockReset()
    getMoscowQuestMock.mockResolvedValue({
      quest: { id: 'moscow-red-square', kind: 'quiz', position: 1, prerequisite_quest_id: null },
      content: {
        id: 'red-square', country: { id: 'ru', name: 'Россия', city: 'Москва' },
        chris: { name: 'Крис', intro: 'Русское вступление' }, scene: { title: 'Площадь', mode: 'lesson' },
        fact: { text: 'Русский факт', source_url: 'https://example.test', source_label: 'Источник' },
        question: { id: 'q1', text: 'Русский вопрос?', options: [{ id: 'a', label: 'Ответ' }] },
        reward: { xp: 10, stamp_title: 'Штамп' },
      },
      content_language: 'ru', profile: { xp: 10, energy: 4, streak: 1 },
      daily: { timezone: 'Europe/Moscow', streak: 1, completed_quests: 0, goal: 2, goal_reached: false },
      completed: false, stamp: null,
    })
  })

  it('localizes the chrome and discloses Russian lesson content in English mode', async () => {
    useAppMock.mockReturnValue({ language: 'en' })
    render(<MoscowQuest signedIn refreshKey={0} questId="moscow-red-square" />)

    expect(await screen.findByText('Moscow · stop 1')).toBeTruthy()
    expect(screen.getByText('Lesson text and questions are currently available only in Russian, the verified server edition.')).toBeTruthy()
    expect(screen.getByText('Русский вопрос?')).toBeTruthy()
    expect(screen.getByText('Source: Источник')).toBeTruthy()
    expect(getMoscowQuestMock).toHaveBeenCalledWith('moscow-red-square', 'en')
  })
})
