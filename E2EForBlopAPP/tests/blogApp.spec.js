const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith,createBlog} = require('./helper')

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
      await loginWith(page,'admin','123')
      await page.waitForSelector('[data-testid="userInfo"]', { state: 'visible', timeout: 1000 })
      const loginSuccess = await page.getByTestId('userInfo')
      expect(loginSuccess).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page,'admin','321')
      const labelUsername = await page.getByText('Username:')
      const loginSuccess = await page.getByTestId('userInfo')

      expect(loginSuccess).not.toBeVisible()
      expect(labelUsername).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'admin','123')
      //await page.waitForTimeout(2000)
      await page.waitForSelector('[data-testid="userInfo"]', { state: 'visible',timeout: 1000 });
    })
  
    test('a new blog can be created', async ({ page }) => {
      createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      const newBlog = await page.getByText('Blog from Playwright')
      await expect(newBlog).toBeVisible()
    })

    test('blog can be updated', async ({page}) => {
      createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      await page.getByTestId('btnview').click()
      const countLikes = await page.getByTestId('viewCountLikes')
      await page.getByTestId('btnlike').click()
      await expect(countLikes).toHaveText('1')
    })


  })


})