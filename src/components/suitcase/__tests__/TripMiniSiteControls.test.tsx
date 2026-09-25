import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { getTripMiniSite, publishTripMiniSite, revokeTripMiniSite } from '@/api/suitcaseApi'
import { TripMiniSiteControls } from '../TripMiniSiteControls'

vi.mock('@/api/suitcaseApi', () => ({
  getTripMiniSite: vi.fn(),
  publishTripMiniSite: vi.fn(),
  revokeTripMiniSite: vi.fn(),
}))

const getSite = vi.mocked(getTripMiniSite)
const publish = vi.mocked(publishTripMiniSite)
const revoke = vi.mocked(revokeTripMiniSite)

beforeEach(() => {
  getSite.mockReset().mockResolvedValue({ published: false, slug: null, visibility: null, consented_at: null })
  publish.mockReset().mockResolvedValue({ published: true, slug: 'secret-123', visibility: 'link', consented_at: '2026-09-25T12:00:00Z' })
  revoke.mockReset().mockResolvedValue()
  vi.stubGlobal('confirm', vi.fn(() => true))
})

describe('TripMiniSiteControls', () => {
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
