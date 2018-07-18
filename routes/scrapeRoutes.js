//============================dependencies=====================================//
const db = require('../models')
const request = require('request')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')

//=============================scraping routes==================================//
module.exports = app => {

  //test cheerio
  app.get('/test', (req, res) => {
    request("https://www.the-blockchain.com/category/news/", (err, response, html) => {
      if(!err) {
        let $ = cheerio.load(html)
        res.send(html)
      }
    })
  })

  //get route to scrape website
  app.get('/scrape', (req, res) => {

    //use request to grab html
    request("https://www.the-blockchain.com/category/news/", (err, res, html) => {
      //load to cheerio
      const $ = cheerio.load(html)
      let scrapedData = []

      //grab all article elements
      $("div.td_module_1").each( function(i, element) {

        //new obj for results
        result = {}

        //add data wanted to object
        result.headline = $(this).find("a").eq( 2 ).text()
        console.log(`--- ${result.headline} ---`);
        result.url = $(this).find("a").eq( 2 ).attr("href")
        console.log(`${result.url}`)
        result.author = $(this).find("a").eq( 3 ).text()
        console.log(`${result.author}`)
        result.postedAt = $(this).find("time").text()
        console.log(`${result.postedAt}`)
        console.log("===========================")

        //Create new article from result obj
        db.Article.create(result)
          .then( dbArticle => {
            console.log(dbArticle)
          })
          .catch( err => {
            console.error("error:", err)
          })
      })
      //if scrape is successful
      console.log("scrape finished...")
    })
    res.redirect('/')
  })

  //grab a single article by id
  app.get('/read/:id', (req, res) => {
    //handlebars object for article
    let hbArticle = {
      //==========data here============//
      article: [],
      body: []
    }
    //find article by id
    db.Article.findOne({ _id: req.params.id })
      //populate associated comments
      .populate("comment")
      .then( (err, dbArticle) => {
        if(err) {
          console.error(err)
        } else {
          hbArticle.article = dbArticle
          let url = dbArticle.url
          //get article from url
          request(url, (error, res, html) => {
            //use cheerio
            $("************").each( (i, element) => {
              hbArticle.body = $(this).find("****element containing text****")
              //render article text/body and populated comments
              res.render('article', hbArticle)
              return false
            })
          })
        }
      })
  })

}
