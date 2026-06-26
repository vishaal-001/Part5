import Notification from './Notification'
import { useState } from 'react'
import blogService from '../services/blogs'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'

const LoginForm = ({
  setSuccessMessage,
  setErrorMessage,
  setUser
}) => {

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleUserName = (event) => {
    const value = event.target.value
    setUserName(value)
  }

  const handlePassword = (event) => {
    const value = event.target.value
    setPassword(value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials = {
      username: userName,
      password: password
    }

    try {
      const response = await blogService.loginUser(credentials)
      console.log('login response', response)
      window.localStorage.setItem('user', JSON.stringify(response))
      blogService.setToken(response.token)
      setUser(response)
      setSuccessMessage('Logged in successfully')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      navigate('/')
      setUserName('')
      setPassword('')
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Login failed')
      setPassword('')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  return (
    <div>
      <Typography variant='h5' sx={{ ml: 5, mt:2, mb:2  }}>Log in to application</Typography>
      <Box component='form' sx={{ display: 'flex', flexDirection: 'column', ml: 5, gap: 1, width: 400 }} onSubmit={handleLogin}>
        <TextField label='username' type='text' value={userName} onChange={handleUserName} />
        <br />
        <TextField label='password' type="password" value={password} onChange={handlePassword} />
        <br />
        <Button type='submit' variant='contained'>Login</Button>
      </Box>
    </div>
  )
}

export default LoginForm