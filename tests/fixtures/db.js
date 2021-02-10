const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const List = require('../../src/models/list')
const ApiToken = require('../../src/models/api_token')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const listOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  displayName: 'Pedraal1',
  twitchId: '87396080',
  avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png',
  favorites: [{}],
  token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
}

const userTwo = {
  _id: userTwoId,
  displayName: 'Pedraal2',
  twitchId: '87396081',
  avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png',
  favorites: [],
  token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
}
const listOne = {
  _id: listOneId,
  name: 'Pedraal1List',
  clips: [{ name: 'Clip 1' }, { name: 'Clip 2' }],
  owner: userOneId,
  sharedWith: []
}

const populateDatabase = async () => {
  await User.deleteMany()
  await List.deleteMany()
  await ApiToken.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new List(listOne).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  listOneId,
  listOne,
  populateDatabase
}
