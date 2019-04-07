require('dotenv').config()
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
    res.send(
        `<p>Phonebook contains ${persons.length} contacts</p>
         <p>${Date()}</p>`
        )
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

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Contact info missing'
        })
    }


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
    const contact = {
        name: body.name,
        number: body.number
    }
    
    if (!body.number) {
        return res.status(400).json({
            error: "Number missing"
        })
    }

    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedContact => {
            res.json(updatedContact.toJSON())
        })
        .catch(err => (err))
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
    console.log('HEREHERHER')
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'Malformatted id' })
    }
    next(error)
}
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})