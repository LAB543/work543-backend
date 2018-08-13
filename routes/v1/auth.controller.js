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

    if(req.route.path === "/login") {

        var username = null;
        var password = null;

        if(req.method === "GET" || req.method === "POST") {

            // getting parameters
            if(req.body !== {}
                && typeof(req.body.username) !== "undefined"
                && typeof(req.body.password) !== "undefined") {
                username = req.body.username;
                password = req.body.password;
            } else if(req.params !== {}
                && typeof(req.params.username) !== "undefined"
                && typeof(req.params.password) !== "undefined") {
                username = req.params.username;
                password = req.params.password;
            } else if(req.query !== {}
                && typeof(req.query.username) !== "undefined"
                && typeof(req.query.password) !== "undefined") {
                username = req.query.username;
                password = req.query.password;
            }

            // processing
            if(username !== null && password !== null
                && username !== "" && password !== "") {

                var query = "SELECT "
                    +"`id`, `username`, `email`, "
                    +"`first_name` AS `firstName`, `last_name` AS `lastName`, "
                    +"`created_at` AS `createdAt`, `updated_at` AS `updatedAt` FROM `Users` "
                    +"WHERE `username`='"+username+"' "
                    +"AND `password`=PASSWORD('"+password+"');";

                dbConnection.query(query, function(err, rows) {
                    if (err) {
                        //throw err;
                        console.log(err);
                    }

                    if(rows.length > 0) {   // login success


                        var payload = {
                            id: rows[0].id,
                            username: rows[0].username
                        };
                        var token = jwt.encode(payload, jwtConfig.jwtSecret);

                        // expiration config 변환 필요
                        dbConnection.query(
                            "UPDATE `Users` "
                            +"SET `token` = '"+token+"', "
                            +"`token_expiration` = date_add(now(), interval +3 day) "
                            +"WHERE `Users`.`id` = "+rows[0].id+";",
                            function(err, rows) {
                                return;
                        });

                        res.json({
                            code: 200,
                            type: req.method,
                            message: "OK",
                            data: {
                                user: rows[0],
                                token: token
                            }
                        });
                    } else {                // fail to login
                        res.status(401)
                            .send({
                                code: 401,
                                type: req.method,
                                message: "Invalid username/password supplied"
                            });
                    }
                });

            } else {    // missing parameters
                res.status(400)
                    .send({
                        code: 400,
                        type: req.method,
                        message: "Missing parameter: username, password required"
                    });
            }

        } else {

            // invalid method
            res.status(405)
                .send({
                    code: 405,
                    type: req.method,
                    message: "Invalid method: GET, POST accepted"
                });

        }
    } else if(req.route.path === "/logout") {

        // 토큰 전달
        const token = req.headers['x-access-token'] || req.query.token;

        // 토큰이 없는 경우
        if(!token) {

            return res.status(403).json({
                code: 403,
                type: req.method,
                message: "x-access-token required"
            })

        }

        var decodedToken = jwt.decode(token, jwtConfig.jwtSecret);

        // expiration config 변환 필요
        dbConnection.query(
            "UPDATE `Users` "
            +"SET `token` = '', "
            +"`token_expiration` = date_add(now(), interval -10 second) "
            +"WHERE `Users`.`id` = "+decodedToken.id+";",
            function(err, rows) {
                return;
        });

        // any method supported
        res.status(200)
            .send({
                code: 200,
                type: req.method,
                message: "OK"
            });

    } else {

        // invalid connection
        res.status(400)
            .send({
                code: 200,
                type: req.method,
                message: "Invalid connection"
            });

    }

};
