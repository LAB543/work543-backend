var express = require('express');
var router = express.Router();

// DB connection
var db      = require('mysql');
var dbConfig = require('../../secret/db_config');
var dbConnection = db.createConnection(dbConfig);

module.exports = function (req, res, next) {

    console.log(req.method);

    if(req.method === 'GET') {

        console.log(req.params);

        var query = "SELECT * FROM `Users`";

        if(req.params !== {} && typeof(req.params.username) !== "undefined") {
            query += " WHERE `username`='"+req.params.username+"';";
        }

        console.log(query);

        dbConnection.query(query, function(err, rows) {
            if(err) throw err;

            //console.log('The solution is: ', rows);
            //res.send(rows);
            res.json(rows)
        });

    } else if(req.method === 'POST') {

        // user creation
        username = req.body !== {} && req.body.username ? req.body.username : null;
        password = req.body !== {} && req.body.password ? req.body.password : null;
        firstName = req.body !== {} && req.body.firstName ? req.body.firstName : null;
        lastName = req.body !== {} && req.body.lastName ? req.body.lastName : null;
        email = req.email !== {} && req.body.email ? req.body.email : null;

        if( username !== null
            && password !== null
            && firstName !== null
            && lastName !== null
            && email !== null) {

            var query = "INSERT INTO `Users` (`username`, `password`, `email`, `first_name`, `last_name`, `updated_at`, `created_at`) VALUES "
                +"('"+username+"', PASSWORD('"+password+"'), '"+email+"', '"+firstName+"', '"+lastName+"', NOW(), NOW());;";

            dbConnection.query(query, function(err, rows) {
                if (err) throw err;
                res.status(200)
                    .send({message: "OK"});
            });
        } else {
            res.status(401)
                .send({message: "Missing parameter"});
        }


    } else if(req.method === 'PUT') {

    } else if(req.method === 'DELETE') {

    } else {

    }

};
