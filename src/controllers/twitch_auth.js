const User = require('../models/user')

const passportStrategy = (profile, done) => {
  done(null, profile)
}

const passportCallback = async (req, res) => {
  if (!req.session || !req.session.passport || !req.session.passport.user) {
    return res.redirect('/auth/twitch')
  }
  let user = await User.findOne({ twitchId: req.session.passport.user.twitchId })
  if (!user) {
    user = new User(req.session.passport.user)
    await user.save()
  }
  const token = await user.generateAuthToken()
  return { user, token }
}

module.exports = {
  passportStrategy,
  passportCallback
}
