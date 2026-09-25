import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CommunityPanel } from '../CommunityPanel'

const { acceptMock, addMemberMock, changeRoleMock, claimSharedQuestMock, createMock, createSharedQuestMock, createTeamMock, listMock, listSharedCatalogMock, listSharedQuestsMock, listTeamsMock, removeMock, removeTeamMemberMock } = vi.hoisted(() => ({
  acceptMock: vi.fn(),
  addMemberMock: vi.fn(),
  changeRoleMock: vi.fn(),
  claimSharedQuestMock: vi.fn(),
  createMock: vi.fn(),
  createSharedQuestMock: vi.fn(),
  createTeamMock: vi.fn(),
  listMock: vi.fn(),
  listSharedCatalogMock: vi.fn(),
  listSharedQuestsMock: vi.fn(),
  listTeamsMock: vi.fn(),
  removeMock: vi.fn(),
  removeTeamMemberMock: vi.fn(),
}))

vi.mock('@/context/AppContext', () => ({ useApp: () => ({ language: 'en' }) }))
vi.mock('@/api/authApi', () => ({ isLoggedIn: () => true }))
vi.mock('@/api/socialApi', () => ({
  acceptFriendInvite: acceptMock,
  addTeamMember: addMemberMock,
  claimSharedTeamQuest: claimSharedQuestMock,
  changeTeamRole: changeRoleMock,
  createFriendInvite: createMock,
  createSharedTeamQuest: createSharedQuestMock,
  createTeam: createTeamMock,
  listFriends: listMock,
  listSharedQuestCatalog: listSharedCatalogMock,
  listSharedTeamQuests: listSharedQuestsMock,
  listTeams: listTeamsMock,
  removeFriend: removeMock,
  removeTeamMember: removeTeamMemberMock,
}))

describe('CommunityPanel social features', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
    acceptMock.mockReset().mockResolvedValue({ friend_id: 'friend-1', created: true })
    addMemberMock.mockReset().mockResolvedValue({ created: true })
    changeRoleMock.mockReset().mockResolvedValue({ changed: true })
    claimSharedQuestMock.mockReset().mockResolvedValue({ status: 'complete', xp_awarded: 20, rewards_credited: 2 })
    createMock.mockReset().mockResolvedValue({
      invite_id: 'invite-1', invite_code: 'a'.repeat(43), expires_at: '2026-10-01T00:00:00Z',
    })
    createTeamMock.mockReset()
    createSharedQuestMock.mockReset().mockResolvedValue({ id: 'shared-1' })
    listMock.mockReset().mockResolvedValue([])
    listSharedCatalogMock.mockReset().mockResolvedValue([])
    listSharedQuestsMock.mockReset().mockResolvedValue([])
    listTeamsMock.mockReset().mockResolvedValue([])
    removeMock.mockReset().mockResolvedValue(undefined)
    removeTeamMemberMock.mockReset().mockResolvedValue(undefined)
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

  it('creates a team, adds an existing friend, and lets only the owner manage roles', async () => {
    const user = userEvent.setup()
    listMock.mockResolvedValue([{ id: 'friend-1', name: 'Alex', friends_since: '2026-09-01T12:00:00Z' }])
    const team = {
      id: 'team-1', name: 'Weekend crew', role: 'owner' as const, created_at: '2026-09-24T12:00:00Z',
      members: [
        { id: 'owner-1', name: 'Owner', role: 'owner' as const, joined_at: '2026-09-24T12:00:00Z' },
        { id: 'friend-1', name: 'Alex', role: 'member' as const, joined_at: '2026-09-24T12:00:00Z' },
      ],
    }
    createTeamMock.mockResolvedValue({ ...team, members: [team.members[0]] })
    listTeamsMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([team])
      .mockResolvedValueOnce([{ ...team, members: [team.members[0], { ...team.members[1], role: 'admin' }] }])
    render(<CommunityPanel onBack={() => undefined} />)

    await user.click(screen.getByRole('tab', { name: 'Friends' }))
    await user.type(screen.getByRole('textbox', { name: 'Team name' }), 'Weekend crew')
    await user.click(screen.getByRole('button', { name: 'Create team' }))
    expect(await screen.findByText('Weekend crew')).toBeTruthy()

    await user.selectOptions(screen.getByRole('combobox', { name: 'Add friend to Weekend crew' }), 'friend-1')
    await user.click(screen.getByRole('button', { name: 'Add' }))
    expect(addMemberMock).toHaveBeenCalledWith('team-1', 'friend-1')

    const roleSelect = await screen.findByRole('combobox', { name: 'Role for Alex' })
    await user.selectOptions(roleSelect, 'admin')
    expect(changeRoleMock).toHaveBeenCalledWith('team-1', 'friend-1', 'admin')
  })

  it('starts a published team quest and settles its one-time bonus', async () => {
    const user = userEvent.setup()
    const team = {
      id: 'team-1', name: 'Weekend crew', role: 'owner' as const, created_at: '2026-09-24T12:00:00Z',
      members: [
        { id: 'owner-1', name: 'Owner', role: 'owner' as const, joined_at: '2026-09-24T12:00:00Z' },
        { id: 'friend-1', name: 'Alex', role: 'member' as const, joined_at: '2026-09-24T12:00:00Z' },
      ],
    }
    const activeQuest = {
      id: 'shared-1', quest_id: 'red-square', quest_title: 'Red Square', status: 'active' as const,
      participant_count: 2, completed_count: 1, ready_to_claim: false,
      created_at: '2026-09-24T12:00:00Z', completed_at: null, participants: [],
    }
    listTeamsMock.mockResolvedValue([team])
    listSharedCatalogMock.mockResolvedValue([{ id: 'red-square', city_id: 'moscow', city_name: 'Moscow', title: 'Red Square' }])
    listSharedQuestsMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([activeQuest])
      .mockResolvedValueOnce([{ ...activeQuest, status: 'complete', completed_count: 2, ready_to_claim: true }])
    claimSharedQuestMock.mockResolvedValue({ ...activeQuest, status: 'complete', completed_count: 2, ready_to_claim: true, xp_awarded: 20, rewards_credited: 2 })
    render(<CommunityPanel onBack={() => undefined} />)

    await user.click(screen.getByRole('tab', { name: 'Friends' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Quest for Weekend crew' }), 'red-square')
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(createSharedQuestMock).toHaveBeenCalledWith('team-1', 'red-square')

    await user.click(await screen.findByRole('button', { name: 'Check progress' }))
    expect(claimSharedQuestMock).toHaveBeenCalledWith('team-1', 'shared-1', 'en')
    expect(await screen.findByText('Shared quest completed; one-time bonuses credited to 2 participants.')).toBeTruthy()
  })
})
