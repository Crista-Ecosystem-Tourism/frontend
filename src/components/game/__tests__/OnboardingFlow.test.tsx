import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { OnboardingFlow } from '../OnboardingFlow'

const { getOnboardingMock, useAppMock } = vi.hoisted(() => ({
  getOnboardingMock: vi.fn(),
  useAppMock: vi.fn(),
}))

vi.mock('@/api/gameApi', () => ({ getOnboarding: getOnboardingMock, answerRedSquare: vi.fn() }))
vi.mock('@/context/AppContext', () => ({ useApp: useAppMock }))
vi.mock('@/api/chatApi', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/api/chatApi')>(),
  isMockMode: () => false,
}))

describe('OnboardingFlow localization', () => {
  beforeEach(() => {
    getOnboardingMock.mockReset()
    useAppMock.mockReset()
    getOnboardingMock.mockResolvedValue({
      content: {
        id: 'red-square', country: { id: 'ru', name: 'Россия', city: 'Москва' },
        chris: { name: 'Крис', intro: 'Русское вступление' }, scene: { title: 'Красная площадь', mode: 'lesson' },
        fact: { text: 'Русский факт', source_url: 'https://example.test', source_label: 'Источник' },
        question: { id: 'q1', text: 'Русский вопрос?', options: [{ id: 'a', label: 'Ответ' }] },
        reward: { xp: 50, stamp_title: 'Стартовый штамп' },
      },
      profile: { xp: 0, energy: 5, streak: 0 },
      daily: { timezone: 'Europe/Moscow', streak: 0, completed_quests: 0, goal: 2, goal_reached: false },
      completed: false, starter_stamp: null,
    })
  })

  it('localizes onboarding controls and marks unchanged Russian lesson content', async () => {
    useAppMock.mockReturnValue({ language: 'en' })
    render(<OnboardingFlow signedIn />)

    expect(await screen.findByText('Meet Chris')).toBeTruthy()
    expect(screen.getByRole('list', { name: 'First trip steps' })).toBeTruthy()
    expect(screen.getByText('The story text and questions are currently available only in Russian; the original is shown.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Choose Russia' }))
    expect(screen.getByText('Moscow ahead')).toBeTruthy()
    expect(screen.getAllByText(/Красная площадь/).length).toBeGreaterThan(0)
  })
})
