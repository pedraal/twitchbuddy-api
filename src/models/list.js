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
    ref: 'User'
  }
},
{
  timestamps: true
})

listSchema.post('init', async function () {

})

const List = mongoose.model('List', listSchema)

module.exports = List
