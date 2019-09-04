var app = require('../app.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/index', function(req, res, next) {
    res.render('index');
});
router.get('/chartdraw', function(req, res, next) {
  var company = req.query.company
  var category = req.query.category
  var subclass = req.query.subclass 
  console.log(company+category+subclass);
});
module.exports = router;
