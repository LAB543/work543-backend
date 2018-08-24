var express = require('express')
var router = express.Router()

router.get('/', (req, res, next) => {
  return res.redirect(301, '/docs')
})

module.exports = router
