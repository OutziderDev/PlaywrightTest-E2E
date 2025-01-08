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
      await expect(loginSuccess).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page,'admin','321')
      const labelUsername = await page.getByText('Username:')
      const loginSuccess = await page.getByTestId('userInfo')

      await expect(loginSuccess).not.toBeVisible()
      await expect(labelUsername).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'admin','123')
      //await page.waitForTimeout(2000)
      await page.waitForSelector('[data-testid="userInfo"]', { state: 'visible',timeout: 1000 });
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      const newBlog = await page.getByText('Blog from Playwright')
      await expect(newBlog).toBeVisible()
    })

    test('blog can be updated', async ({page}) => {
      await createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      await page.getByTestId('btnview').click()
      const countLikes = await page.getByTestId('viewCountLikes')
      await page.getByTestId('btnlike').click()
      await expect(countLikes).toHaveText('1')
    })

    test('user can delete their blogs', async ({page}) => { 
      await createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      await page.on('dialog', dialog => dialog.accept())
      await page.getByTestId('btnDelete').click()
      const newBlog = await page.getByText('Blog from Playwright')
      await expect(newBlog).not.toBeVisible()
    })

    test('only owner can see delete button', async ({page,request}) => { 
      await createBlog(page,'Blog from Playwright','betaTester','www.testE2E.com')
      await page.getByTestId('btnLogout').click()
      const tesothertUser = {
        name:'OtherAdministrador',
        username: 'otheradmin',
        password: '123'
      }
      await request.post('http:localhost:3003/api/users',{data:tesothertUser})

      await loginWith(page,'otheradmin','123')

      const bview= await page.getByTestId('btnview')
      await expect(bview).toBeVisible()

      const bdelete = page.getByTestId('btnDelete')
      await expect(bdelete).not.toBeVisible()
    })

  })


})