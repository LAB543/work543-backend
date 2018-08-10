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

                var query = "SELECT * FROM `Users` "
                    +"WHERE `username`='"+username+"' "
                    +"AND `password`='"+password+"';";

                dbConnection.query(query, function(err, rows) {
                    if(err) throw err;

                    if(rows.length > 0) {   // login success

                        var payload = { id: rows[0].id };
                        var token = jwt.encode(payload, jwtConfig.jwtSecret);

                        res.json({
                            code: 200,
                            type: req.method,
                            message: "OK",
                            data: {
                                user: {
                                    id: rows[0].id,
                                    username: rows[0].username,
                                    firstName: rows[0].first_name,
                                    lastName: rows[0].last_name,
                                    email:  rows[0].email,
                                    createdAt:  rows[0].created_at,
                                    udpatedAt:  rows[0].updated_at,
                                },
                                token: token
                            }
                        });
                    } else {                // fail to login
                        res.status(400)
                            .send({
                                code: 400,
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
                        message: "Missing parameter"
                    });
            }

        } else {

            // invalid method
            res.status(400)
                .send({
                    code: 400,
                    type: req.method,
                    message: "Invalid method"
                });

        }
    } else if(req.route.path === "/logout") {

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
