/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/user')
const TwitchAuthController = require('../../src/controllers/twitch_auth')
const { userOne, populateDatabase } = require('../fixtures/db')
const jwt = require('jsonwebtoken')

beforeEach(populateDatabase)

test('Should create not existing user', async () => {
  request(app)
  await TwitchAuthController.passportCallback({
    session: {
      passport: {
        user: {
          displayName: 'Test',
          twitchId: '123456',
          avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png'
        }
      }
    }
  }, null)
  const user = await User.findOne({ displayName: 'Test' })
  expect(user).not.toBeNull()
})

test('Should not create existing user', async () => {
  request(app)
  await TwitchAuthController.passportCallback({
    session: {
      passport: {
        user: {
          displayName: userOne.displayName,
          twitchId: userOne.twitchId,
          avatarUrl: userOne.avatarUrl
        }
      }
    }
  }, null)
  const user = await User.find({ twitchId: userOne.twitchId })
  expect(user.length).toBe(1)
})

test('Should log existing user', async () => {
  request(app)
  const { user, token } = await TwitchAuthController.passportCallback({
    session: {
      passport: {
        user: {
          displayName: userOne.displayName,
          twitchId: userOne.twitchId,
          avatarUrl: userOne.avatarUrl
        }
      }
    }
  }, null)
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  expect(decoded._id).toBe(userOne._id.toString())
  expect(user.displayName).toBe(userOne.displayName)
})
