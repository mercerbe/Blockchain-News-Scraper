//============================dependencies=====================================//
const db = require('../models')
const axios = require('axios')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')

//=============================scraping routes==================================//
module.exports = app => {

  //get route to scrape website
  app.get('/scrape', (req, res) => {

    //use axios to grab html
    //option to switch to cryptopanic.com
    axios.get("https://www.the-blockchain.com/category/news/").then( response => {

      //load html into  cheerio
      let $ = cheerio.load(response.data)

      //grab news elements
      $("div.td-module-1").each( (i, element) => {

        //object for each result
        let result = {}

        //grab children elements from div
        result.headline = $(this)
          .children("h3")
          .text()
          console.log("headline" + result.headline);
        result.url = $(this)
          .children("a")
          .attr('href')
        result.author = $(this)
          .children(".td-post-author-name")
          .text()
        result.postedAt = $(this)
          .children(".td-post-date")
          .text()

        //for each result, create new Article in DB
        db.Article.create(result)
          .then( dbArticle => {
            console.log(dbArticle)
          })
          .catch( err => {
            return res.json(err)
          })
      })

      //after scrape, send message
      res.send("Scrape Complete!")
    })
  })

}
