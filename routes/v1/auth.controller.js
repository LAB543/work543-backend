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

    console.log(req.body);

    if(req.route.path === "/login") {

        var username = null;
        var password = null;

        if(req.method === "GET") {
            username = req.query !== {} && req.query.username ? req.query.username : null;
            password = req.query !== {} && req.query.password ? req.query.password : null;
        } else if(req.method === "POST") {
            username = req.body !== {} && req.body.username ? req.body.username : null;
            password = req.body !== {} && req.body.password ? req.body.password : null;
        } else {
            console.log("500: Wrong method");
            res.status(500)
                .send({message: "Wrong method"});

            return;
        }

        if(username !== null && password !== null) {

            var query = "SELECT * FROM `Users` "
                +"WHERE `username`='"+username+"' "
                +"AND `password`='"+password+"';";

            dbConnection.query(query, function(err, rows) {
                if(err) throw err;

                //console.log('The solution is: ', rows);

                if(rows.length > 0) {   // login success
                    //res.json(rows)

                    var payload = { id: rows[0].id };
                    var token = jwt.encode(payload, jwtConfig.jwtSecret);

                    res.json({
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
                    });
                } else {                // fail to login
                    console.log("401: Unauthorization");
                    res.status(401)
                        .send({message: "Unauthorization"});
                }
            });

        } else {
            console.log("401: Missing parameter");
            res.status(401)
                .send({message: "Missing parameter"});
        }
    } else if(req.route.path === "/logout") {
        console.log("500: temp");
        res.status(500)
            .send({message: "Temp"});
    } else {
        console.log("500: Unexpected connection");
        res.status(500)
            .send({message: "Unexpected connection"});
    }



};
