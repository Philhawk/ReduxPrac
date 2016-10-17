var express = require('express');
var routes = require('./routes/routes.js');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/files', express.static(__dirname + '/public/static'));
app.use('/', routes);

module.exports = app;
