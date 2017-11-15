const express = require('express');
const app = express();

const db = require('./database');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));
app.use('/libs/jquery', express.static(__dirname + '/node_modules/jquery'));
app.use('/libs/handlebars', express.static(__dirname + '/node_modules/handlebars'));
app.use('/api', require('./routes/api')(db));

app.listen(port, '127.0.0.1');
