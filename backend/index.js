'use strict'
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./config/config')
const authRouter = require('./routes/authRoutes')
const passport = require('./utils/passport')
const userRouter = require('./routes/userRoutes')
const port = config.PORT

app.use(express.static("uploads"))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use('/auth', authRouter)
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))