var express = require('express');
var app = express();

app.use(express.static(__dirname + '/static'));

app.listen(3000, '127.0.0.1');
