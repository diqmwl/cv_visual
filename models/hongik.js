var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var result = new Schema({
prob: String,
time: String,
PHONE_NUM: String,
DTC: String
});

module.exports=mongoose.model('result', result, 'result');
