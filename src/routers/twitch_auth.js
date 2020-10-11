const express = require('express')
const passport = require('passport')
const router = new express.Router()
const TwitchAuthController = require('../controllers/twitch_auth')

const addMonths = require('date-fns/addMonths')

router.get('/auth/twitch', passport.authenticate('twitch'))

router.get('/auth/twitch/callback', passport.authenticate('twitch', { failureRedirect: '/' }), async (req, res) => {
  try {
    const { token } = await TwitchAuthController.passportCallback(req, res)
    res
      .status(200)
      .cookie('tbtoken', token, {
        expires: addMonths(new Date(), 1),
        httpOnly: false
      })
      .redirect(process.env.TWITCHBUDDY_URL)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
