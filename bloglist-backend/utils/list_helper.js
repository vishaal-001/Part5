const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const total = blogs.reduce((sum, blog) => { return sum + blog.likes }, 0)

    return total
}

const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce((max, blog) => {
        return max.likes > blog.likes ? max : blog
    }, blogs[0])

    return blogWithMostLikes
}

//Most blogs without Lodash library
// const mostBlogs = (blogs) => {
//     const count = {}
//     blogs.forEach(blog => {
//         count[blog.author] = (count[blog.author] || 0) + 1
//     })
//     console.log('count', count)

//     let maxAuthor = ''
//     let maxBlogs = 0

//     for(let author in count){
//         if(count[author]>maxBlogs){
//             maxBlogs = count[author]
//             maxAuthor = author
//         }
//     }

//     return {
//         author : maxAuthor,
//         blogs : maxBlogs
//     }
// }

//Most blogs with lodash library
const _ = require('lodash')

const mostBlogs = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')

    const count = _.mapValues(grouped, blogs => blogs.length)

    const max = _.maxBy(
        Object.entries(count),
        ([author, blogs]) => blogs
    )
    return {
        author: max[0],
        blogs: max[1]
    }
}

const mostLikes = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')

    const count = _.mapValues(grouped, blogs => { return blogs.reduce((sum, blog) => sum + blog.likes , 0) })

    const max = _.maxBy(
        Object.entries(count),
        ([author,likes])=>likes
    )
    return {
        author: max[0],
        likes: max[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}