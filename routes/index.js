var app = require('../app.js');
var jslib = require('../views/files/assets/js/d3_draw.js');
var express = require('express');
var router = express.Router();
const Influx = require('influxdb-nodejs');
var client;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

//차트 그리는 함수
router.get('/chartdraw', function(req, res, next) {
  var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end } = req.query
  console.log(x_value + y_value)
  if(company == 'B2B_1'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
  } else if(company == 'B2B_2') {
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/Analysis');
  }
  
  if(x_value == 'carID'){
    client.query(subclass+'_'+y_value)
    .addFunction('count(carid)')
    .set({format: 'json'})
    .then((countdata)=> {
        var percent = parseInt(countdata[subclass+'_'+y_value][0]['count'] * (rangeslider_value/100))
        client.query(subclass+'_'+y_value)
        .set({format: 'json', limit: percent})
        .then((data)=> {
          res.send(data[subclass+'_'+y_value]);
        }).catch(console.error);
    }).catch(err => res.send(err));
  } else if(x_value == 'year'){
      console.log('zzzzz');
  }

});

module.exports = router;

function chartselect(company, category, subclass, chartType, x_value, y_value){
   

    return dbdata;
}