const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  clips: {
    type: Array
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  ]
},
{
  timestamps: true
})

const List = mongoose.model('List', listSchema)

module.exports = List
