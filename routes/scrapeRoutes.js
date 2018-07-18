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
      if (!err) {
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
      $("div.td_module_1").each(function(i, element) {

        //new obj for results
        result = {}

        //add data wanted to object
        result.headline = $(this).find("a").eq(2).text()
        console.log(`--- ${result.headline} ---`);
        result.url = $(this).find("a").eq(2).attr("href")
        console.log(`${result.url}`)
        result.author = $(this).find("a").eq(3).text()
        console.log(`${result.author}`)
        result.postedAt = $(this).find("time").text()
        console.log(`${result.postedAt}`)
        console.log("===========================")

        //push new headline to array
        scrapedData.push(result.headline)

        //Create new article from result obj
        db.Article.create(result)
          .then(dbArticle => {
            console.log(dbArticle)
          })
          .catch(err => {
            console.error("error:", err)
          })
      })
      //if scrape is successful
      console.log("scrape finished...")
    })
    setTimeout( () => {
      res.redirect('/')
    }, 1000)
  })

  //grab a single article by id
  app.get('/articles/:id', (req, res) => {
    //handlebars object for article
    const hbArticle = {
      article: [],
      body: []
    }
    //find article by id
    db.Article.findOne({
        _id: req.params.id
      })
      //populate associated comments
      .populate("comment")
      .exec((err, dbArticle) => {
        if (err) {
          console.error(err)
        } else {
          hbArticle.article = dbArticle
          let url = dbArticle.url
          //get article from url
          request(url, function(err, res, html) {
            //use cheerio
            const $ = cheerio.load(html)
            //get article text
            $("div.td-post-content").each(function(i, element) {
              hbArticle.body = $(this).find("p").text()
              return false
            })
          })
        }
      })
      //render article text/body and populated comments
      setTimeout( () => {
        res.render('article', hbArticle)
      }, 1500)
  })

}
