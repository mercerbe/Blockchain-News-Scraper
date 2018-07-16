//dependencies
const mongoose = require('mongoose')

//Schema Constructor
const Schema = mongoose.Schema

//create article schema 
var ArticleSchema = new Schema({

  //title
  headline: {

  },
  //link
  url: {

  },
  //summary of the article
  summary: {

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
