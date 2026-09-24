import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GamePanel } from '../GamePanel'

const { fetchWorkspaceMock, getPassportMock, setMainViewMock } = vi.hoisted(() => ({
  fetchWorkspaceMock: vi.fn(),
  getPassportMock: vi.fn(),
  setMainViewMock: vi.fn(),
}))

vi.mock('@/context/AppContext', () => ({
  useApp: () => ({ user: { id: 'user-1', name: 'Traveler' }, setMainView: setMainViewMock }),
}))

vi.mock('@/api/chatApi', () => ({
  isMockMode: () => false,
  ApiError: class ApiError extends Error { detail = this.message },
}))

vi.mock('@/api/gameApi', () => ({ getGamePassport: getPassportMock }))

vi.mock('@/api/suitcaseApi', () => ({
  fetchSuitcaseWorkspace: fetchWorkspaceMock,
  mapTripFromApi: (trip: { id: string; city: string; country: string; is_archived: boolean }) => ({
    id: trip.id, city: trip.city, country: trip.country, isArchived: trip.is_archived,
  }),
  mapGoalFromApi: (goal: { id: string; title: string; current: number; total: number }) => goal,
}))

vi.mock('../WorldMap', () => ({ WorldMap: () => null }))
vi.mock('../CountryQuests', () => ({ CountryQuests: () => null }))
vi.mock('../TravelPassport', () => ({ TravelPassport: () => null }))
vi.mock('../DailyQuiz', () => ({ DailyQuiz: () => null }))
vi.mock('../CountryPage', () => ({ CountryPage: () => null }))
vi.mock('../OnboardingFlow', () => ({ OnboardingFlow: () => null }))
vi.mock('../MoscowQuest', () => ({ MoscowQuest: () => null }))
vi.mock('../MoscowPath', () => ({ MoscowPath: () => null }))
vi.mock('../MoscowBoss', () => ({ MoscowBoss: () => null }))
vi.mock('../MoscowSandbox', () => ({ MoscowSandbox: () => null }))
vi.mock('../CityPilot', () => ({ CityPilot: () => null }))

describe('LiveGamePanel Suitcase summary', () => {
  beforeEach(() => {
    fetchWorkspaceMock.mockReset()
    getPassportMock.mockReset()
    setMainViewMock.mockReset()
    fetchWorkspaceMock.mockResolvedValue({
      trips: [
        { id: 'trip-1', city: 'Киото', country: 'Япония', is_archived: false },
        { id: 'trip-2', city: 'Осака', country: 'Япония', is_archived: false },
        { id: 'trip-3', city: 'Токио', country: 'Япония', is_archived: true },
      ],
      goals: [{ id: 'goal-1', title: 'На музеи', current: 120, total: 300 }],
    })
    getPassportMock.mockResolvedValue({ profile: { xp: 0, energy: 5, streak: 0 }, stamps: [], cities: [], routes: [] })
  })

  it('renders server-backed active trips and goals and links to the suitcase view', async () => {
    render(<GamePanel onBack={() => undefined} />)

    expect(await screen.findByText('2 активных поездок · 1 целей')).toBeTruthy()
    expect(screen.getByText('Киото, Япония · Осака, Япония')).toBeTruthy()
    expect(screen.queryByText(/Токио/)).toBeNull()
    expect(screen.getByText('На музеи: 120 / 300')).toBeTruthy()
    expect(fetchWorkspaceMock).toHaveBeenCalledTimes(1)

    screen.getByRole('button', { name: 'Открыть чемодан' }).click()
    await waitFor(() => expect(setMainViewMock).toHaveBeenCalledWith('suitcase'))
  })
})
