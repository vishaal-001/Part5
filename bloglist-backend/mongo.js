require('dotenv').config()
const { result } = require('lodash')
const mongoose = require('mongoose')


mongoose.set('strictQuery', false)


const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
})

const Blogs = mongoose.model('blog', blogSchema)

const blogs = [{
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
}, {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
}, {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
}]


mongoose.connect(process.env.TEST_MONGODB_URI, { family: 4 })
    .then(result => {
        console.log('connected to mongodb')

        const promises = []
        for (let blogData of blogs) {
            const blog = new Blogs(blogData)

            promises.push(blog.save())
        }
        return Promise.all(promises)
    })
    .then(result => {
        console.log('All blogs saved')
        mongoose.connection.close()
    })
    .catch(error => console.log('failed to connect mongodb'))

