'use strict'
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./config/config')
const userRouter = require('./routes/userRoutes')
const authRouter = require('./routes/authRoutes')
const port = config.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))