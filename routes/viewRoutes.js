//============================dependencies====================================//
const db = require('../models')


//===========================view routes======================================//
module.exports = app => {

//index page
app.get('/', (req, res) => {
  res.render('index')
})




}
