var express = require('express');
var router = express.Router();
var Book = require('../models/book.js')

router.get('/broken', function(req, res, next){
  res.sendStatus(500);
})

router.get('/forbidden', function(req, res, next){
  res.sendStatus(403);
})

router.get('/api/books', function(req, res, next){
	Book.findAll()
		.then(books => {
			books.length ? res.json(books) : res.sendStatus(404);
		})
		.catch(next);
});

router.post('/api/books', function(req, res, next){
	Book.create(req.body)
		.then(book => {
			res.status(201).send(book.dataValues);
		})
		.catch(next);
});

module.exports = router;
