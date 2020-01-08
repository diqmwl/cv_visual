var app = require('../app.js');
var jslib = require('../public/files/assets/js/d3_draw.js');
var express = require('express');
var router = express.Router();
const Influx = require('influxdb-nodejs');
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var mongoose    = require('mongoose');
var Result = require('../models/hongik.js');
mongoose.connect('mongodb://125.140.110.217:27037/config',{useNewUrlParser:true ,useUnifiedTopology: true});


var client;
var calAry = new Array();
var sumAry = new Array();
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
  calAry = [];
  var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
  subclassName(subclass);

  var subclassvalue = '';
  if(company == 'B2B_1'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
  } else if(company == 'B2B_2') {
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_ANALYSIS');
    subclassvalue = subclass + '_Day'
  } else if(company == 'CarSharring'){
    client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
    subclassvalue = subclass + '_Year'
  }
  if(x_value == 'CAR_ID'){
    client.query(subclassvalue)
    .set({format: 'json'})
    .where('time', '2018-01-01 00:00:00', '>=')
    .then((countdata)=> {
        var percent = parseInt(countdata[subclassvalue].length * (rangeslider_value/100))
        if(percent == 0){
            percent = 1;
        }
        client.query(subclassvalue)
        .set({format: 'json', limit: percent})
        .where('time', '2018-01-01 00:00:00', '>=')
        .where(scname, 0, '>')
        .then((data)=> {
          res.send(data[subclassvalue]);
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

//그룹차트 캘린더
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

//차량목록 얻기
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

//첫 차트 그려주기
  router.get('/firstdraw', async function(req, res, next) {
    var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
    sumAry = []
    console.log("토탈 드로우")
       
    MongoClient.connect('mongodb://cschae:cschae@125.140.110.217:27027/', async function(err, db) {
        var dbo = db.db('carssum');
        var dataJson = new Object();
        dbo.stats({}, function(err, result) {
            dataJson.name = result.db;
            dataJson.count = result.objects;
            sumAry.push(dataJson);

        dbo = db.db('elex');
        dataJson = new Object();
        dbo.stats({}, function(err, result) {
            dataJson.name = result.db;
            dataJson.count = result.objects;
            sumAry.push(dataJson);

        dbo = db.db('hanuri');
        dataJson = new Object();
        dbo.stats({}, function(err, result) {
            dataJson.name = result.db;
            dataJson.count = result.objects;
            sumAry.push(dataJson);
            console.log(sumAry)
            res.send(sumAry);
            db.close();
        });
    });
});
})        
});  

//총데이터 도넛으로 그리기
router.get('/donutdraw', async function(req, res, next) {
    var { company, category, subclass, chartType, x_value, y_value, rangeslider_value, calender_start, calender_end, car_ID } = req.query
    sumAry = []
    console.log("도넛드로우")
    if(company == 'B2B_1'){
      client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/미정');
    } else if(company == 'B2B_2') {
      client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/ELEX_Analysis');
    } else if(company == 'CarSharring'){        
      client = new Influx('http://tinyos:tinyos@125.140.110.217:8999/CS_ANALYSIS');
        var options = {
            url: 'http://tinyos:tinyos@125.140.110.217:8999/query?db=CS_ANALYSIS',
            method: 'POST',
            form: {
                q: 'show measurements',
            },
        };
    }
    request.post(options, async function(err,httpResponse,body){
        var myobj = JSON.parse(body)["results"][0]["series"][0]["values"];
        
        var i = 0;
        while( i  < myobj.length){
            if(myobj[i][0].match(/Day/) || myobj[i][0].match(/Detail/) || myobj[i][0].match(/Month/)){
                myobj.splice(i,1)
            }else{
                i++
            }
        }

        for(var i = 0; i < myobj.length; i++){
            await client.query(myobj[i][0])
            .set({format: 'json'})
            .then((countdata)=> {
                console.log(myobj[i][0]+'/'+ countdata[myobj[i][0]].length)
                var dataJson = new Object();
                dataJson.name = myobj[i][0];
                dataJson.count = countdata[myobj[i][0]].length;
                sumAry.push(dataJson);
            }).catch(err => res.send(err));
        }
    res.send(sumAry);
   })
    //curl -GET 'http://tinyos:tinyos@125.140.110.217:8999/query?db=CS_ANALYSIS' --data-urlencode 'q=show measurements'
    
});


//홍익대차량목록 얻기
router.get('/hongikgetcar', async function(req, res, next) {
    var { phonenum } = req.query
    var ary = new Array();
    var ary1 = new Array();
    var ary2 = new Array();
    var ary3 = new Array();
    var ary4 = new Array();


        var data = await Result.find({'PHONE_NUM' : phonenum, "DTC": 'AD'  })

        for(var i = 0 ; i < data.length; i++){
            var dataJson = new Object();
            if(JSON.stringify(data[i]) == '[]'){
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = "0";
                ary1.push(dataJson);
            } else {
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = data[i]['prob'].replace("%","");
                ary1.push(dataJson);
            }
        }

        var data = await Result.find({'PHONE_NUM' : phonenum, "DTC": '9C'  })

        for(var i = 0 ; i < data.length; i++){
            var dataJson = new Object();
            if(JSON.stringify(data[i]) == '[]'){
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = "0";
                ary2.push(dataJson);
            } else {
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = data[i]['prob'].replace("%","");
                ary2.push(dataJson);
            }
        }

        var data = await Result.find({'PHONE_NUM' : phonenum, "DTC": 'BA'  })

        for(var i = 0 ; i < data.length; i++){
            var dataJson = new Object();
            if(JSON.stringify(data[i]) == '[]'){
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = "0";
                ary3.push(dataJson);
            } else {
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = data[i]['prob'].replace("%","");
                ary3.push(dataJson);
            }
        }

        var data = await Result.find({'PHONE_NUM' : phonenum, "DTC": 'E7'  })

        for(var i = 0 ; i < data.length; i++){
            var dataJson = new Object();
            if(JSON.stringify(data[i]) == '[]'){
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = "0";
                ary4.push(dataJson);
            } else {
                dataJson.time = data[i]['time'].slice(0,10);
                dataJson.value = data[i]['prob'].replace("%","");
                ary4.push(dataJson);
            }
        }
        ary.push(ary1)
        ary.push(ary2)
        ary.push(ary3)
        ary.push(ary4)
        console.log(ary[1])
    
    res.send(ary)
 
})

//홍익대차량목록 얻기
router.get('/hongikgetlist', async function(req, res, next) {
    console.log('실행');
    res.send(await Result.distinct("PHONE_NUM"))
})

//최우정 삼표 모니터링
router.get('/monitor', function(req, res, next) {
    var { mapnumber } = req.query
    
    var options = {
        url: 'http://tinyos:tinyos@125.140.110.217:8999/query?pretty=true',
        method: 'POST',
        form: {
            db: 'SAMPYO_MONIT',
            q: 'SELECT * FROM DEPARTARRIV_TIME WHERE LOC_NUM = '+mapnumber,
        },
    };
    request(options, function(error, response, body) {
        res.send(JSON.parse(body)['results'][0]['series']);
    });
});

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
                dataJson.Day = val;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.Day = val;
                dataJson.count = data[subclass+'_'+x_value][0][scname];
                calAry.push(dataJson);
            }
        }).catch(console.error);    
        console.log(calAry)
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
                dataJson.Month = startdate;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.Month = startdate;
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
                dataJson.Year = startdate;
                dataJson.count = "0";
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.Year = startdate;
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
                    dataJson.Year = startdate;
                    for(var i = 0; i < car_ID.length; i++){
                        dataJson['C'+car_ID[i]] = 0;
                    }
                    calAry.push(dataJson);
                } else {
                    dataJson.time = "0";
                    dataJson.Year = startdate;
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
                dataJson.Month = startdate;
                for(var i = 0; i < car_ID.length; i++){
                    dataJson['C'+car_ID[i]] = 0;
                }                
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.Month = startdate;
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
                dataJson.Day = startdate;
                for(var i = 0; i < car_ID.length; i++){
                    dataJson['C'+car_ID[i]] = 0;
                }  
                calAry.push(dataJson);
            } else {
                dataJson.time = "0";
                dataJson.Day = startdate;
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





//curl -G 'http://tinyos:tinyos@125.140.110.217:8999/query?pretty=true' --data-urlencode "db=SAMPYO_MONIT" --data-urlencode "q=SELECT * FROM DEPARTARRIV_TIME WHERE LOC_NUM = 1"