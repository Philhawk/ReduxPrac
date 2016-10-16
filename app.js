var express = require('express');

var routes = require('./routes/routes.js');
var app = express();

app.use('/files', express.static(__dirname + '/public'));

app.use('/', routes);
//

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

module.exports = app;
