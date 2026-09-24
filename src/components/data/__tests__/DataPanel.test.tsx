import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DataPanel } from '../DataPanel'

const { getWikiArticleMock } = vi.hoisted(() => ({ getWikiArticleMock: vi.fn() }))
const { ApiErrorMock } = vi.hoisted(() => ({ ApiErrorMock: class ApiError extends Error { status: number; detail: string; constructor(status: number, detail: string) { super(detail); this.status = status; this.detail = detail } } }))

vi.mock('@/api/chatApi', () => ({ ApiError: ApiErrorMock }))

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

const georgiaArticle = {
  ...japanArticle,
  version_id: 'wiki-country-ge-v1',
  slug: 'country-ge',
  title: 'Грузия',
  body: { ...japanArticle.body, summary: 'Опубликованная серверная карточка Грузии.' },
  sources: [{ label: 'ЮНЕСКО: квеври', url: 'https://ich.unesco.org/en/decisions/8.COM/8.13' }],
}

const russiaArticle = {
  ...japanArticle,
  version_id: 'wiki-country-ru-v1',
  slug: 'country-ru',
  title: 'Россия',
  body: { ...japanArticle.body, summary: 'Опубликованная серверная карточка России.' },
  sources: [{ label: 'МЧС России: 112', url: 'https://mchs.gov.ru/deyatelnost/bezopasnost-grazhdan/kak-pravilno-vyzvat-skoruyu_5' }],
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

  it('loads the published Georgia card using its country slug', async () => {
    getWikiArticleMock.mockImplementation(async (slug: string) => {
      if (slug === 'country-ge') return georgiaArticle
      throw new Error('not published')
    })

    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Грузия' }))

    expect(await screen.findByText('Опубликованная серверная карточка Грузии.')).toBeTruthy()
    expect(screen.getByText(/версия wiki-country-ge-v1/)).toBeTruthy()
  })

  it('loads the published Russia card using its country slug', async () => {
    getWikiArticleMock.mockImplementation(async (slug: string) => {
      if (slug === 'country-ru') return russiaArticle
      throw new Error('not published')
    })

    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Россия' }))

    expect(await screen.findByText('Опубликованная серверная карточка России.')).toBeTruthy()
    expect(screen.getByText(/версия wiki-country-ru-v1/)).toBeTruthy()
  })

  it('does not present the fallback country copy as a published article when Wiki is unavailable', async () => {
    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Япония' }))

    await waitFor(() => expect(screen.getByText(/Серверная Wiki недоступна/)).toBeTruthy())
    expect(screen.queryByText(/опубликованная серверная версия/)).toBeNull()
  })

  it('distinguishes an unpublished country article from a server outage', async () => {
    getWikiArticleMock.mockRejectedValue(new ApiErrorMock(404, 'Published article not found'))

    render(<DataPanel onBack={() => undefined} />)
    fireEvent.click(screen.getByRole('button', { name: 'Япония' }))

    expect(await screen.findByText(/Для этой страны ещё нет опубликованной серверной версии/)).toBeTruthy()
    expect(screen.queryByText(/Серверная Wiki недоступна/)).toBeNull()
  })
})
