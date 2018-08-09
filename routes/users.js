var express = require('express');
var router = express.Router();

/* db connection */
var mysql      = require('mysql');
var dbconfig   = require('../secret/db_config.js');
var connection = mysql.createConnection({
    host     : dbconfig.dbHost,
    user     : dbconfig.dbUser,
    password : dbconfig.dbPass,
    database : dbconfig.dbName
});

/* GET users listing. */
router.get('/', function(req, res, next) {

    connection.query('SELECT * FROM `Users`', function(err, rows) {
        if(err) throw err;

        console.log('The solution is: ', rows);
        res.send(rows);
    });

    //res.send('respond with a resource');
});

module.exports = router;
