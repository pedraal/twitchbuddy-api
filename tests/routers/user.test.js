/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/user')
const { userOne, populateDatabase } = require('../fixtures/db')

beforeEach(populateDatabase)

test('Should return user datas for logged user', async () => {
  const response = await request(app)
    .get('/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(response.body._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    displayName: userOne.displayName,
    twitchId: userOne.twitchId,
    avatarUrl: userOne.avatarUrl
  })
})

test('Should not return user datas for guest user', async () => {
  const response = await request(app)
    .get('/me')
    .expect(401)
  expect(response.body.user).not.toBeDefined()
})

test('Should logout user', async () => {
  await request(app)
    .get('/logout')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findOne({ twitchId: userOne.twitchId })
  expect(user.tokens.length).toBe(0)
})

test('Should logout user from all devices', async () => {
  let user = await User.findOne({ twitchId: userOne.twitchId })
  await user.generateAuthToken()
  await user.generateAuthToken()

  await request(app)
    .get('/logoutall')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  user = await User.findOne({ twitchId: userOne.twitchId })
  expect(user.tokens.length).toBe(0)
})
