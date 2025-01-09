const loginWith = async (page,username,password) => {
  await page.getByTestId('inputUser').fill(username)
  await page.getByTestId('inputPass').fill(password)
  await page.getByTestId('btnLogin').click()
}

const createBlog = async (page,title,author,url) => {
  await page.getByTestId('btnAdd').click()
  await page.getByTestId('inputFormTitle').fill(title)
  await page.getByTestId('inputFormAuthor').fill(author)
  await page.getByTestId('inputFormUrl').fill(url)
  await page.getByTestId('btnSave').click()
}

const createAuxBlog = async (page,title,author,url) => {
  await page.getByTestId('inputFormTitle').fill(title)
  await page.getByTestId('inputFormAuthor').fill(author)
  await page.getByTestId('inputFormUrl').fill(url)
  await page.getByTestId('btnSave').click()
}

export {loginWith,createBlog,createAuxBlog}