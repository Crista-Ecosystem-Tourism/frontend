import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fetchPublicTripMiniSite } from '@/api/suitcaseApi'
import { PublicTripMiniSite } from '../PublicTripMiniSite'

vi.mock('@/api/suitcaseApi', () => ({ fetchPublicTripMiniSite: vi.fn() }))
vi.mock('@/components/suitcase/SuitcaseJourneyMap', () => ({
  SuitcaseJourneyMap: () => <div data-testid="public-trip-map" />,
}))

const fetchPage = vi.mocked(fetchPublicTripMiniSite)
const originalTitle = document.title

beforeEach(() => fetchPage.mockReset())
afterEach(() => {
  document.querySelector('meta[name="robots"]')?.remove()
  document.title = originalTitle
})

describe('PublicTripMiniSite', () => {
  it('renders only the consented snapshot and prevents indexing of link-only pages', async () => {
    fetchPage.mockResolvedValue({
      visibility: 'link',
      snapshot: {
        title: 'Moscow, Russia', city: 'Moscow', country: 'Russia', start_date: '2026-09-01', end_date: '2026-09-03',
        cover: null, summary: 'A city walk', photos: [],
        points: [{ latitude: 55.75, longitude: 37.61, name: 'Red Square', note: 'Arrived early' }],
        stats: { days: 3, places_visited: 1, distance_km: 0 },
      },
    })
    render(<PublicTripMiniSite slug="secret" />)
    expect(await screen.findByRole('heading', { name: 'Moscow, Russia' })).toBeTruthy()
    expect(screen.getByText('Red Square')).toBeTruthy()
    expect(screen.getByTestId('public-trip-map')).toBeTruthy()
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, nofollow')
    expect(document.title).toBe('Moscow, Russia — Crista')
    expect(screen.queryByText(/expense|расход/i)).toBeNull()
  })

  it('shows a revoked-page message when the public API returns 404', async () => {
    fetchPage.mockRejectedValueOnce({ status: 404 })
    render(<PublicTripMiniSite slug="revoked" />)
    expect(await screen.findByText(/владелец мог отозвать доступ/i)).toBeTruthy()
  })
})
