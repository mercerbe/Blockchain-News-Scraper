//dependencies
const mongoose = require('mongoose')

//Schema Constructor
const Schema = mongoose.Schema

//create article schema
var ArticleSchema = new Schema({

  //title
  headline: {
    type: String,
    required: true
  },
  //link
  url: {
    type: String,
    required: true
  },
  //summary of the article
  author: {
    type: String
  },
  postedAt: {
    type: String
  },
  //comments
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
})

//create model
const Article = mongoose.model('Article', ArticleSchema)

//export Article model
module.exports = Article
