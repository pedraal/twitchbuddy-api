const passport = require('passport')
const TwitchStrategy = require('@d-fischer/passport-twitch').Strategy

const Controller = require('./controllers/twitch_auth')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(new TwitchStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.OAUTH_CB,
  scope: 'user_read'
},
function (accessToken, refreshToken, profile, done) {
  Controller.passportStrategy({ twitchId: profile.id, avatarUrl: profile.profile_image_url, displayName: profile.display_name }, done)
}
))
