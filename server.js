const express = require('express');
const app = express();

const sumcapi = require('./routes/sumcapi');
const dbapi = require('./routes/dbapi');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));

app.get('/sumcapi/timing', sumcapi.timingHandler);
app.get('/sumcapi/timetable', sumcapi.timetableHandler);
app.get('/sumcapi/subway/routes', sumcapi.subwayRoutesHandler);
app.get('/sumcapi/subway', sumcapi.subwayTimetableHandler);
app.get('/sumcapi/datetime', sumcapi.datetimeHandler);

app.get('/api/stopname', dbapi.stopname);
app.get('/api/lines', dbapi.lines);
app.get('/api/routes', dbapi.routes);
app.get('/api/points', dbapi.points);

app.listen(port, '127.0.0.1');
