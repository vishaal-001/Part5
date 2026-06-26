const { transform } = require('lodash')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required:true,
        minLength: 3,
        unique:true
    },
    name: {
        type: String,
        required:true
    },
    passwordHash: {
        type: String,
        minLength: 3,
        required:true
    },
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }]
})

userSchema.set('toJSON',{
    transform:(document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)