import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('Unauthenticate users can see only blog info but not buttons', () => {
  const blog = {
    id: '507f1f77bcf86cd799439011',
    title: 'React Testing Strategies',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
    likes: 12,
    user: {
      id: '507f191e810c19729de860ea',
      username: 'kent',
      name: 'Kent C. Dodds'
    }
  }
  render(<Blog blog={blog} user={null} />)

  expect(screen.getByText('React Testing Strategies')).toBeVisible()
  expect(screen.getByText('Kent C. Dodds', { exact: false })).toBeVisible()
  expect(screen.getByText(/Likes:\s*12/i)).toBeVisible()
  expect(screen.getByText(blog.url, { exact: false })).toBeVisible()

  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove blog' })).not.toBeInTheDocument()

})

test('non-creator logged-in user can only see the like button', () => {
  const blog = {
    id: '507f1f77bcf86cd799439011',
    title: 'React Testing Strategies',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
    likes: 12,
    user: {
      id: '507f191e810c19729de860ea',
      username: 'kent',
      name: 'Kent C. Dodds'
    }
  }

  const user = {
    id: '507f191e810c19729de860eb',
    username: 'ironman',
    name: 'robert'
  }

  render(<Blog blog={blog} user={user} />)

  expect(screen.getByText('React Testing Strategies')).toBeVisible()
  expect(screen.getByText(/Kent C\. Dodds/i)).toBeVisible()
  expect(screen.getByText(/Likes:\s*12/i)).toBeVisible()
  expect(screen.getByText(blog.url, { exact: false })).toBeVisible()

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove blog' })).not.toBeInTheDocument()
})


test('blog creator can see both like and remove buttons', () => {
  const blog = {
    id: '507f1f77bcf86cd799439011',
    title: 'React Testing Strategies',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/blog/common-mistakes-with-react-testing-library',
    likes: 12,
    user: {
      id: '507f191e810c19729de860ea',
      username: 'kent',
      name: 'Kent C. Dodds'
    }
  }

  const user = {
    id: '507f191e810c19729de860ea',
    username: 'kent',
    name: 'Kent C. Dodds'
  }

  render(<Blog blog={blog} user={user} />)

  expect(screen.getByText('React Testing Strategies')).toBeVisible()
  expect(screen.getByText(/Kent C\. Dodds/i)).toBeVisible()
  expect(screen.getByText(/Likes:\s*12/i)).toBeVisible()
  expect(screen.getByText(blog.url, { exact: false })).toBeVisible()

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove blog' })).toBeInTheDocument()

})