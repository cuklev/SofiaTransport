var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sumcapi = require('./routes/sumcapi');

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/static'));

app.post('/sumcapi/v1/timing', sumcapi.timingHandler);

app.listen(3000, '127.0.0.1');