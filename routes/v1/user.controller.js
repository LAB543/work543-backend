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

    } else if(req.method === 'PUT') {

    } else if(req.method === 'DELETE') {

    } else {

    }

};
