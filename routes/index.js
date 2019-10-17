var app = require('../app.js');
var jslib = require('../public/files/assets/js/d3_draw.js');
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
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_ANALYSIS');
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
  }
  
  if(x_value == 'CAR_ID'){
    client.query(subclass+'_Year')
    .set({format: 'json'})
    .where('time', '2018-01-01 00:00:00', '>=')
    .then((countdata)=> {
        var percent = parseInt(countdata[subclass+'_Year'].length * (rangeslider_value/100))
        if(percent == 0){
            percent = 1;
        }
        client.query(subclass+'_Year')
        .set({format: 'json', limit: percent})
        .where('time', '2018-01-01 00:00:00', '>=')
        .then((data)=> {
          res.send(data[subclass+'_Year']);
        }).catch(console.error);
    }).catch(err => res.send(err));
  } else {
    //client.query(subclass+'_'+y_value+'Detail')
    
    var startdate = new Date(calender_start);
    var enddate = new Date(calender_end);
    var startenddate = new Date(calender_start);
    var datevalue = (enddate.getTime() - startdate.getTime()) / (1000*60*60*24);

    if(x_value == 'Year'){
        startdate = new Date(startdate.getFullYear()+'-01-01');
        enddate = new Date(enddate.getFullYear()+'-12-31');
        datevalue = enddate.getFullYear() - startdate.getFullYear();
    } else if(x_value == 'Month'){
        startenddate = new Date(startdate.getFullYear(), startdate.getMonth()+1, 0);
        enddate = new Date(enddate.getFullYear(),enddate.getMonth()+1,0);
        datevalue = enddate.getMonth() - startdate.getMonth() ;
    } else{
        datevalue++;
    }
    var data;

    for(var i = 0; i <= datevalue; i++){

        if(x_value == 'Year'){
            startdate.setFullYear((startdate.getFullYear()+1))
            data = await year_query(startdate.toISOString().slice(0,4), startdate.toISOString().slice(0,4), subclass, x_value, car_ID);
        } else if(x_value == 'Month'){
            data = await month_query(startdate.toISOString().slice(0,7), startenddate.toISOString().slice(0,10), subclass, x_value, car_ID);
            startdate.setMonth((startdate.getMonth()+1))
            startenddate = new Date(startdate.getFullYear(), startdate.getMonth()+1, 0);
        } else{
            data = await date_query(startdate.toISOString().slice(0,10), subclass, x_value, car_ID);
            startdate.setDate((startdate.getDate()+1))
        }
    }
    res.send(data);
  }

});

router.get('/groupdraw', async function(req, res, next) {
  subclassName(subclass);
  calAry = [];
  var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
  if(company == 'B2B_1'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
  } else if(company == 'B2B_2') {
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
  }
  
    //client.query(subclass+'_'+y_value+'Detail')
    var startdate = new Date(calender_start);
    var enddate = new Date(calender_end);
    var startenddate = new Date(calender_start);

    var datevalue = (enddate.getTime() - startdate.getTime()) / (1000*60*60*24);

    if(x_value == 'Year'){
        startdate = new Date(startdate.getFullYear()+'-01-01');
        enddate = new Date(enddate.getFullYear()+'-12-31');
        datevalue = enddate.getFullYear() - startdate.getFullYear();
        startdate.setFullYear((startdate.getFullYear()-1))
    } else if(x_value == 'Month'){
        startenddate = new Date(startdate.getFullYear(), startdate.getMonth()+1, 0);
        enddate = new Date(enddate.getFullYear(),enddate.getMonth()+1,0);
        datevalue = enddate.getMonth() - startdate.getMonth() ;
    } else{
        datevalue++;
    }
    var data;
    for(var i = 0; i <= datevalue; i++){
        
        if(x_value == 'Year'){
            startdate.setFullYear((startdate.getFullYear()+1))
            data = await groupyear_query(startdate.toISOString().slice(0,4), startdate.toISOString().slice(0,4), subclass, x_value, car_ID);

        } else if(x_value == 'Month'){
            data = await groupmonth_query(startdate.toISOString().slice(0,7), startenddate.toISOString().slice(0,10), subclass, x_value, car_ID);
            startdate.setMonth((startdate.getMonth()+1))
            startenddate = new Date(startdate.getFullYear(), startdate.getMonth()+1, 0);
        } else{
            data = await groupdate_query(startdate.toISOString().slice(0,10), subclass, x_value, car_ID);
            startdate.setDate((startdate.getDate()+1))
        }
    }
    res.send(data);

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

      if(x_value == 'Year'){
        startdate = new Date(startdate.getFullYear()+'-01-01');
        enddate = new Date(enddate.getFullYear()+'-12-31');
    } else if(x_value == 'Month'){
        startdate = new Date(startdate.getFullYear()+'-'+(startdate.getMonth()+1)+'-01');
        enddate = new Date(enddate.getFullYear(),enddate.getMonth()+1,0);
    }
      client.query(subclass+'_'+x_value)
      .set({format: 'json'})
      .where('time', startdate.toISOString().slice(0,10)+' 00:00:00','>=')
      .where('time', enddate.toISOString().slice(0,10)+' 23:59:59','<=')
      .then((data)=> {
          console.log(data)
        for(var i=0; i<data[subclass+'_'+x_value].length; i++){
            carAry.push(data[subclass+'_'+x_value][i]['CAR_ID']);
        }
        res.send(Array.from(new Set(carAry)));
        }).catch(err => res.send(err));
})


module.exports = router;

async function date_query(val,subclass, x_value, car_ID){
    subclassName(subclass);
    await client.query(subclass+'_'+x_value)
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', val+' 00:00:00','>=')
        .where('time', val+' 23:59:59','<=')
        .then((data)=> {
            console.log(data)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = val;
                dataJson.count = data[subclass+'_'+x_value][0][scname];
                calAry.push(dataJson);
            }
        }).catch(console.error);    
    return calAry;
}

async function month_query(startdate, enddate,subclass, x_value, car_ID){
    subclassName(subclass);

    await client.query(subclass+'_'+x_value)
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', startdate+'-01 00:00:00','>=')
        .where('time', enddate+' 23:59:59','<=')
        .then((data)=> {
            console.log(data)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = startdate;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = startdate;
                dataJson.count = data[subclass+'_'+x_value][0][scname];
                calAry.push(dataJson);
            }
        }).catch(console.error);    
    return calAry;
}

async function year_query(startdate, enddate,subclass, x_value, car_ID){
    subclassName(subclass);
    await client.query(subclass+'_'+x_value)
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', startdate+'-01-01 00:00:00','>=')
        .where('time', enddate+'-12-31 23:59:59','<=')
        .then((data)=> {
            console.log(data)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = startdate;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = startdate;
                dataJson.count = data[subclass+'_'+x_value][0][scname];
                calAry.push(dataJson);
            }
        }).catch(console.error);    
    return calAry;
}

async function groupyear_query(startdate, enddate,subclass, x_value, car_ID){
    subclassName(subclass);
        await client.query(subclass+'_'+x_value)
        .set({format: 'json'})
            .where('CAR_ID', car_ID)
            .where('time', startdate+'-01-01 00:00:00','>=')
            .where('time', enddate+'-12-31 23:59:59','<=')
            .then((data)=> {                    
                console.log(data);
                var dataJson = new Object();
                if(JSON.stringify(data) == '{}'){
                    dataJson.time = "0";
                    dataJson.date = startdate;
                    for(var i = 0; i < car_ID.length; i++){
                        dataJson['C'+car_ID[i]] = 0;
                    }
                    calAry.push(dataJson);
                } else {
                    dataJson.time = "0";
                    dataJson.date = startdate;
                    for(var i = 0; i < data[subclass+'_'+x_value].length; i++){
                        dataJson['C'+car_ID[i]] = data[subclass+'_'+x_value][i][scname];
                    }
                    calAry.push(dataJson);
                }
            }).catch(console.error);    
            console.log(calAry)
    return calAry;
}

async function groupmonth_query(startdate, enddate,subclass, x_value, car_ID){
    subclassName(subclass);
    await client.query(subclass+'_'+x_value)
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', startdate+'-01 00:00:00','>=')
        .where('time', enddate+' 23:59:59','<=')
        .then((data)=> {
            console.log(data)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = startdate;
                for(var i = 0; i < car_ID.length; i++){
                    dataJson['C'+car_ID[i]] = 0;
                }                
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = startdate;
                for(var i = 0; i < data[subclass+'_'+x_value].length; i++){
                    dataJson['C'+car_ID[i]] = data[subclass+'_'+x_value][i][scname];
                }
                calAry.push(dataJson);
            }
        }).catch(console.error);  
        console.log(calAry)  
    return calAry;
}

async function groupdate_query(startdate,subclass, x_value, car_ID){
    subclassName(subclass);
    await client.query(subclass+'_'+x_value)
    .set({format: 'json'})
        .where('CAR_ID', car_ID)
        .where('time', startdate+' 00:00:00','>=')
        .where('time', startdate+' 23:59:59','<=')
        .then((data)=> {
            console.log(data)
            var dataJson = new Object();
            if(JSON.stringify(data) == '{}'){
                dataJson.time = "0";
                dataJson.date = startdate;
                for(var i = 0; i < car_ID.length; i++){
                    dataJson['C'+car_ID[i]] = 0;
                }  
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.date = startdate;
                for(var i = 0; i < car_ID.length; i++){
                    try{
                        dataJson['C'+car_ID[i]] = data[subclass+'_'+x_value][i][scname];
                    } catch (e){
                        dataJson['C'+car_ID[i]] = 0;
                    }
                    
                }
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