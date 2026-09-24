import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  answerMoscowBoss,
  answerMoscowQuest,
  getMoscowBoss,
  getMoscowQuest,
  getOnboarding,
} from '../gameApi'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
  localStorage.setItem('auth_token', 'moscow-language-test-token')
  mockFetch.mockResolvedValue(new Response('{}', { status: 200 }))
})

describe('Moscow quest language API', () => {
  it('requests the selected first-trip edition', async () => {
    await getOnboarding('en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/game\/onboarding\?language=en$/),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('requests the selected lesson edition', async () => {
    await getMoscowQuest('moscow-red-square', 'en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/game\/paths\/moscow\/quests\/moscow-red-square\?language=en$/),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('submits the answer against the selected edition', async () => {
    await answerMoscowQuest('moscow-red-square', 'beautiful', 'en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/game\/paths\/moscow\/quests\/moscow-red-square\/answer\?language=en$/),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ answer_key: 'beautiful' }),
      }),
    )
  })

  it('requests the published boss edition in the selected language', async () => {
    await getMoscowBoss('en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/game\/paths\/moscow\/boss\?language=en$/),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('sends the selected boss language for localized feedback', async () => {
    await answerMoscowBoss([{ question_id: 'boss-q', answer_key: '1489' }], 'en')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/game\/paths\/moscow\/boss\/answer\?language=en$/),
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
