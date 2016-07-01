var express = require('express');
var load = require('express-load');
var scheduler = require('./app/modules/scheduler');

var app = express();

load('controllers', {cwd: 'app'})
    .then('routes', {cwd: 'app'})
    .into(app);

scheduler.start();

app.listen(8080);
console.log('8080 is the magic port');
