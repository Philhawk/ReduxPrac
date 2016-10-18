'use strict';

const express = require('express');
const router = express.Router();
const Book = require('../models/book.js')

router.get('/', (req, res, next) => {
	Book.findAll({ where: req.query })
		.then(books => {
			books.length ? res.json(books) : res.sendStatus(404);
		})
		.catch(next);
});

router.get('/:bookID', (req, res, next) => {
	Book.findById(req.params.bookID)
		.then(book => {
      !book ? res.sendStatus(404) : res.status(200).send(book.dataValues);
		})
		.catch(next);
});

router.post('/', (req, res, next) => {
	Book.create(req.body)
		.then(book => {
			res.status(201).send(book.dataValues);
		})
		.catch(next);
});

router.put('/:bookID', (req, res, next) => {
  Book.findById(req.params.bookID)
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

router.delete('/:bookID', (req, res, next) => {
  Book.findById(req.params.bookID)
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
