//============================dependencies====================================//
const db = require('../models')

//===========================view routes======================================//
module.exports = app => {

//index page
app.get('/', (req, res) => {
  res.redirect('/articles')
})

//get all articles for api
app.get('/api/articles', (req, res) => {
  //sort by newest
  db.Article.find({})
    .sort({_id: -1})
    .then( dbArticles => {
      res.json(dbArticles)
    })
    .catch( err => {
      res.json(err)
      console.error(err)
    })
})

//render articles
app.get('/articles', (req, res) => {
  //sort by newest
  db.Article.find({}).sort({_id: -1})
    //send to exphbs
    .then( (err, data) => {
      if(err) {
        console.error("error:", err)
      } else {
        //handlebars object
        let hbArticle = { article: data }
        res.render('index', hbArticle)
      }
    })
})

//reset articles
app.get('/removeArticles', (req, res) => {
  //remove from db
  Article.remove({}, (err, data) => {
    if(err) {
      console.error(err)
    } else {
      console.log('Articles removed from db')
    }
  })
  res.redirect('/api/articles')
})


//post new comment to an article
app.post('/comments/:id', (req, res) => {
  //data for comment
  let name = req.body.name
  let text = req.body.comment
  let articleId = req.params.id
  //data from form
  let commentHbObj = {
    name: name,
    body: text
  }
  //new comment from model
  var newComment = new Comment(commentHbObj)
  //create comment
  newComment.save( (err, dbComment) => {
    if(err) {
      console.err(err)
    } else {
      console.log(dbComment._id, articleId)
      //update article in db to include new comment
      db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: {'comment':dbComment._id} },
        { new: true })
        .then( (err, data) => {
          if(err) {
            console.error(err)
          } else {
            res.redirect('/read/' + articleId)
          }
        })
    }
  })
})




}
