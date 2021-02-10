/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../../src/app')
const User = require('../../src/models/user')
const { userOne, userOneId, populateDatabase } = require('../fixtures/db')

beforeEach(populateDatabase)

test('Should return user datas for logged user', async () => {
  const response = await request(app)
    .get('/me')
    .set('Authorization', `Bearer ${userOne.token}`)
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

test("Should return user's favorites", async () => {
  const res = await request(app)
    .get('/me/favorites')
    .set('Authorization', `Bearer ${userOne.token}`)
    .send()
    .expect(200)

  expect(res.body.length).toBe(1)
})

test("Should update user's favorites", async () => {
  await request(app)
    .patch('/me/favorites')
    .set('Authorization', `Bearer ${userOne.token}`)
    .send([{}, {}])
    .expect(200)

  const user = await User.findById(userOneId)

  expect(user.favorites.length).toBe(2)
})
