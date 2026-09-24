import { describe, expect, it } from 'vitest'
import { getGameCopy } from '../gameCopy'

describe('game interface translations', () => {
  it('formats English game screen labels and dynamic progress', () => {
    const copy = getGameCopy('en')

    expect(copy.worldCoverage).toBe('World coverage')
    expect(copy.openCountriesCount(3)).toBe('3 of 195 countries')
    expect(copy.lessonProgress(2, 5, 40)).toBe('Lesson 2 of 5, 40% complete')
    expect(copy.categoryNames.food).toBe('Food')
    expect(copy.unopenedCountry('Japan')).toContain('Japan')
  })

  it('keeps Russian text and inflects city counts', () => {
    const copy = getGameCopy('ru')

    expect(copy.worldCoverage).toBe('Охват мира')
    expect(copy.cityCount(1)).toBe('1 город')
    expect(copy.cityCount(3)).toBe('3 города')
    expect(copy.cityCount(12)).toBe('12 городов')
    expect(copy.categoryNames.food).toBe('Кухня')
  })
})
