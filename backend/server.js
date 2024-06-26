require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

// ROUTES IMPORT
const leadRoutes = require('./routes/leads')
const userLGRoutes = require('./routes/userLG')
const emailRoutes = require('./routes/emails')
import path from 'path';

const __dirname = path.resolve();
// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/leads', leadRoutes)
app.use('/api/userLG', userLGRoutes)
app.use('/api/emails', emailRoutes)
app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

