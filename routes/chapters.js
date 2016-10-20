const express = require('express');
const router = express.Router();

const Book = require('../models/book.js')
const Chapter = require('../models/chapter.js')


// GET All chapters from a Books ID
// 1. Find all the chapters, and filter through the bookID that' been passed in
// 2. If chapters exist, send it back
router.get('/:bookId/chapters', (req, res, next) => {
  Chapter.findAll({
    where: {
      bookId: req.params.bookId
    }
  })
    .then(chapters => res.send(chapters))
    .catch(next)
})

// POST a new chapter
// 1. Find the book by its particular ID. If the book exxists, create a new chapter
// with the parameters on the req.body
// 2. Send successfully created status back along with the chapter data
router.post('/:bookId/chapters', (req, res, next) => {
  Book.findById(req.params.bookId)
    .then(book => {
      return book.createChapter(req.body);
    })
    .then(chapter => res.status(201).send(chapter))
    .catch(next)
});

// GET one particular chapter from a Book ID
// 1. Find the chapter by its particular ID. If the chapter exists, create a new chapter
// with the parameters on the req.body
// 2. Send successfully created status back along with the chapter data
router.get('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          res.send(chapter);
        } else {
          res.sendStatus(404)
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next);
})

// UPDATE one particular chapter
// 1. Find the chapter by its particular ID. If the chapter exists, update its
// attributes with the parameters on the req.body
// 2. Send the newly updated chapter

router.put('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          chapter.updateAttributes(req.body)
            .then(newlyUpdatedChapter => res.send(newlyUpdatedChapter))
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next);
})

// DELETE one particular chapter
// 1. Find the chapter by its particular ID. If the chapter exists, delete
// 2. Send the status back AND

router.delete('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          chapter.destroy()
            .then(() => res.sendStatus(204));
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next)
})

module.exports = router
