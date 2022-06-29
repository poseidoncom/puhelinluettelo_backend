const { request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

let persons = [
    {
        name: "Tuukka1",
        number: '0456567226',
        id: 1

    },
    {
      name: "Emilia",
      number: '123456789',
      id: 2
    }
]

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))


const generateId = () =>{
    return Math.floor(Math.random() * 1000)
}

app.get('/api',(request, response) =>{
  response.send("try /api/persons")
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/info', (request, response) => {
    const date = new Date
    const phoneBookLength = persons.length
    response.write("<p>phonebook has "+phoneBookLength+" numbers.</p>")
    response.write("<p>"+date+"</p>")
    response.send()
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.post('/api/persons', (request, response)=>{
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
    }
    if(!body.number) {
      return response.status(400).json({
        error: 'number missing'
      })
    }

    if(persons.some(person => person.name === body.name)){
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    
    const person = {
        name : body.name,
        number : body.number,
        id : generateId(),
    }

    persons = persons.concat(person)
    response.json(person)

})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})  