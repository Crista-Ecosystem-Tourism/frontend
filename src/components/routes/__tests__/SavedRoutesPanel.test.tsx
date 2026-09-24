import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SavedRoutesPanel } from '../SavedRoutesPanel'

const appState = vi.hoisted(() => ({
  loadSavedRoute: vi.fn(),
  setMainView: vi.fn(),
}))

vi.mock('@/context/AppContext', () => ({
  useApp: () => ({
    savedRoutes: [{
      id: 'route-1',
      name: 'Прогулка по Риму',
      destination: 'Рим',
      days: 1,
      places: [{ id: 'place-1', name: 'Колизей' }],
      createdAt: '2026-09-24T10:00:00Z',
    }],
    loadSavedRoute: appState.loadSavedRoute,
    setMainView: appState.setMainView,
  }),
}))

describe('SavedRoutesPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a retry when a saved route cannot be loaded', async () => {
    appState.loadSavedRoute
      .mockRejectedValueOnce(new Error('backend unavailable'))
      .mockResolvedValueOnce(undefined)

    render(<SavedRoutesPanel onBack={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Прогулка по Риму/ }))

    expect(await screen.findByRole('alert')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Повторить' }))

    await waitFor(() => expect(appState.loadSavedRoute).toHaveBeenCalledTimes(2))
    expect(appState.loadSavedRoute).toHaveBeenNthCalledWith(2, 'route-1')
  })
})
