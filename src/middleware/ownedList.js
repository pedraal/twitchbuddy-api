const List = require('../models/list')

const ownedList = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.id)
    if (list.owner.toString() !== req.user.id.toString()) {
      throw new Error()
    }
    next()
  } catch (e) {
    res.status(403).send({ error: 'List not owned' })
  }
}

module.exports = ownedList
