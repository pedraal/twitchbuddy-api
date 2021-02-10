const mongoose = require('mongoose')

const apiTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
},
{
  timestamps: true
})

const ApiToken = mongoose.model('ApiToken', apiTokenSchema)

module.exports = ApiToken
