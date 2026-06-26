import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}



const loginUser = async (credential) => {
  const response = await axios.post('api/login', credential)
  return response.data
}

const getAllBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async (blogData) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, blogData, config)
  return response.data
}

const updateBlog = async (id, blogData) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogData)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  loginUser,
  setToken,
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog
}