if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()

// ======== MIDDLEWARE ==========

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } return ''
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))


// ========= ROUTES =========

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts.map(contact => contact.toJSON()))
    })
})

app.get('/info', (req, res) => {
    Contact.countDocuments().then(count => {
        res.send(
            `<p>Phonebook contains ${count} contacts</p>
             <p>${Date()}</p>`
            )
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id).then(contact => {
        if (contact) {
            res.json(contact.toJSON())
        } else {
            res.status(404).send({ error: 'Unassigned ID // Contact not found' })
        }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const contact = new Contact({
        name: body.name,
        number: body.number
    })

    contact.save()
        .then(savedContact => savedContact.toJSON())
        .then(savedAndFormattedContact => {
            res.json(savedAndFormattedContact)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    updates =  { number: body.number }
    options = {
        new: true,
        runValidators: true
    }

    Contact.findOneAndUpdate({_id: req.params.id}, updates, options)
        .then(updatedContact => updatedContact.toJSON())
        .then(updatedAndFormattedContact => {
            res.json(updatedAndFormattedContact)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})


// ========= ERRORHANDLING =========

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint '})
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'TypeError') {
        return res.status(500).json({ error: 'Contact was already deleted from server' })
    }
    next(error)
}
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})