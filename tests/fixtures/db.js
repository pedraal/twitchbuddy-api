const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const List = require('../../src/models/list')

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const listOneId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  displayName: 'Pedraal1',
  twitchId: '87396080',
  avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png',
  lists: [listOneId],
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

const userTwo = {
  _id: userTwoId,
  displayName: 'Pedraal2',
  twitchId: '87396081',
  lists: [],
  avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
}
const listOne = {
  _id: listOneId,
  name: 'Pedraal1List',
  clips: [{}, {}],
  owners: [userOneId]
}

const populateDatabase = async () => {
  await User.deleteMany()
  await List.deleteMany()
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