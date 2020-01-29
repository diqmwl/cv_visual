var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login_check');
var usersRouter = require('./routes/users');
var fs = require('fs');
var bodyParser = require('body-parser')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var auth = function(req, res, next) {
    console.log("auth"+req.isAuthenticated())
    if(req.isAuthenticated()){
        return next();
    }else{
        console.log('실행')
        res.redirect(401,'/');
    }
};


var app = express();



app.use(bodyParser.urlencoded({
    extended: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');



var USER = {
    name: 'keti',
    password: 'keti1234'
}

app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge : 600000 // one hour in millis
      },
    store: new FileStore()
  }))


var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
 
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(id, done) {
    done(null, USER);
});

  passport.use(new LocalStrategy(
      {
          usernameField: 'name',
          passwordField: 'password'
      },
    function(username, password, done) {
        if(username === USER.name){
        if(password === USER.password){
            console.log("같음")
            return done(null, USER)
        }else{
            return done(null, false)
        }
      }else{
          return done(null, false)
      }
    }
  ));

  app.post('/login_check',
  passport.authenticate('local', {failureRedirect: '/'}),

  (req, res) =>{
      res.render('index');
  }
);

app.get('/', function(req, res, next) {
    console.log("/로옴")
    res.render('login.html');
});

app.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function(){
        res.redirect('/');
    })
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/index', express.static(path.join(__dirname, 'views')));

app.use('/index',auth ,indexRouter);

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