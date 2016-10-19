'use strict';

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  // If views exist on the session, increment the number and send the new overall views count
  let sess = req.session
  if (sess.numVisits) {
    sess.numVisits++
    res.send({ number: sess.numVisits - 1 })
  } else {
    // if a new client visits only once, only send back the session numVisits of zero
    sess.numVisits = 1
    res.send({ number: 0 })
  }
})

module.exports = router
