
const express = require('express');
const bookRoutes = require('./routes/books');
const errorHandlingRoutes = require('./routes/errors');
const chapterRoutes = require('./routes/chapters');
const numberOfVisitsRoutes = require('./routes/numVisits');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'mango pancakes',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', errorHandlingRoutes);

app.use('/files', express.static(`${__dirname}/public/static`));

app.use('/api/numVisits', numberOfVisitsRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/books', chapterRoutes);


app.use((err, req, res, next) => {
  err.message === 'potato' ? res.sendStatus(403) : res.sendStatus(500);
});


module.exports = app;
