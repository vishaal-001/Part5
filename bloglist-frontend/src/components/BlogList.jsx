import { Link } from 'react-router-dom'


const BlogList = ({ blogs }) => {
  //   console.log(blogs[0].title)

  return (<>
    <h2>blogs</h2>
    <ul>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`} >{blog.title} by {blog.author}</Link>
        </li>
      )}
    </ul>
  </>)
}

export default BlogList