var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/library-dev');
mongoose.connection.on('error', console.error.bind(console, 'database connection error'));

var authorSchema = require('./author');
var bookSchema = require('./book');
var chapterSchema = require('./chapter');

module.exports = {
	Author: mongoose.model('Author', authorSchema),
	Book: mongoose.model('Book', bookSchema),
	Chapter: mongoose.model('Chapter', chapterSchema)
};