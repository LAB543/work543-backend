var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    return res.redirect(301, '/docs');
});

module.exports = router;
