/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../../src/app')
const List = require('../../src/models/list')
const User = require('../../src/models/user')
const { userOne, populateDatabase, listOneId, userOneId, userTwo, userTwoId } = require('../fixtures/db')

beforeEach(populateDatabase)

test('Should return owned lists for logged owner user', async () => {
  const response = await request(app)
    .get('/lists')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toBe(1)
})

test('Should not return lists for guest user', async () => {
  const response = await request(app)
    .get('/lists')
    .send()
    .expect(401)

  expect(response.body.error).toBeDefined()
})

test('Should not return lists for not owner user', async () => {
  const response = await request(app)
    .get('/lists')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)
  expect(response.body.length).toBe(0)
})

test('Should create list for logged user', async () => {
  const newList = { name: 'List from tests', clips: [{}, {}, {}] }
  const response = await request(app)
    .post('/lists')
    .send(newList)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(201)

  expect(response.body).toMatchObject(newList)

  const lists = await List.find()
  expect(lists.length).toBe(2)

  const list = await List.findOne({ name: 'List from tests' })
  expect(list.owner).toStrictEqual(userOneId)

  const user = await User.findById(userOneId).populate('ownedLists').exec()
  expect(user.ownedLists.length).toBe(2)
})

test('Should not create list for guest user', async () => {
  const newList = { name: 'List from tests', clips: [{}, {}, {}] }
  const response = await request(app)
    .post('/lists')
    .send(newList)
    .expect(401)

  expect(response.body.error).toBeDefined()
})

test('Should update owned list', async () => {
  const newList = { name: 'Updated list from tests' }
  const response = await request(app)
    .patch(`/lists/${listOneId}`)
    .send(newList)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.name).toStrictEqual('Updated list from tests')

  const list = await List.findOne()

  expect(list.name).toStrictEqual(newList.name)
})

test('Should not update owned list with invalid fields', async () => {
  const newList = { notAField: true }
  await request(app)
    .patch(`/lists/${listOneId}`)
    .send(newList)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400)

  const list = await List.findOne()
  expect(list.notAField).not.toBeDefined()
})

test('Should share list with another user', async () => {
  await request(app)
    .patch(`/lists/${listOneId}/share`)
    .send({ username: userTwo.displayName })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  const list = await List.findById(listOneId)
  expect(list.sharedWith.includes(userTwoId)).toBe(true)
})

test('Should not share list not owned', async () => {
  await request(app)
    .patch(`/lists/${listOneId}/share`)
    .send({ username: userOne.displayName })
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(403)
})

test('Should return shared lists for logged user', async () => {
  await request(app)
    .patch(`/lists/${listOneId}/share`)
    .send({ username: userTwo.displayName })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)

  const response = await request(app)
    .get('/lists/shared')
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200)

  expect(response.body.length).toBe(1)
})
