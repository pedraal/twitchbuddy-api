const express = require('express')
const auth = require('../middleware/auth')
const ListController = require('../controllers/list')
const router = new express.Router()

router.get('/lists', auth, async (req, res) => {
  try {
    const lists = await ListController.getOwnedLists(req)
    res.send(lists)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

router.post('/lists', auth, async (req, res) => {
  try {
    const list = await ListController.createList(req)
    res.status(201).send(list)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/lists/:id', auth, async (req, res) => {
  try {
    const list = await ListController.updateList(req)
    res.status(200).send(list)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
