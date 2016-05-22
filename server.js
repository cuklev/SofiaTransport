var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sumcapi = require('./routes/sumcapi');
var dbapi = require('./routes/dbapi');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/static'));

app.post('/sumcapi/timing', sumcapi.timingHandler);
app.get('/sumcapi/datetime', sumcapi.datetimeHandler);

app.post('/api/stopname', dbapi.stopname);
app.get('/api/lines', dbapi.lines);
app.post('/api/routes', dbapi.routes);
app.post('/api/points', dbapi.points);

app.listen(port, '127.0.0.1');
