const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('creation of new user', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        for (const user of helper.initialUsers) {
            const userForSave = new User({
                username: user.username,
                name: user.name,
                passwordHash: await bcrypt.hash(user.password, 10)
            })

            await userForSave.save()
        }
    })

    test('succeed with valid data', async () => {
        const newUser = {
            username: 'new_user',
            name: 'New user',
            password: 'user123'
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        const usernames = usersAtEnd.map(user => user.username)

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
        assert.strictEqual(usernames.includes('new_user'), true)
    })

    test('fails with proper statuscode if username already exists', async () => {
        const newUser = {
            username: helper.initialUsers[0].username,
            name: 'duplicate username',
            password: 'username123'
        }

        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes('expected `username` to be unique'))
    })

    test('fails if username is missing', async () => {
        const newUser = {
            name: 'missing username',
            password: 'missing123'
        }

        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes('username'))

    })

    test('fails if username is short', async () => {
        const newUser = {
            username:'sh',
            name: 'shorter username',
            password: 'shorter123'
        }

        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes('shorter'))
    })

    test('fails if password is missing', async () => {
        const newUser = {
            username:'password',
            name: 'missing password'
        }

        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes('password'))

    })

    test('fails if password is short', async () => {
        const newUser = {
            username:'shorter',
            name: 'shorter password',
            password: 's1'
        }

        const usersAtStart = await helper.usersInDb()

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
        assert(response.body.error.includes('at least 3 character'))
    })

})

after(async () => {
    await mongoose.connection.close()
})

