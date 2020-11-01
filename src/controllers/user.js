// const User = require('../models/user')

module.exports = {
  logout: async (req) => {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
  },
  logoutall: async (req) => {
    req.user.tokens = []
    await req.user.save()
  },
  updateFavorites: async (req) => {
    req.user.favorites = req.body
    await req.user.save()

    return req.user.favorites
  }
}
