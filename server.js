const cache = require('./cache');
cache.init();

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));
app.use('/libs/handlebars', express.static(__dirname + '/node_modules/handlebars'));
app.use('/api', require('./routes/api')());

const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1');
