const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {

    const blogs = await Blog
        .find({})
        .populate('user', {
            username: 1,
            name: 1

        })

    response.json(blogs)

    // Blog
    //     .find({}).then((blogs) => {
    // response.json(blogs)
    //     })
    //     .catch(error => logger.error(error))
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes ?? 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)

    // blog
    //     .save()
    //     .then((blog) => response.status(201).json(blog))
    //     .catch((error) => {
    //         if (error.name === 'ValidationError') {
    //             return response.status(400).json({
    //                 error: error.message
    //             })
    //         }
    //         logger.error(error)
    //     })
})

blogRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes, user } = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    blog.title = title ?? blog.title
    blog.author = author ?? blog.author
    blog.url = url ?? blog.url
    blog.likes = likes ?? blog.likes
    blog.user = user ?? blog.user

    const savedChanges = await blog.save()

    return response.status(200).json(savedChanges)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    // logger.info('id',request.params.id)
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    if (blog.user.toString() === user.id.toString()) {
        const deletedBlog = await Blog.findByIdAndDelete(id)
        // logger.info('deletedBlog', deletedBlog)

        user.blogs = user.blogs.filter(blogId => blogId.toString() !== deletedBlog.id.toString())
        await user.save()

        return response.status(204).end()
    } else {
        return response.status(403).json({ error: 'Only creator can delete blog' })
    }
})

module.exports = blogRouter