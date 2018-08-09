var express = require('express');
var router = express.Router();

// apis
var userController = require('./user.controller');
var authController = require('./auth.controller');

/*
var passport = require('passport');
var passportJWT = require('passport-jwt');
var cfg = require('../../secret/jwt_config.js');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    // JWT 비밀키
    secretOrKey: cfg.jwtSecret,
    // 클라이언트에서 서버로 토큰을 전달하는 방식  (header, querystring, body 등이 있다.)
    // header 의 경우 다음과 같이 써야 한다 { key: 'Authorization', value: 'JWT' + 토큰
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

// middle ware
router.use(function(req, res, next) {
    // 인증처리



    next();
});
*/

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.all('/user', userController);
router.all('/users', userController);
router.all('/user/:username', userController);

router.get('/login', authController);
router.get('/logout', authController);

module.exports = router;
