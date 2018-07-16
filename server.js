//===================================Setup======================================//
//app dependencies
require('dotenv').config()
const express = require('express')

//express setup
const app = express()
const PORT = process.env.PORT || 8080

//body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))

//express static routes for semantic and public files
app.use(express.static('public'))
app.use(express.static('semantic'))

//views with handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', './views')

//logging requests with morgan
const logger = require('morgan')
app.use(logger('dev'))

//connect to Mongo DB via mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/BlockNewsDB')

//==================================Routing=====================================//
require('./routes/scrapeRoutes.js')(app)
require('./routes/viewRoutes.js')(app)

//===================================server listen==============================//
app.listen(PORT, () => {
  console.log("app listening on port:", PORT);
})
