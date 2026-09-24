import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DataPanel } from '../DataPanel'

const { getWikiArticleMock } = vi.hoisted(() => ({ getWikiArticleMock: vi.fn() }))

vi.mock('@/api/wikiApi', () => ({
  getWikiArticle: getWikiArticleMock,
  getMyWikiDrafts: vi.fn(async () => []),
  getWikiReviewQueue: vi.fn(async () => []),
  createWikiDraft: vi.fn(),
  submitWikiDraft: vi.fn(),
  publishWikiDraft: vi.fn(),
}))

vi.mock('@/context/AppContext', () => ({
  useApp: () => ({ user: null }),
}))

vi.mock('../CountryCarousel', () => ({
  CountryCarousel: ({ items, onOpen }: {
    items: Array<{ id: string; name: string }>
    onOpen: (id: string) => void
  }) => <div>{items.map((item) => (
    <button key={item.id} type="button" onClick={() => onOpen(item.id)}>{item.name}</button>
  ))}</div>,
}))

const japanArticle = {
  version_id: 'wiki-country-jp-v1',
  slug: 'country-jp',
  title: 'Япония',
  body: {
    summary: 'Опубликованная серверная карточка Японии.',
    history: 'История из Wiki.',
    cuisine: 'Washoku из Wiki.',
    traditions: 'Обычаи из Wiki.',
    practical: [{ label: 'Валюта', value: 'Японская иена (JPY, ¥)' }],
  },
  sources: [{ label: 'Официальный источник', url: 'https://example.test/japan' }],
  license: 'CC BY 4.0',
  published_at: '2026-09-24T00:00:00Z',
}

describe('DataPanel country Wiki publication state', () => {
  beforeEach(() => {
    getWikiArticleMock.mockReset()
    getWikiArticleMock.mockRejectedValue(new Error('offline'))
  })

  it('shows version and sources for a published country article', async () => {
    getWikiArticleMock.mockImplementation(async (slug: string) => {
      if (slug === 'country-jp') return japanArticle
      throw new Error('not published')
    })

    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Япония' }))

    expect(await screen.findByText('Опубликованная серверная карточка Японии.')).toBeTruthy()
    expect(screen.getByText(/версия wiki-country-jp-v1/)).toBeTruthy()
    expect(screen.getByRole('link', { name: /Официальный источник/ }).getAttribute('href')).toBe('https://example.test/japan')
  })

  it('does not present the fallback country copy as a published article when Wiki is unavailable', async () => {
    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Япония' }))

    await waitFor(() => expect(screen.getByText(/Серверная Wiki недоступна/)).toBeTruthy())
    expect(screen.queryByText(/опубликованная серверная версия/)).toBeNull()
  })
})
