const express = require('express');
const app = express();

const sumcapi = require('./routes/sumcapi');
const dbapi = require('./routes/dbapi');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));
app.use('/libs/jquery', express.static(__dirname + '/node_modules/jquery'));
app.use('/libs/handlebars', express.static(__dirname + '/node_modules/handlebars'));

app.get('/api/timing', sumcapi.timingHandler);
app.get('/api/timetable', sumcapi.timetableHandler);
app.get('/api/subway/routes', sumcapi.subwayRoutesHandler);
app.get('/api/subway', sumcapi.subwayTimetableHandler);
app.get('/api/datetime', sumcapi.datetimeHandler);

app.get('/api/stopname', dbapi.stopname);
app.get('/api/lines', dbapi.lines);
app.get('/api/routes', dbapi.routes);
app.get('/api/points', dbapi.points);

app.listen(port, '127.0.0.1');
