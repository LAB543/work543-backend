var express = require('express');
var router = express.Router();

// jwt
var jwt = require('jwt-simple');
var jwtConfig = require('../../secret/jwt_config');

// DB connection
var db      = require('mysql');
var dbConfig = require('../../secret/db_config');
var dbConnection = db.createConnection(dbConfig);

module.exports = function (req, res, next) {

    //console.log(req.query);

    if(req.route.path === "/login") {
        if(req.params !== {}
            && typeof(req.query.username) !== "undefined"
            && req.query.username !== ""
            && typeof(req.query.password) !== "undefined"
            && req.query.password !== "") {

            var query = "SELECT * FROM `Users` "
                +"WHERE `username`='"+req.query.username+"' "
                +"AND `password`='"+req.query.password+"';";

            dbConnection.query(query, function(err, rows) {
                if(err) throw err;

                //console.log('The solution is: ', rows);

                if(rows.length > 0) {   // login success
                    //res.json(rows)

                    var payload = { id: rows[0].id };
                    var token = jwt.encode(payload, jwtConfig.jwtSecret);

                    res.json({token: token});
                } else {                // faile to login
                    res.sendStatus(401);
                }
            });

        } else {
            res.sendStatus(401);
        }
    } else if(req.route.path === "/logout") {
        res.sendStatus(400);
    } else {
        res.sendStatus(400);
    }



};
