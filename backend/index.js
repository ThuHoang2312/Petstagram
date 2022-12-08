const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./config/config')
const authRouter = require('./routes/authRoutes')
const passport = require('./utils/passport')
const userRouter = require('./routes/userRoutes')

const photoRouter = require('./routes/photoRoute')
const commentRouter = require('./routes/commentRoute')
const likeRouter = require('./routes/likeRoute')
const searchRouter = require('./routes/searchRoute')

app.use(express.json()) // for parsing application/json
app.use(cors())
app.use(express.static('uploads'))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/auth', authRouter)
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter)
app.use('/front', passport.authenticate('jwt', { session: false }), photoRouter)
app.use('/comment', commentRouter)
app.use('/like', likeRouter)
app.use('/search', searchRouter)

app.listen(config.PORT, () =>
  console.log(`Example app listening on port ${config.PORT}!`)
)
