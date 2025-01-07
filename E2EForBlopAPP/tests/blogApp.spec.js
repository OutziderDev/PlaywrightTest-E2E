const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page,request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    const testUser = {
      name:'Administrador',
      username: 'admin',
      password: '123'
    }
    await request.post('http:localhost:3003/api/users',{data:testUser})
    await page.goto('http://localhost:5173')
  })

  test('Login form is show', async ({ page }) => {
    const locator = await page.getByText('Frontend Blog List for Blog API Rest')
    const inputUser = await page.getByTestId('inputUser')
    const inputPass = await page.getByTestId('inputPass')
    await expect(locator).toBeVisible()
    await expect(inputUser && inputPass).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('inputUser').fill('admin')
      await page.getByTestId('inputPass').fill('123')
      await page.getByRole('button', {name: 'Login'}).click()
      const loginSuccess = await page.getByTestId('userInfo')
      expect(loginSuccess).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('inputUser').fill('admin')
      await page.getByTestId('inputPass').fill('321')
      await page.getByRole('button', {name: 'Login'}).click()
      const labelUsername = await page.getByText('Username:')
      const loginSuccess = await page.getByTestId('userInfo')

      expect(loginSuccess).not.toBeVisible()
      expect(labelUsername).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('inputUser').fill('admin')
      await page.getByTestId('inputPass').fill('123')
      await page.getByTestId('btnLogin').click()
      await page.waitForTimeout(1000)
    })
  
    test('a new blog can be created', async ({ page }) => {
      const loginSuccess = await page.getByTestId('userInfo')
      expect(loginSuccess).toBeVisible()
      await page.getByTestId('btnAdd').click()
      await page.getByTestId('inputFormTitle').fill('Title for Playwright')
      await page.getByTestId('inputFormAuthor').fill('betaTester')
      await page.getByTestId('inputFormUrl').fill('www.testE2E.com')
      await page.getByTestId('btnSave').click()
      const newBlog = await page.getByText('Title for Playwright')
      await expect(newBlog).toBeVisible()
    })
  })
})