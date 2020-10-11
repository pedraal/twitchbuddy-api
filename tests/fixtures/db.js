const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  displayName: 'Pedraal',
  twitchId: '87396080',
  avatarUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/pedraal-profile_image-89d4686eefbc9003-300x300.png',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
}

const populateDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
}

module.exports = {
  userOneId,
  userOne,
  populateDatabase
}
