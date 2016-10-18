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
	Book.findAll({ where: req.query })
		.then(books => {
			books.length ? res.json(books) : res.sendStatus(404);
		})
		.catch(next);
});

router.get('/api/books/:id', function(req, res, next){
	Book.findById(req.params.id)
		.then(book => {
      !book ? res.sendStatus(404) : res.status(200).send(book.dataValues);
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

router.put('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        book.updateAttributes(req.body)
          .then(book => res.status(200).send(book))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(next)
})

router.delete('/api/books/:id', (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (book) {
        book.destroy()
          .then(book => res.status(204).send(book))
      } else {
        res.sendStatus(404)
      }
    })
    .catch(next)
})

module.exports = router;
