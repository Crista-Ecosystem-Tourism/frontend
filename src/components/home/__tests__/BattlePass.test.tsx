import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BattlePass } from '../BattlePass'

describe('BattlePass translations', () => {
  it('renders the English pass and reward names when English is selected', () => {
    render(<BattlePass points={1000} isPremium={false} onUpgrade={() => {}} language="en" />)

    expect(screen.getByRole('heading', { name: 'Traveler Pass' })).toBeTruthy()
    expect(screen.getByText('Progress through levels as you play. Your rewards are yours to keep.')).toBeTruthy()
    expect(screen.getByText('First Steps Stamp')).toBeTruthy()
    expect(screen.getByText('Partner tour discount')).toBeTruthy()
  })

  it('keeps the Russian pass and rewards in Russian', () => {
    render(<BattlePass points={1000} isPremium={false} onUpgrade={() => {}} language="ru" />)

    expect(screen.getByRole('heading', { name: 'Пропуск путешественника' })).toBeTruthy()
    expect(screen.getByText('Штамп «Первый шаг»')).toBeTruthy()
    expect(screen.getByText('Скидка на партнёрский тур')).toBeTruthy()
  })
})
