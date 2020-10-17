const List = require('../models/list')
const User = require('../models/user')

module.exports = {
  getOwnedLists: async (req) => {
    const user = await User.findById(req.user._id).populate('ownedLists').exec()
    return user.ownedLists
  },
  getSharedLists: async (req) => {
    const user = await User.findById(req.user._id).populate('sharedLists').exec()
    return user.sharedLists
  },
  createList: async (req) => {
    const list = new List({ ...req.body, owner: req.user._id })
    await list.save()
    return list
  },
  updateList: async (req) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'clips']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
      throw new Error('Invalid updates!')
    }

    const list = await List.findById(req.params.id)
    updates.forEach(update => (list[update] = req.body[update]))
    await list.save()
    return list
  },
  shareList: async (req) => {
    const list = await List.findById(req.params.id)
    const user = await User.findOne({ displayName: req.body.username })

    if (!user) {
      throw new Error('User not found')
    }

    list.sharedWith.push(user._id)
    list.save()
  }
}
