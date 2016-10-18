'use strict'

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  if (req.session.views) {
    req.session.views++
    res.send({ number: req.session.views - 1 })
  } else {
    req.session.views = 1
    res.send({ number: 0 })
  }
})

module.exports = router
