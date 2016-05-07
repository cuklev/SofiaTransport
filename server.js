var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sumcapi = require('./routes/sumcapi');
var dbapi = require('./routes/dbapi');

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/static'));

app.post('/sumcapi/v1/timing', sumcapi.timingHandler);

app.post('/api/stopname', dbapi.stopname);
app.get('/api/lines', dbapi.lines);
app.post('/api/routes', dbapi.routes);
app.post('/api/points', dbapi.points);

app.listen(3000, '127.0.0.1');
