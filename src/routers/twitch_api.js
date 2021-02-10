const express = require('express')
const router = new express.Router()
const TwitchApiController = require('../controllers/twitch_api')

router.get('/clips', async (req, res) => {
  try {
    const clips = await TwitchApiController.getClips(req)
    res.send(clips)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

router.get('/replays', async (req, res) => {
  try {
    const replays = await TwitchApiController.getReplays(req)
    res.send(replays)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

module.exports = router
