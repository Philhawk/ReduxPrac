const express = require('express');
const router = express.Router();
const Book = require('../models/book.js')

router.get('/broken', (req, res, next) => {
  res.sendStatus(500);
})

router.get('/forbidden', (req, res, next) => {
  res.sendStatus(403);
})

module.exports = router;
