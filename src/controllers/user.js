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
  }
}
