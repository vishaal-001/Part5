import { Link as MuiLink, Typography, Paper, Button, Stack } from '@mui/material'
const Blog = ({ blog, user, handleLike, handleDelete }) => {

  if (!blog) {
    return null
  }


  const blogStyle = {
    paddingTop: 1,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5
  }

  return (
    <Paper elevation={3} sx={{
      p: 4,
      mt: 3
    }}>
      <Typography variant='h3' gutterBottom>{blog.title}</Typography>

      <Typography variant='h5' color='text.secondary' gutterBottom>by {blog.author}</Typography>

      <MuiLink href={blog.url} target='_blank' rel="noreferrer"
        sx={{ display: 'block', mb: 2 }} >{blog.url}</MuiLink>

      <Typography sx={{ mb: 2 }}>Added by {blog.user?.name}</Typography>

      <Stack direction='row' spacing={2} alignItems='center'>
        <Typography>{blog.likes} likes</Typography>

        {user && <Button variant='outlined' onClick={() => handleLike(blog)}>Like</Button>}

        {user && blog.user && blog.user.id === user.id && (<Button variant='outlined' color='error' onClick={() => handleDelete(blog)}>Remove</Button>)}
      </Stack>

    </Paper >)
}

export default Blog