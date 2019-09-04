var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');

const Influx = require('influxdb-nodejs');
const client = new Influx('http://cschae:cschae@10.0.1.186:8086/CS_Analysis');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'views')));

app.get('/abc', function(req,res){
   client.query('Quick_start_data_for_2018')
	.set({format: 'csv'})
	.then((data)=> {
	console.log(data.Quick_start_data_for_2018);
	fs.writeFile('./public/test.csv', data.Quick_start_data_for_2018 , 'utf8', function(error){
	    console.log('success');
	});
//	console.info(data.results[0].series[0]);
}).catch(console.error);

console.log("z");

res.send("1");
});
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('500');
});
module.exports = app;
