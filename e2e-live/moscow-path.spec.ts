import { expect, test } from '@playwright/test'

test('new player signs up and completes the three live Moscow quests', async ({ page }) => {
  const email = `moscow-e2e-${Date.now()}@example.test`
  await page.goto('/signup')
  await page.locator('#name').fill('Moscow E2E')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill('MoscowE2e123')
  await page.getByRole('button', { name: 'Создать аккаунт' }).click()

  await page.getByRole('button', { name: 'Изучение мира' }).click()

  await expect(page.getByRole('heading', { name: 'Первое путешествие' })).toBeVisible()
  await page.getByRole('button', { name: 'Выбрать Россию' }).click()
  await page.getByRole('button', { name: 'Узнать историю места' }).click()
  await page.getByRole('button', { name: 'Пройти мини-квест' }).click()
  await page.getByRole('button', { name: 'Красивый' }).click()
  await expect(page.getByText('Верно! +50 XP')).toBeVisible()

  await page.getByRole('button', { name: /Спасская башня/ }).click()
  await expect(page.getByRole('heading', { name: 'Спасская башня' })).toBeVisible()
  await page.getByRole('button', { name: '1491' }).click()
  await expect(page.getByRole('button', { name: /Спасская башня.*Пройдено/ })).toBeVisible()

  await page.getByRole('button', { name: /Царь-колокол/ }).click()
  await expect(page.getByRole('heading', { name: 'Царь-колокол' })).toBeVisible()
  await page.getByRole('button', { name: '1735' }).click()
  await expect(page.getByRole('button', { name: /Царь-колокол.*Пройдено/ })).toBeVisible()
  await expect(page.getByText('Сегодня: 3/2 точек · цель выполнена')).toBeVisible()
})
