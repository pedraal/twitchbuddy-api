const express = require('express')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const twitchAuthRouter = require('./routers/twitch_auth')
const userRouter = require('./routers/user')

const auth = require('./middleware/auth')

require('./db/mongoose')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({ secret: process.env.COOKIE_SECRET }))
app.use(passport.initialize())

require('./passport')

app.use(twitchAuthRouter)
app.use(userRouter)

app.get('/', auth, function (req, res) {
  if (req.session && req.session.passport && req.session.passport.user) {
    res.send(req.session.passport.user)
  } else {
    res.send('not-logged-in')
  }
})

module.exports = app
