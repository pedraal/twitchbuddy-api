const auth = require('../middleware/auth')
const express = require('express')
const UserController = require('../controllers/user')
const router = new express.Router()

router.get('/me', auth, async (req, res) => {
  try {
    res.send(req.user)
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/logout', auth, async (req, res) => {
  try {
    UserController.logout(req)
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/logoutall', auth, async (req, res) => {
  try {
    UserController.logoutall(req)
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get('/me/favorites', auth, async (req, res) => {
  try {
    res.send(req.user.favorites)
  } catch (error) {
    res.status(500).send()
  }
})

router.patch('/me/favorites', auth, async (req, res) => {
  try {
    const favorites = await UserController.updateFavorites(req)
    res.send(favorites)
  } catch (error) {
    res.status(500).send()
  }
})

module.exports = router
