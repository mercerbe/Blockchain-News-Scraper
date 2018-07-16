//============================dependencies=====================================//
const db = require('../models')
const axios = require('axios')
const cheerio = require('cheerio')

//=============================scraping routes==================================//
module.exports = app => {

  //get route to scrape website
  app.get('/scrape', (req, res) => {

    //use axios to grab html
    axios.get("https://www.the-blockchain.com/category/news/").then( res => {
      //load html into  cheerio
      let $ = cheerio.load(res.data)

      //grab news elements
      $("div.td_module_1").each( (i, element) => {
        //object for each result
        let result = {}

        //grab children elements from div
        result.headline = $(this)
          .children("")
          .text()
        result.url = $(this)
          .children("")
          .attr('href')
        result.summary = $(this)
          .children("")

        //for each result, create new Article in DB
        db.Article.create(result)
          .then( dbArticle => {
            console.log(dbArticle)
          })
          .catch( err => {
            return res.json(err.message)
          })
      })

      //after scrape, send message
      res.send("Scrape Complete!")
    })
  })

}
