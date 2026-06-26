const loginWith = async (page, username, password) => {
    await page.getByRole('button', {name:'Login'}).click()
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', {name:'Login'}).click()
}

export { loginWith }