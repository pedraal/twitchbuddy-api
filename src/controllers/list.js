const List = require('../models/list')
const User = require('../models/user')

module.exports = {
  getOwnedLists: async (req) => {
    const user = await User.findById(req.user._id).populate('lists').exec()
    return user.lists
  },
  createList: async (req) => {
    const list = new List(req.body)
    list.owners.push(req.user._id)

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
  }
}