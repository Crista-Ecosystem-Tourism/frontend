import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { completeTripForMiniSite, getTripMiniSite, publishTripMiniSite, revokeTripMiniSite } from '@/api/suitcaseApi'
import { TripMiniSiteControls } from '../TripMiniSiteControls'

vi.mock('@/api/suitcaseApi', () => ({
  completeTripForMiniSite: vi.fn(),
  getTripMiniSite: vi.fn(),
  publishTripMiniSite: vi.fn(),
  revokeTripMiniSite: vi.fn(),
}))

const getSite = vi.mocked(getTripMiniSite)
const complete = vi.mocked(completeTripForMiniSite)
const publish = vi.mocked(publishTripMiniSite)
const revoke = vi.mocked(revokeTripMiniSite)
const sampleSnapshot = {
  title: 'Rome, Italy', city: 'Rome', country: 'Italy', start_date: '2026-09-20', end_date: '2026-09-25',
  cover: 'https://photos.example/cover.jpg', summary: 'A quiet week',
  photos: ['https://photos.example/piazza.jpg'],
  points: [{ latitude: 41.9, longitude: 12.5, name: 'Piazza Navona', note: 'Visit at sunset', photos: ['https://photos.example/fountain.jpg'] }],
  stats: { days: 5, places_visited: 1, distance_km: 2.3 },
}

beforeEach(() => {
  getSite.mockReset().mockResolvedValue({ published: false, slug: null, visibility: null, consented_at: null })
  complete.mockReset().mockResolvedValue({ published: false, draft_ready: true, slug: null, visibility: null, consented_at: null, completed_at: '2026-09-25T12:00:00Z', draft_snapshot: sampleSnapshot })
  publish.mockReset().mockResolvedValue({ published: true, slug: 'secret-123', visibility: 'link', consented_at: '2026-09-25T12:00:00Z' })
  revoke.mockReset().mockResolvedValue()
  vi.stubGlobal('confirm', vi.fn(() => true))
})

describe('TripMiniSiteControls', () => {
  it('creates a private draft on completion without publishing it', async () => {
    render(<TripMiniSiteControls tripId="trip-draft" />)
    fireEvent.click(await screen.findByRole('button', { name: 'Завершить поездку и подготовить черновик' }))
    expect(await screen.findByText('Черновик виден только вам. Публичной страницы пока нет.')).toBeTruthy()
    expect(complete).toHaveBeenCalledWith('trip-draft')
    expect(publish).not.toHaveBeenCalled()
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(false)
  })

  it('previews every exported data field and does not auto-fetch external photos', async () => {
    getSite.mockResolvedValueOnce({
      published: false,
      slug: null,
      visibility: null,
      consented_at: null,
      draft_snapshot: sampleSnapshot,
    })
    render(<TripMiniSiteControls tripId="trip-preview" />)

    expect(await screen.findByText('Rome, Italy')).toBeTruthy()
    expect(screen.getByText('A quiet week')).toBeTruthy()
    expect(screen.getByText('Piazza Navona · 41.9, 12.5')).toBeTruthy()
    expect(screen.getByText('Visit at sunset')).toBeTruthy()
    expect(screen.getByText('Статистика: 5 дн. · 1 мест · 2,3 км')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'https://photos.example/cover.jpg' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'https://photos.example/fountain.jpg' })).toBeTruthy()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('requires explicit consent before publishing and displays the returned URL', async () => {
    render(<TripMiniSiteControls tripId="trip-1" />)
    const publishButton = await screen.findByRole('button', { name: 'Опубликовать snapshot' })
    expect(publishButton.hasAttribute('disabled')).toBe(true)
    fireEvent.click(publishButton)
    expect(publish).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(publishButton)
    await screen.findByRole('link', { name: /\/t\/secret-123$/ })
    expect(publish).toHaveBeenCalledWith('trip-1', 'link')
  })

  it('revokes the active public link after owner confirmation', async () => {
    getSite.mockResolvedValueOnce({ published: true, slug: 'active-slug', visibility: 'public', consented_at: '2026-09-25T12:00:00Z' })
    render(<TripMiniSiteControls tripId="trip-2" />)
    fireEvent.click(await screen.findByRole('button', { name: 'Отозвать публикацию' }))
    await waitFor(() => expect(revoke).toHaveBeenCalledWith('trip-2'))
    expect((await screen.findByRole('button', { name: 'Опубликовать snapshot' })).hasAttribute('disabled')).toBe(true)
  })
})
