require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('data', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    } return ''
})

app.use(morgan(':method :url :res[content-length] - :response-time ms :data'))



let persons = [
    {
        id: 1,
        name: "Ethan Hunt",
        number: "0401231234"
    },
    {
        id: 2,
        name: "James Bond",
        number: "0400007007"
    },
    {
        id: 3,
        name: "Inspector Clouseau",
        number: "0409879876"
    },
    {
        id: 4,
        name: "Kim Possible",
        number: "0405676789"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/', (req, res) => {
    res.send('<h1>Phonebook Server asd</h1>')
})

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

app.get('/api/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then(contact => {
        res.json(contact.toJSON())
    })
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    // const checkName = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Contact info missing'
        })
    }

    // if (checkName) {
    //     return res.status(400).json({
    //         error: 'Name must be unique'
    //     })
    // }

    const contact = new Contact({
        name: body.name,
        number: body.number
    })
    contact.save().then(savedContact => {
        res.json(savedContact.toJSON())
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})




const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})