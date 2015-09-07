// CALL THE PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

// APP CONFIGURATION
// use body parser so information can be taken from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')  ;
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

// log all requests to the console
app.user(morgan('dev'));

// ROUTES
// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
})

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'Hooray! Welcome to our api!'});
});

// REGISTER OUR ROUTES
// all of the routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
app.listen(port);
console.log('Magic happens on part' + port);
