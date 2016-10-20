const express = require('express');
const router = express.Router();
const Book = require('../models/book.js')

// GET All
// 1. Find all the books - and if a query string exists, search by the string.
// 2. If books exists, send the json object back, if not - send a status of 404.
router.get('/', (req, res, next) => {
	Book.findAll({ where: req.query })
		.then(books => {
			books.length ? res.json(books) : res.sendStatus(404);
		})
		.catch(next);
});

// GET by ID
// 1. Find a book by its ID that's been been passed in.
// 2. If the book does not exist, send a status of 404
// 3, If the book DOES exist, send a 200 success status with the books dataValues.
router.get('/:bookID', (req, res, next) => {
	Book.findById(req.params.bookID)
		.then(book => {
      !book ? res.sendStatus(404) : res.status(200).send(book);
		})
		.catch(next);
});

//CREATE a book
// 1. Create the book by body content of the request.
// 2. Send a 201 successfully created status along with the books dataValues.
router.post('/', (req, res, next) => {
	Book.create(req.body)
		.then(book => {
			res.status(201).send(book);
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
