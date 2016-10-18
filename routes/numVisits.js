const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  // If views exist on the session, increment the number and send the new overall views count
  let sess = req.session
  if (sess.views) {
    sess.views++
    res.send({ number: sess.views - 1 })
  } else {
    // if a new client visits only once, only send back the session views of zero
    sess.views = 1
    res.send({ number: 0 })
  }
})

module.exports = router
