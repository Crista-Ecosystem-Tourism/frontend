import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MoscowSandbox } from '../MoscowSandbox'

const { getMoscowSandboxMock, getWikiArticleVersionMock } = vi.hoisted(() => ({
  getMoscowSandboxMock: vi.fn(),
  getWikiArticleVersionMock: vi.fn(),
}))

vi.mock('@/api/gameApi', () => ({
  getMoscowSandbox: getMoscowSandboxMock,
  answerMoscowMatching: vi.fn(),
  answerMoscowTimeline: vi.fn(),
  answerMoscowTruthMyth: vi.fn(),
  answerMoscowWordBlocks: vi.fn(),
  answerMoscowPriceSlider: vi.fn(),
  answerMoscowPhotoScanner: vi.fn(),
  restoreMoscowEnergy: vi.fn(),
}))

vi.mock('@/api/wikiApi', () => ({
  getWikiArticleVersion: getWikiArticleVersionMock,
  getWikiArticle: vi.fn(),
}))

describe('MoscowSandbox lesson Wiki references', () => {
  beforeEach(() => {
    getMoscowSandboxMock.mockReset()
    getWikiArticleVersionMock.mockReset()
    getMoscowSandboxMock.mockResolvedValue({
      city: { id: 'moscow', name: 'Москва' },
      profile: { xp: 100, energy: 5, streak: 1 },
      city_stamp: { key: 'moscow-city-explorer', title: 'Штамп Москвы', earned_at: '2026-09-24' },
      lessons: [{
        id: 'red-square', position: 1, title: 'Красная площадь',
        fact: { text: 'Факт', source_url: 'https://example.test/fact', source_label: 'Первоисточник' },
        question: { id: 'q1', text: 'Вопрос?', options: [{ id: 'a', label: 'Ответ' }] },
        explanation: 'Объяснение',
        wiki_reference: { slug: 'moscow', version_id: 'wiki-moscow-v1' },
      }],
      drill: null, matching: null, timeline: null, word_blocks: null,
      price_slider: null, story: null, photo_scanner: null,
      wiki_reference: { slug: 'moscow', version_id: 'wiki-moscow-v1' },
      practice_recovery: { available: false, used_today: false, amount: 1 },
    })
    getWikiArticleVersionMock.mockResolvedValue({
      version_id: 'wiki-moscow-v1', slug: 'moscow', title: 'Москва',
      body: { summary: 'Контекст Москвы.' }, sources: [], license: 'CC BY 4.0', published_at: null,
    })
  })

  it('links a lesson to the same published city-version shown in the Wiki card', async () => {
    render(<MoscowSandbox signedIn refreshKey={0} />)
    const lesson = await screen.findByText(/1\. Красная площадь/)
    expect(lesson).toBeTruthy()
    const referenceLink = screen.getByRole('link', { name: /Общий контекст города · Wiki wiki-moscow-v1/ })
    expect(referenceLink.getAttribute('href')).toBe('#moscow-wiki-article')
    expect(await screen.findByText('Контекст Москвы.')).toBeTruthy()
  })
})
