const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatarUrl: {
    type: String,
    trim: true
  },
  twitchId: {
    type: String,
    required: true,
    trim: true
  },
  favorites: {
    type: Array,
    default: () => []
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
},
{
  timestamps: true
})

userSchema.virtual('ownedLists', {
  ref: 'List',
  localField: '_id',
  foreignField: 'owner'
})

userSchema.virtual('sharedLists', {
  ref: 'List',
  localField: '_id',
  foreignField: 'sharedWith'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' })

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.methods.toJSON = function () {
  const user = this

  const userObject = user.toObject()

  delete userObject.tokens

  return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User
