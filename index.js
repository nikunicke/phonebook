const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

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
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook contains ${persons.length} contacts</p>
         <p>${Date()}</p>`
        )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    const checkName = persons.find(person => person.name === body.name)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Contact info missing'
        })
    }

    if (checkName) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }


    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})




const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})