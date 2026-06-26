const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'temporary blog',
    author: 'temp',
    url: 'temp.com',
    likes: 1,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}


const initialUsers = [
  {
    username: 'root',
    name: 'Super User',
    password: 'sekret'
  },
  {
    username: 'john_doe',
    name: 'John Doe',
    password: 'password123'
  },
  {
    username: 'jane_smith',
    name: 'Jane Smith',
    password: 'mypassword'
  },
]

const usersInDb = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb
}