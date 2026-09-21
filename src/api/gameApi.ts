import { ApiError } from './chatApi'
import { getAuthHeaders } from './authApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export type GameProfile = {
  xp: number
  energy: number
  streak: number
}

export type GameDailyProgress = {
  timezone: 'Europe/Moscow'
  streak: number
  completed_quests: number
  goal: number
  goal_reached: boolean
}

export type OnboardingContent = {
  id: string
  country: { id: string; name: string; city: string }
  chris: { name: string; intro: string }
  scene: { title: string; mode: string }
  fact: { text: string; source_url: string; source_label?: string }
  question: {
    id: string
    text: string
    options: Array<{ id: string; label: string }>
  }
  reward: { xp: number; stamp_title: string }
}

export type OnboardingState = {
  content: OnboardingContent
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  starter_stamp: { key: string; title: string; earned_at: string } | null
}

export type OnboardingAnswer = {
  correct: boolean
  xp_awarded: number
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  starter_stamp: { key: string; title: string; earned_at: string } | null
}

export type MoscowQuestState = {
  quest: {
    id: string
    kind: string
    position: number
    prerequisite_quest_id: string | null
  }
  content: OnboardingContent
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  stamp: { key: string; title: string; earned_at: string } | null
}

export type MoscowQuestAnswer = {
  correct: boolean
  xp_awarded: number
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  stamp: { key: string; title: string; earned_at: string } | null
  explanation: string
}

export type MoscowPathState = {
  city: {
    id: string
    name: string
    tier: number
    required_quest_count: number
    completion_stamp: { key: string; title: string } | null
  }
  profile: GameProfile
  daily: GameDailyProgress
  nodes: Array<{
    id: string
    kind: string
    position: number
    completed: boolean
    unlocked: boolean
    prerequisite_quest_id: string | null
    district: { id: string; name: string; position: number } | null
  }>
  boss: {
    title: string
    question_count: number
    unlocked: boolean
    completed: boolean
    sandbox_unlocked: boolean
  } | null
}

export type MoscowBossState = {
  city: { id: string; name: string }
  content: {
    chris: { name: string; intro: string }
    scene: { title: string; mode: string }
    questions: Array<{
      id: string
      text: string
      options: Array<{ id: string; label: string }>
      explanation?: string
    }>
    sources?: Array<{ label: string; url: string }>
  }
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  city_stamp: { key: string; title: string; earned_at: string } | null
  sandbox_unlocked: boolean
}

export type MoscowBossAnswer = {
  correct: boolean
  incorrect_answers: number
  profile: GameProfile
  daily: GameDailyProgress
  completed: boolean
  city_stamp: { key: string; title: string; earned_at: string } | null
  sandbox_unlocked: boolean
  feedback: Array<{ question_id: string; correct: boolean; explanation: string }>
}

export type MoscowSandboxState = {
  city: { id: string; name: string }
  profile: GameProfile
  city_stamp: { key: string; title: string; earned_at: string }
  lessons: Array<{
    id: string
    position: number
    title: string
    fact: { text: string; source_url: string; source_label?: string }
    question: { id: string; text: string; options: Array<{ id: string; label: string }> }
    explanation: string
  }>
  drill: {
    title: string
    intro: string
    statements: Array<{ id: string; text: string }>
  } | null
  matching: {
    title: string
    intro: string
    pairs: Array<{ id: string; left: string }>
    choices: Array<{ id: string; label: string }>
  } | null
  timeline: {
    title: string
    intro: string
    items: Array<{ id: string; label: string }>
  } | null
  word_blocks: {
    title: string
    intro: string
    blocks: Array<{ id: string; label: string }>
  } | null
}

export type TruthMythAnswer = {
  correct: boolean
  explanation: string
  profile: GameProfile
}

export type MoscowMatchingAnswer = {
  correct: boolean
  incorrect_pairs: string[]
  feedback: Array<{ pair_id: string; correct: boolean; explanation: string }>
  profile: GameProfile
}

export type MoscowTimelineAnswer = {
  correct: boolean
  expected_order: string[] | null
  feedback: Array<{ item_id: string; correct: boolean; explanation: string }>
  profile: GameProfile
}

export type MoscowWordBlocksAnswer = {
  correct: boolean
  explanation: string
  profile: GameProfile
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const body = await response.json()
      detail = body.detail || detail
    } catch {
      // A non-JSON proxy response should still be reported to the user.
    }
    throw new ApiError(response.status, detail)
  }
  return response.json() as Promise<T>
}

export async function getOnboarding(): Promise<OnboardingState> {
  return parse<OnboardingState>(await fetch(`${API_BASE_URL}/game/onboarding`, {
    headers: getAuthHeaders(),
  }))
}

export async function answerRedSquare(answerKey: string): Promise<OnboardingAnswer> {
  return parse<OnboardingAnswer>(await fetch(`${API_BASE_URL}/game/onboarding/red-square/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ answer_key: answerKey }),
  }))
}

export async function getMoscowQuest(questId: string): Promise<MoscowQuestState> {
  return parse<MoscowQuestState>(await fetch(`${API_BASE_URL}/game/paths/moscow/quests/${questId}`, {
    headers: getAuthHeaders(),
  }))
}

export async function getMoscowPath(): Promise<MoscowPathState> {
  return parse<MoscowPathState>(await fetch(`${API_BASE_URL}/game/paths/moscow`, {
    headers: getAuthHeaders(),
  }))
}

export async function answerMoscowQuest(questId: string, answerKey: string): Promise<MoscowQuestAnswer> {
  return parse<MoscowQuestAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/quests/${questId}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ answer_key: answerKey }),
  }))
}

export async function getMoscowBoss(): Promise<MoscowBossState> {
  return parse<MoscowBossState>(await fetch(`${API_BASE_URL}/game/paths/moscow/boss`, {
    headers: getAuthHeaders(),
  }))
}

export async function getMoscowSandbox(): Promise<MoscowSandboxState> {
  return parse<MoscowSandboxState>(await fetch(`${API_BASE_URL}/game/paths/moscow/sandbox`, {
    headers: getAuthHeaders(),
  }))
}

export async function answerMoscowTruthMyth(
  statementId: string,
  answerKey: 'truth' | 'myth',
): Promise<TruthMythAnswer> {
  return parse<TruthMythAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/sandbox/truth-myth/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ statement_id: statementId, answer_key: answerKey }),
  }))
}

export async function answerMoscowMatching(
  answers: Array<{ pair_id: string; choice_id: string }>,
): Promise<MoscowMatchingAnswer> {
  return parse<MoscowMatchingAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/sandbox/matching/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ answers }),
  }))
}

export async function answerMoscowTimeline(orderedIds: string[]): Promise<MoscowTimelineAnswer> {
  return parse<MoscowTimelineAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/sandbox/timeline/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ ordered_ids: orderedIds }),
  }))
}

export async function answerMoscowWordBlocks(orderedIds: string[]): Promise<MoscowWordBlocksAnswer> {
  return parse<MoscowWordBlocksAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/sandbox/word-blocks/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ ordered_ids: orderedIds }),
  }))
}

export async function answerMoscowBoss(
  answers: Array<{ question_id: string; answer_key: string }>,
): Promise<MoscowBossAnswer> {
  return parse<MoscowBossAnswer>(await fetch(`${API_BASE_URL}/game/paths/moscow/boss/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ answers }),
  }))
}
