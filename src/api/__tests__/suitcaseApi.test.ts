import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/chatApi'
import {
  fetchSuitcaseWorkspace,
  mapExpenseFromApi,
  mapGoalFromApi,
  mapTripFromApi,
} from '@/api/suitcaseApi'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('auth_token', 'suitcase-test-token')
  mockFetch.mockReset()
})

describe('fetchSuitcaseWorkspace', () => {
  it('requests the workspace with the saved bearer token', async () => {
    const workspace = { trips: [], expenses: [], goals: [] }
    mockFetch.mockResolvedValueOnce(jsonResponse(workspace))

    await expect(fetchSuitcaseWorkspace()).resolves.toEqual(workspace)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/suitcase\/workspace$/),
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer suitcase-test-token',
        },
      }),
    )
  })

  it('preserves server error status and detail as ApiError', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ detail: 'workspace unavailable' }, 503))

    const request = fetchSuitcaseWorkspace()
    await expect(request).rejects.toBeInstanceOf(ApiError)
    await expect(request).rejects.toMatchObject({
      status: 503,
      detail: 'workspace unavailable',
    })
  })
})

describe('Suitcase API row mappers', () => {
  it('maps trip, expense, and goal fields from snake_case and handles nullable trip fields', () => {
    expect(mapTripFromApi({
      id: 'trip-1',
      country: 'Russia',
      city: 'Moscow',
      start_date: '2026-09-01',
      end_date: '2026-09-05',
      image: null,
      mood: 'curious',
      route_json: '{"type":"FeatureCollection"}',
      impressions: 'Great trip',
      photos: ['photo.jpg'],
      is_archived: true,
      created_at: null,
    })).toEqual({
      id: 'trip-1',
      country: 'Russia',
      city: 'Moscow',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      image: undefined,
      mood: 'curious',
      routeJson: '{"type":"FeatureCollection"}',
      impressions: 'Great trip',
      photos: ['photo.jpg'],
      isArchived: true,
      createdAt: '',
    })

    expect(mapExpenseFromApi({
      id: 'expense-1',
      trip_id: 'trip-1',
      amount: 24.5,
      category: 'food',
      title: 'Lunch',
      date: '2026-09-02',
      currency: null,
    })).toEqual({
      id: 'expense-1',
      tripId: 'trip-1',
      amount: 24.5,
      category: 'food',
      title: 'Lunch',
      date: '2026-09-02',
      currency: undefined,
    })

    expect(mapGoalFromApi({
      id: 'goal-1',
      title: 'Visit 5 cities',
      current: 2,
      total: 5,
      color: 'blue',
    })).toEqual({
      id: 'goal-1',
      title: 'Visit 5 cities',
      current: 2,
      total: 5,
      color: 'blue',
    })
  })
})
