const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books');
const errorHandlingRoutes = require('./routes/errors');
const chapterRoutes = require('./routes/chapters');
const numberOfVisitsRoutes = require('./routes/numVisits');
const session = require('express-session');

const app = express();

// Express Session setup. This allows for tracking of individual user visits on the session.
app.use(session({
  secret: 'mango pancakes',
  resave: false,
  saveUninitialized: true,
}));

// First requires the bodyParser library
app.use(bodyParser.json());

// The extended option allows to choose between parsing the URL-encoded data with the querystring library
app.use(bodyParser.urlencoded({ extended: true }));

// Generic error handler (different to the one below). This covers generic forbidden and broken link cases
app.use('/', errorHandlingRoutes);

// Serves up static files from the static folder on the public route
app.use('/files', express.static(`${__dirname}/public/static`));

app.use('/api/numVisits', numberOfVisitsRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', chapterRoutes);

// I did not like sequelize database errors yelling at me. A fall back error handler allows those occurs to disappear ... quietly
app.use((err, req, res, next) => {
  err.message === 'potato' ? res.sendStatus(403) : res.sendStatus(500);
});

module.exports = app;
