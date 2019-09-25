var app = require('../app.js');
var jslib = require('../views/files/assets/js/d3_draw.js');
var express = require('express');
var router = express.Router();
const Influx = require('influxdb-nodejs');
var client;
var calAry = new Array();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

//차트 그리는 함수
router.get('/chartdraw', async function(req, res, next) {
  calAry = [];
  var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end } = req.query
  console.log(subclass+'_'+y_value+'Detail')
  if(company == 'B2B_1'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
  } else if(company == 'B2B_2') {
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/Analysis');
  }
  
  if(x_value == 'CAR_ID'){
    client.query(subclass+'_'+y_value)
    .addFunction('count(CAR_ID)')
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
    //client.query(subclass+'_'+y_value+'Detail')
    var startdate = new Date(calender_start);
    var enddate = new Date(calender_end);
    var datevalue = (enddate.getTime() - startdate.getTime()) / (1000*60*60*24);
    startdate.setDate((startdate.getDate()-1))
    var data;
    for(var i = 0; i <= datevalue; i++){
        startdate.setDate((startdate.getDate()+1))
        data = await date_query(startdate.toISOString().slice(0,10));
    }
    res.send(data);
  }

});

module.exports = router;

async function date_query(val){
    //console.log(val)
    await client.query('Decel_CountDetail')
    .addFunction('count(CAR_ID)')
    .set({format: 'json'})
        .where('CAR_ID', '1365')
        .where('time', val+' 00:00:00','>=')
        .where('time', val+' 23:59:59','<=')
        .then((data)=> {
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = data['Decel_CountDetail'][0]['count']/2;
                calAry.push(dataJson);
            }
        }).catch(console.error);    
    return calAry;
}