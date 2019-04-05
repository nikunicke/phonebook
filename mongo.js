const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit()
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@cluster0-mmde9.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
    console.log('Contacts:')
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact)
        })
        mongoose.connection.close();
    })
} else {
    console.log(`Adding ${process.argv[3]}, number: ${process.argv[4]} to phonebook`)
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    contact.save().then(response => {
        console.log('Contact saved!');
        mongoose.connection.close();
    })
}
