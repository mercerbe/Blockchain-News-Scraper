//dependencies
const mongoose = require('mongoose')

//mongoose schema constructor
const Schema = mongoose.Schema

//create Comment schema
var CommentSchema = new Schema({
  //name of commentor
  name: {
    type: String,
    required: true
  }
  //comment body
  body: {
    type: String,
    required: true
  }
})

//create the model
const Comment = mongoose.model('Comment', CommentSchema)

//export Comment Model
module.exports = Comment
