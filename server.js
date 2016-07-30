const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const sumcapi = require('./routes/sumcapi');
const dbapi = require('./routes/dbapi');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/static'));

app.post('/sumcapi/timing', sumcapi.timingHandler);
app.get('/sumcapi/datetime', sumcapi.datetimeHandler);

app.post('/api/stopname', dbapi.stopname);
app.get('/api/lines', dbapi.lines);
app.post('/api/routes', dbapi.routes);
app.post('/api/points', dbapi.points);

app.listen(port, '127.0.0.1');
