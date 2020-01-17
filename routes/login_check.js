var app = require('../app.js');
var express = require('express');
var router = express.Router();
var request = function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated())

    if(req.isAuthenticated()){
        return next();
    }else{
        console.log('실행')
        res.redirect('/');
    }
};

module.exports = request;

//curl -G 'http://tinyos:tinyos@125.140.110.217:8999/query?pretty=true' --data-urlencode "db=SAMPYO_MONIT" --data-urlencode "q=SELECT * FROM DEPARTARRIV_TIME WHERE LOC_NUM = 1"