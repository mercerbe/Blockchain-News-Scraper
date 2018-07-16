//============================dependencies====================================//
const db = require('../models')

//===========================view routes======================================//
module.exports = app => {

//index page
app.get('/', (req, res) => {
  res.redirect('/articles')
})

//get all articles
app.get('/articles', (req, res) => {
  //sort by newest
  db.Article.find({})
    .sort({_id: -1})
    .then( dbArticles => {
      res.json(dbArticles)
    })
    .catch( err => {
      res.json(err)
    })
})

//grab a single article by id
app.get('/articles/:id', (req, res) => {

  db.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then( dbArticle => {
      res.json(dbArticle)
    })
    .catch( err => {
      res.json(err)
    })
})

//post new comment to an article
app.post('/articles/:id', (req, res) => {
  //new comment
  db.Comment.create(req.body)
    .then( newComment => {
      return db.Article.findOneAndUpdate(
        {_id: req.params.id},
        {comment: newComment._id},
        {new: true})
    })
    .then( dbArticle => {
        res.json(dbArticle)
    })
    .catch( err => {
      res.json(err)
    })
})




}
