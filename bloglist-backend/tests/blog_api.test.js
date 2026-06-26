const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')
const User = require('../models/user')

const api = supertest(app)

let token = ''

describe('when there is initially some blogs saved', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api
      .post('/api/users')
      .send({
        username: 'root',
        name: 'token',
        password: '123'
      })

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: '123'
      })

    token = loginResponse.body.token

    for (const blog of helper.initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization',`Bearer ${token}`)
        .send(blog)
    }

  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })


  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    assert.strictEqual(titles.includes('Go To Statement Considered Harmful'), true)
  })

  describe('addition of a new blog', () => {

    test('Unauthorized blog cannot be added', async () => {
      const newBlog = {
        title: "Unauthorized",
        author: "tokenMissing",
        url: "https://unauthorized",
        likes: 18,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: "Async Await Deep Dive",
        author: "Maximilian Schwarzmüller",
        url: "https://academind.com/tutorials/async-await",
        likes: 18,
      }

      await api
        .post('/api/blogs')
        .set('Authorization',`Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.strictEqual(titles.includes('Async Await Deep Dive'), true)
    })

    test('blog without likes defaults to zero', async () => {
      const newBlog = {
        title: "Async Await Deep Dive",
        author: "Maximilian Schwarzmüller",
        url: "https://academind.com/tutorials/async-await",
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization',`Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: "Maximilian Schwarzmüller",
        url: "https://academind.com/tutorials/async-await",
        likes: 18,
      }

      await api
        .post('/api/blogs')
        .set('Authorization',`Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: "Async Await Deep Dive",
        author: "Maximilian Schwarzmüller",
        likes: 18,
      }

      await api
        .post('/api/blogs')
        .set('Authorization',`Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blogs have id property', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('updation of a blog', () => {
    test('succeeds with status code 200 if id is valid and present in the database', async () => {
      const newChangeOfBlog = {
        likes: 404040
      }

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newChangeOfBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.strictEqual(updatedBlog.likes, 404040)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization',`Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

})



after(async () => {
  await mongoose.connection.close()
})