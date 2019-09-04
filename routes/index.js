var app = require('../app.js');
var express = require('express');
var router = express.Router();
const Influx = require('influxdb-nodejs');
var client = new Influx('http://tinyos:tinyos@10.0.1.186:8086/CS_Analysis');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

router.get('/chartdraw', function(req, res, next) {
  var { company, category, subclass, x_value, y_value } = req.query
  console.log(x_value);

  
  client.query('2018_quick_start_count', 'CS_Analysis')
  .set({format: 'csv'})
  .then((data)=> {
  console.log(data['2018_quick_start_count']);
//  fs.writeFile('./public/test.csv', data.Quick_start_data_for_2018 , 'utf8', function(error){
//      console.log('success');
//  });
//	console.info(data.results[0].series[0]);
  }).catch(console.error);
});

router.get('/abc', function(req,res){

 });
module.exports = router;
