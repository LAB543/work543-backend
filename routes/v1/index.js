var express = require('express');
var router = express.Router();

// jwt
var jwt = require('jwt-simple');
var jwtConfig = require('../../secret/jwt_config');

// DB connection
var db      = require('mysql');
var dbConfig = require('../../secret/db_config');
var dbConnection = db.createConnection(dbConfig);

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
*/

// middle ware
router.use(function(req, res, next) {
    // CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // 무인증 Whitelist
    var whitelist = ["/users", "/user", "/login"];
    var isWhitelist = whitelist.find(function(e) {
        return e == req.url;
    });

    if(isWhitelist !== undefined) {
        return next();
    }

    // 토큰 전달
    const token = req.headers['x-access-token'] || req.query.token;

    // 토큰이 없는 경우
    if(!token) {

        return res.status(403).json({
            code: 403,
            type: req.method,
            message: "Missing token: x-access-token required"
        });

    }

    // 토큰 검증
    try {
        var decodedToken = jwt.decode(token, jwtConfig.jwtSecret);
    } catch(e) {
        console.log(e);
        return res.status(403).json({
            code: 403,
            type: req.method,
            message: "Invalid token"
        });
    }

    if(decodedToken.id === undefined || decodedToken.username === undefined) {
        //
        return res.status(403).json({
            code: 403,
            type: req.method,
            message: "Invalid token"
        });

    }

    var query = "SELECT * FROM `Users` "
        +"WHERE `id`='"+decodedToken.id+"' "
        +"AND `username`='"+decodedToken.username+"' "
        +"AND `token`='"+token+"' "
        +"AND `token_expiration` >= NOW();";

    dbConnection.query(query, function(err, rows) {
        if(rows.length < 1) {
            return res.status(403).json({
                code: 403,
                type: req.method,
                message: "Invalid token: Token not matched or expired"
            });
        } else {
            // expiration datetime update
            dbConnection.query(
                "UPDATE `Users` "
                +"SET `token_expiration` = date_add(now(), interval +3 day) "
                +"WHERE `id`='"+decodedToken.id+"' "
                +"AND `username`='"+decodedToken.username+"' "
                +"AND `token`='"+token+"';");

            next();
        }
    });

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.all('/user', userController);
router.all('/users', userController);
router.all('/user/:username', userController);

router.all('/system', function (req, res, next) {

    return res.status(200).json({
        message: 'permission get'
    })

});

router.all('/login', authController);
router.all('/logout', authController);

module.exports = router;
