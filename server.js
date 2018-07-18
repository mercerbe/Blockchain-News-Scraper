//===================================Setup======================================//
//app dependencies
require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

//express setup
const app = express()
const PORT = process.env.PORT || 8080

//body parser
const bodyParser = require('body-parser')
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

//db configuration: check for localhost or mlab
let databaseUri = 'mongodb://localhost:27017/BlockNewsDB'
if(process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  mongoose.connect(databaseUri, { useNewUrlParser: true })
}
//connect to Mongo DB via mongoose
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to DB')
})

//==================================Routing=====================================//
require('./routes/scrapeRoutes.js')(app)
require('./routes/viewRoutes.js')(app)

//===================================server listen==============================//
app.listen(PORT, () => {
  console.log("app listening on port:", PORT);
})
