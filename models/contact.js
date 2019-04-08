const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}...`)


mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Error connecting to MongoDB: ', err.message)
    })

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        required: true,
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)