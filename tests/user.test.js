/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, populateDatabase } = require('./fixtures/db')

beforeEach(populateDatabase)

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      displayName: 'Pierre',
      twitchId: '1234567',
      avatarUrl: userOne.avatarUrl
    })
    .expect(201)

  // assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // assertions about the response
  expect(response.body).toMatchObject({
    user: {
      displayName: 'Pierre',
      twitchId: '1234567',
      avatarUrl: userOne.avatarUrl
    },
    token: user.tokens[0].token
  })
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      twitchId: userOne.twitchId
    })
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.tokens[1].token).toBe(response.body.token)
})
