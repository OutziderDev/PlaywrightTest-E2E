const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Frontend Blog List for Blog API Rest')
    const inputUser = await page.getByTestId('inputUser')
    const inputPass = await page.getByTestId('inputPass')
    await expect(locator).toBeVisible()
    await expect(inputUser && inputPass).toBeVisible()
  })
})