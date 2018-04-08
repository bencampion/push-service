const express = require('express')
const users = require('./route/users')
const push = require('./route/push')

const app = express()

app.use(express.json())

app.get('/users', users.list)
app.post('/users', users.add)
app.post('/push/:username', push.send)
app.all('*', (req, res, next) => res.status(404).json({error: 'Not found'}))

app.use((err, req, res, next) => {
  if (err.expose) {
    res.status(err.statusCode || 500).json({error: err.message})
  } else {
    res.status(500).json({error: 'Internal server error'})
    console.error(err)
  }
})

app.listen(3000, () => console.log('Listening on port 3000'))
