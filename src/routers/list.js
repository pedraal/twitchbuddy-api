const express = require('express')
const auth = require('../middleware/auth')
const ownedList = require('../middleware/ownedList')
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

router.get('/lists/shared', auth, async (req, res) => {
  try {
    const lists = await ListController.getSharedLists(req)
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

router.patch('/lists/:id', [auth, ownedList], async (req, res) => {
  try {
    const list = await ListController.updateList(req)
    res.status(200).send(list)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

router.patch('/lists/:id/share', [auth, ownedList], async (req, res) => {
  try {
    const list = await ListController.shareList(req)
    res.status(200).send(list)
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

router.delete('/lists/:id', [auth, ownedList], async (req, res) => {
  try {
    const list = await ListController.deleteList(req)
    res.status(200).send(list)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

module.exports = router
