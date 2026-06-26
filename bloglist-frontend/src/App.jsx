import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Toggable from './components/Toggable'
import LoginForm from './components/LoginForm'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import { Container, AppBar, Toolbar, Button, Typography, Box } from '@mui/material'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // const createBlogFormRef = useRef()
  const navigate = useNavigate()

  const getAllBlogs = async () => {
    const allBlogs = await blogService.getAllBlogs()
    setBlogs(allBlogs)
  }

  useEffect(() => {
    getAllBlogs()
  }, [])

  useEffect(() => {
    const loggedInUser = JSON.parse(window.localStorage.getItem('user'))

    if (loggedInUser) {
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
    }

  }, [])


  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogData) => {

    try {
      const response = await blogService.createBlog(blogData)
      console.log('createdBlog', response)
      setSuccessMessage(`a new blog ${response.title} by ${response.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      await getAllBlogs()
      // createBlogFormRef.current.toggleVisibility()
      return true
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return false
    }
  }

  const handleDelete = async (blogForDelete) => {
    const confirmDelete = window.confirm(`Remove blog ${blogForDelete.title} by ${blogForDelete.author}`)
    if (confirmDelete) {
      const response = await blogService.deleteBlog(blogForDelete.id)
      console.log(response)
      setBlogs(blogs.filter(b => b.id !== blogForDelete.id))
      setSuccessMessage('Successfully blog is deleted')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      navigate('/')
    }
  }

  const handleLike = async (blog) => {
    const blogData = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    await blogService.updateBlog(blog.id, blogData)
    await getAllBlogs()
  }

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

  return (<>
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h5' sx={{ flexGrow: 1, textTransform: 'none' }} >Blog App</Typography>
        <Button color='inherit' component={Link} sx={{ mx: 1 }} to="/">blogs</Button >
        {!user && (<Button color='inherit' component={Link} sx={{ mx: 1 }} to="/login">login</Button >)}
        {user && (<Button color='inherit' component={Link} sx={{ mx: 1 }} to="/create">new blog</Button >)}
        {user && (<Button color='inherit' onClick={handleLogout}>logout</Button>)}
      </Toolbar>
    </AppBar>

    <Container>
      <Box sx={{ mt: 3 }}>
        <Notification
          successMessage={successMessage}
          errorMessage={errorMessage}
        /></Box>

      <Box sx={{ mt: 4 }}>
        <Routes>
          <Route path='/' element={<div>
            <BlogList blogs={blogs}
            />

          </div>}
          />
          <Route path='/blogs/:id' element={
            <Blog
              blog={blog}
              user={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          }
          />
          <Route path='/create' element={
            <CreateBlog
              handleCreateBlog={handleCreateBlog}
            />
          }
          />
          <Route path='/login' element={<>
            <LoginForm
              setSuccessMessage={setSuccessMessage}
              setErrorMessage={setErrorMessage}
              setUser={setUser}
            />
          </>}
          />
        </Routes>
      </Box>
    </Container>
  </>)
}

export default App