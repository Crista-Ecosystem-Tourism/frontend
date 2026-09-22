import { expect, test } from '@playwright/test'

test('new player completes the server-backed St Petersburg pilot', async ({ page }) => {
  test.setTimeout(120_000)
  const email = `city-pilot-${Date.now()}@example.test`
  await page.goto('/signup')
  await page.locator('#name').fill('City pilot E2E')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill('CityPilot123')
  await page.getByRole('button', { name: 'Создать аккаунт' }).click()
  await page.getByRole('button', { name: 'Изучение мира' }).click()

  await page.getByRole('button', { name: /1\. Эрмитаж.*Открыто/ }).click()
  await expect(page.getByRole('heading', { name: 'Эрмитаж' })).toBeVisible()
  await page.getByRole('button', { name: '1764', exact: true }).click()
  await expect(page.getByText('Верно! +25 XP')).toBeVisible()
  await page.getByRole('button', { name: /2\. Петергоф.*Открыто/ }).click()
  await expect(page.getByRole('heading', { name: 'Петергоф' })).toBeVisible()
})
