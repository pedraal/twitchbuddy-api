const ownedList = async (req, res, next) => {
  try {
    if (req.user.lists.indexOf(req.params.id) < 0) {
      throw new Error()
    }
    next()
  } catch (e) {
    res.status(403).send({ error: 'List not owned' })
  }
}

module.exports = ownedList
