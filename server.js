const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const cache = require('./cache');
cache.setReload(24 * 60 * 60 * 1000); // A day

app.use(express.static(__dirname + '/static'));
app.use('/libs/handlebars', express.static(__dirname + '/node_modules/handlebars'));
app.use('/api', require('./routes/api')());

app.listen(port, '127.0.0.1');
