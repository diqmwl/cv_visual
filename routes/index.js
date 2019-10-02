var app = require('../app.js');
var jslib = require('../views/files/assets/js/d3_draw.js');
var express = require('express');
var router = express.Router();
const Influx = require('influxdb-nodejs');
var client;
var calAry = new Array();
var scname;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

//차트 그리는 함수
router.get('/chartdraw', async function(req, res, next) {
    subclassName(subclass);
  calAry = [];
  var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
  console.log(subclass+'_Year')
  if(company == 'B2B_1'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
  } else if(company == 'B2B_2') {
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
  }
  
  if(x_value == 'CAR_ID'){
    client.query(subclass+'_Year')
    .set({format: 'json'})
    .where('time', '2017-12-31 11:59:59', '<=')
    .then((countdata)=> {
        var percent = parseInt(countdata[subclass+'_Year'].length * (rangeslider_value/100))
        client.query(subclass+'_Year')
        .set({format: 'json', limit: percent})
        .then((data)=> {
          res.send(data[subclass+'_Year']);
        }).catch(console.error);
    }).catch(err => res.send(err));
  } else if(x_value == 'year'){
    //client.query(subclass+'_'+y_value+'Detail')
    var startdate = new Date(calender_start);
    var enddate = new Date(calender_end);
    var datevalue = (enddate.getTime() - startdate.getTime()) / (1000*60*60*24);
    var data;
    startdate.setDate((startdate.getDate()-1))
    for(var i = 0; i <= datevalue; i++){
        startdate.setDate((startdate.getDate()+1))
        data = await date_query(startdate.toISOString().slice(0,10), subclass, y_value, car_ID);
    }
    res.send(data);
  }

});

router.get('/getcarlist', async function(req, res, next) {
    var {company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
    var carAry = new Array();
    if(company == 'B2B_1'){
        client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
      } else if(company == 'B2B_2') {
        client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
      } else if(company == 'CarSharring'){
        client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
      }
      var startdate = new Date(calender_start);
      var enddate = new Date(calender_end);
      client.query(subclass+'_Day')
      .set({format: 'json'})
      .where('time', startdate.toISOString().slice(0,10)+' 00:00:00','>=')
      .where('time', enddate.toISOString().slice(0,10)+' 23:59:59','<=')
      .then((data)=> {
          console.log(data)
        for(var i=0; i<data[subclass+'_Day'].length; i++){
            carAry.push(data[subclass+'_Day'][i]['CAR_ID']);
        }
        res.send(Array.from(new Set(carAry)));
        }).catch(err => res.send(err));
})


module.exports = router;

async function date_query(val,subclass, y_value, car_ID){
    subclassName(subclass);
    await client.query(subclass+'_Day')
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', val+' 00:00:00','>=')
        .where('time', val+' 23:59:59','<=')
        .then((data)=> {
            console.log(scname)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = data[subclass+'_Day'][0][scname];
                calAry.push(dataJson);
            }
        }).catch(console.error);    
    return calAry;
}

function subclassName(val){
    if(val == 'Distance'){
        scname = 'TOTAL_DISTANCE';
    } else {
        scname = 'TOTAL_COUNT';
    }
}