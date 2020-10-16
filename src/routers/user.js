const auth = require('../middleware/auth')
const express = require('express')
const UserController = require('../controllers/user')
const router = new express.Router()

router.get('/me', auth, async (req, res) => {
  try {
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/logout', auth, async (req, res) => {
  try {
    UserController.logout(req)
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/logoutall', auth, async (req, res) => {
  try {
    UserController.logoutall(req)
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
