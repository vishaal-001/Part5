const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:8080/api/testing/reset')
        await request.post('http://localhost:8080/api/users',
            {
                data: {
                    username: 'vishal123',
                    name: 'vishal',
                    password: 'vishal@123'
                }
            }
        )

        await request.post('http://localhost:8080/api/users',
            {
                data: {
                    username: 'ankit123',
                    name: 'ankit',
                    password: 'ankit@123'
                }
            }
        )
        await page.goto('http://localhost:5173')
    })

    // test('Login form is shown', async ({ page }) => {

    //     await expect(page.getByText('Log in to application')).toBeVisible()
    //     await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()

    //     await page.getByRole('button', { name: 'Login' }).click()
    //     await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    //     await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible()
    //     await expect(page.getByLabel('username')).toBeVisible()
    //     await expect(page.getByLabel('password')).toBeVisible()
    // })
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByText('login').click()
            await page.getByLabel('username').fill('vishal123')
            await page.getByLabel('password').fill('vishal@123')
            await page.getByRole('button', { name: 'Login' }).click()

            await expect(page.getByText('Logged in successfully')).toBeVisible()
            await expect(page.getByRole('button', { name: 'logout' })).toHaveCount(1)
            await expect(page).toHaveURL('http://localhost:5173/')
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByText('login').click()
            await page.getByLabel('username').fill('vishal123')
            await page.getByLabel('password').fill('wrong password')
            await page.getByRole('button', { name: 'Login' }).click()

            await expect(page.getByText('invalid credentials')).toBeVisible()
            await expect(page.getByRole('button', { name: 'logout' })).toHaveCount(0)
            await expect(page).toHaveURL('http://localhost:5173/login')
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByText('login').click()
            await page.getByLabel('username').fill('vishal123')
            await page.getByLabel('password').fill('vishal@123')
            await page.getByRole('button', { name: 'Login' }).click()
        })

        test('a logged-in user can create a blog', async ({ page }) => {
            await page.getByText('new blog').click()
            await page.getByLabel('title').fill('new blog from test')
            await page.getByLabel('author').fill('playwright test')
            await page.getByLabel('url').fill('http://playwright')
            await page.getByRole('button', { name: 'Create' }).click()

            await expect(page.getByRole('link', { name: 'new blog from test by playwright test' })).toBeVisible()
            await expect(page).toHaveURL('http://localhost:5173/')
        })

        test('a logged-in user can like a blog', async ({ page }) => {
            await page.getByRole('link', {name: 'new blog', exact: false}).click()
            await page.getByLabel('title').fill('new blog from test for like')
            await page.getByLabel('author').fill('playwright test')
            await page.getByLabel('url').fill('http://playwright')
            await page.getByRole('button', { name: 'Create' }).click()

            await page.getByRole('link', {name:'new blog from test for like', exact: false}).click()

            await page.getByRole('button', { name: 'like' }).click()

            await expect(page.getByText('Likes: 1')).toBeVisible()
        })

        test('a blog can be removed by creator', async ({ page }) => {
            await page.getByRole('link', {name: 'new blog', exact: false}).click()
            await page.getByLabel('title').fill('a blog removed by creator')
            await page.getByLabel('author').fill('playwright test')
            await page.getByLabel('url').fill('http://playwright')
            await page.getByRole('button', { name: 'Create' }).click()

            await page.getByRole('link', {name:'a blog removed by creator', exact: false}).click()

            page.once('dialog', async dialog => await dialog.accept())

            await page.getByRole('button', { name: 'remove blog' }).click()

            await expect(page.getByText('a blog removed by creator')).toHaveCount(0)
            await expect(page).toHaveURL('http://localhost:5173/')
        })

        // test('only the user who added the blog can see the remove button', async ({ page }) => {
        //     await page.getByRole('button', { name: 'Create new blog' }).click()
        //     await page.getByLabel('title').fill('a blog create by vishal')
        //     await page.getByLabel('author').fill('playwright test')
        //     await page.getByLabel('url').fill('http://playwright')
        //     await page.getByRole('button', { name: 'Create' }).click()

        //     await page.getByRole('button', { name: 'view' }).click()
        //     await expect(page.getByRole('button', { name: 'remove blog' })).toBeVisible()

        //     await page.getByRole('button', { name: 'Logout' }).click()

        //     await page.getByRole('button', { name: 'Login' }).click()
        //     await page.getByLabel('username').fill('ankit123')
        //     await page.getByLabel('password').fill('ankit@123')
        //     await page.getByRole('button', { name: 'Login' }).click()

        //     const blog = page.locator('div').filter({
        //         hasText: 'a blog create by vishal playwright test'
        //     })
        //     await blog.getByRole('button', { name: 'view' }).click()

        //     await expect(blog.getByRole('button', { name: 'remove blog' })).not.toBeVisible()
        // })

        // test('ensures that the blogs are arranged in the order according to the most likes first', async ({ page }) => {
        //     await page.getByRole('button', { name: 'Create new blog' }).click()
        //     await page.getByLabel('title').fill('blog one')
        //     await page.getByLabel('author').fill('playwright test')
        //     await page.getByLabel('url').fill('http://playwright')
        //     await page.getByRole('button', { name: 'Create' }).click()

        //     const blog1 = page.locator('.blog').filter({ hasText: 'blog one' })
        //     await blog1.getByRole('button', { name: 'view' }).click()

        //     await blog1.getByRole('button', { name: 'like' }).click()
        //     await expect(blog1.getByText('Likes: 1')).toBeVisible()
        //     await blog1.getByRole('button', { name: 'like' }).click()
        //     await expect(blog1.getByText('Likes: 2')).toBeVisible()
        //     await blog1.getByRole('button', { name: 'like' }).click()
        //     await expect(blog1.getByText('Likes: 3')).toBeVisible()


        //     await blog1.getByRole('button', { name: 'hide' }).click()

        //     await page.getByRole('button', { name: 'Create new blog' }).click()
        //     await page.getByLabel('title').fill('blog two')
        //     await page.getByLabel('author').fill('playwright test')
        //     await page.getByLabel('url').fill('http://playwright')
        //     await page.getByRole('button', { name: 'Create' }).click()

        //     const blog2 = page.locator('.blog').filter({ hasText: 'blog two' })

        //     await blog2.getByRole('button', { name: 'view' }).click()


        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 1')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 2')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 3')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 4')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 5')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 6')).toBeVisible()
        //     await blog2.getByRole('button', { name: 'like' }).click()
        //     await expect(blog2.getByText('Likes: 7')).toBeVisible()


        //     await blog2.getByRole('button', { name: 'hide' }).click()

        //     await page.getByRole('button', { name: 'Create new blog' }).click()
        //     await page.getByLabel('title').fill('blog three')
        //     await page.getByLabel('author').fill('playwright test')
        //     await page.getByLabel('url').fill('http://playwright')
        //     await page.getByRole('button', { name: 'Create' }).click()

        //     const blog3 = page.locator('.blog').filter({ hasText: 'blog three' })
        //     await blog3.getByRole('button', { name: 'view' }).click()


        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 1')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 2')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 3')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 4')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 5')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 6')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 7')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 8')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 9')).toBeVisible()
        //     await blog3.getByRole('button', { name: 'like' }).click()
        //     await expect(blog3.getByText('Likes: 10')).toBeVisible()

        //     await blog3.getByRole('button', { name: 'hide' }).click()

        //     const blogs = page.locator('.blog')

        //     await expect(blogs.nth(0)).toContainText('blog three')
        //     await expect(blogs.nth(1)).toContainText('blog two')
        //     await expect(blogs.nth(2)).toContainText('blog one')
        // })
    })
})