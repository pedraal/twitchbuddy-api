const express = require('express')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const twitchAuthRouter = require('./routers/twitch_auth')
const twitchApiRouter = require('./routers/twitch_api')
const userRouter = require('./routers/user')
const listRouter = require('./routers/list')

require('./db/mongoose')

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(cookieSession({ secret: process.env.COOKIE_SECRET }))
app.use(passport.initialize())

require('./passport')

app.use(twitchAuthRouter)
app.use(userRouter)
app.use(listRouter)
app.use(twitchApiRouter)

module.exports = app
