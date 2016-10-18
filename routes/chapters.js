const express = require('express');
const router = express.Router();

const Book = require('../models/book.js')
const Chapter = require('../models/chapter.js')


router.get('/:bookId/chapters', (req, res, next) => {
  Chapter.findAll({
    where: {
      bookId: req.params.bookId
    }
  })
    .then(chapters => res.send(chapters))
    .catch(next)
})

/
router.post('/:bookId/chapters', (req, res, next) => {
  Book.findById(req.params.bookId)
    .then(book => {
      return book.createChapter(req.body);
    })
    .then(chapter => res.status(201).send(chapter))
    .catch(next)
});

router.get('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          res.send(chapter);
        } else {
          res.status(404).send()
        }
      } else {
        res.status(404).send();
      }
    })
    .catch(next);
})

router.put('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          chapter.updateAttributes(req.body)
            .then(newlyUpdatedChapter => res.send(newlyUpdatedChapter))
        } else {
          res.status(404).send();
        }
      } else {
        res.status(404).send()
      }
    })
    .catch(next);
})

router.delete('/:bookId/chapters/:chapterId', (req, res, next) => {
  Chapter.findById(req.params.chapterId)
    .then(chapter => {
      if (chapter) {
        if (chapter.bookId === +req.params.bookId) {
          chapter.destroy()
            .then(() => res.status(204).send());
        } else {
          res.status(404).send()
        }
      } else {
        res.status(404).send();
      }
    })
    .catch(next)
})

module.exports = router
