import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography } from '@mui/material'

const CreateBlog = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleTitleChange = (event) => {
    const value = event.target.value
    setTitle(value)
  }

  const handleAuthorChange = (event) => {
    const value = event.target.value
    setAuthor(value)
  }

  const handleUrlChange = (event) => {
    const value = event.target.value
    setUrl(value)
  }

  const newBlog = async (event) => {
    event.preventDefault()

    const blogData = {
      title,
      author,
      url
    }

    const success = await handleCreateBlog(blogData)
    if (success) {
      navigate('/')
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <Typography variant='h5' sx={{ ml: 5 }}>Create Blog</Typography>

      <Box component='form' sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: 400,
        ml: 5,
      }}
      onSubmit={newBlog} >
        <TextField label='title' type="text" value={title} onChange={handleTitleChange} />
        <br />

        <TextField label='author' type="text" value={author} onChange={handleAuthorChange} />
        <br />

        <TextField label='url' type="text" value={url} onChange={handleUrlChange} />
        <br />
        <Button type="submit" variant='contained'>Create</Button>
      </Box>
    </div >
  )
}

export default CreateBlog