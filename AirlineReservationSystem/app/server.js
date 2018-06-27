// server.js

// BASE SETUP
// =============================================================================
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
/////////
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/ARS/api', require('./routes/route'));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);