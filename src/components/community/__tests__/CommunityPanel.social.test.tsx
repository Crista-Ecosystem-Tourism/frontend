import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CommunityPanel } from '../CommunityPanel'

const { acceptMock, createMock, listMock, removeMock } = vi.hoisted(() => ({
  acceptMock: vi.fn(),
  createMock: vi.fn(),
  listMock: vi.fn(),
  removeMock: vi.fn(),
}))

vi.mock('@/context/AppContext', () => ({ useApp: () => ({ language: 'en' }) }))
vi.mock('@/api/authApi', () => ({ isLoggedIn: () => true }))
vi.mock('@/api/socialApi', () => ({
  acceptFriendInvite: acceptMock,
  createFriendInvite: createMock,
  listFriends: listMock,
  removeFriend: removeMock,
}))

describe('CommunityPanel social features', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    acceptMock.mockReset().mockResolvedValue({ friend_id: 'friend-1', created: true })
    createMock.mockReset().mockResolvedValue({
      invite_id: 'invite-1', invite_code: 'a'.repeat(43), expires_at: '2026-10-01T00:00:00Z',
    })
    listMock.mockReset().mockResolvedValue([])
    removeMock.mockReset().mockResolvedValue(undefined)
  })

  afterEach(() => window.history.replaceState(null, '', '/'))

  it('loads friends from the API and creates a shareable fragment link', async () => {
    const user = userEvent.setup()
    listMock.mockResolvedValueOnce([{ id: 'friend-1', name: 'Alex', friends_since: '2026-09-01T12:00:00Z' }])
    render(<CommunityPanel onBack={() => undefined} />)

    await user.click(screen.getByRole('tab', { name: 'Friends' }))
    expect(await screen.findByText('Alex')).toBeTruthy()
    await user.click(screen.getByRole('button', { name: 'Create invite link' }))

    const link = await screen.findByRole('textbox', { name: 'Friend invite link' }) as HTMLInputElement
    expect(link.value).toContain('#friend-invite=')
    expect(createMock).toHaveBeenCalledOnce()
  })

  it('requires explicit acceptance of an invite from the URL fragment', async () => {
    const user = userEvent.setup()
    window.history.replaceState(null, '', `/#friend-invite=${'b'.repeat(43)}`)
    render(<CommunityPanel onBack={() => undefined} />)

    await user.click(screen.getByRole('tab', { name: 'Friends' }))
    const accept = await screen.findByRole('button', { name: 'Accept invitation' })
    expect(acceptMock).not.toHaveBeenCalled()
    await user.click(accept)

    await waitFor(() => expect(acceptMock).toHaveBeenCalledWith('b'.repeat(43)))
    expect(await screen.findByText('Friend added.')).toBeTruthy()
  })
})
