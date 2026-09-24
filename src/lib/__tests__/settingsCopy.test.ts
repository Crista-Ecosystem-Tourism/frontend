import { describe, expect, it } from 'vitest'
import { getSettingsCopy } from '../settingsCopy'

describe('settings page translations', () => {
  it('provides a complete English copy for the settings page and delete dialog', () => {
    const copy = getSettingsCopy('en')

    expect(copy.title).toBe('Settings')
    expect(copy.languageNote).toContain('other sections are being localized')
    expect(copy.deleteAccountWarning).toContain('cannot be undone')
    expect(Object.values(copy).every((value) => value.length > 0)).toBe(true)
  })

  it('keeps Russian as the default-language copy', () => {
    expect(getSettingsCopy('ru').title).toBe('Настройки')
    expect(getSettingsCopy('ru').delete).toBe('Удалить')
  })
})
