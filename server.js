// CALL THE PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config')
var path = require('path');

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
app.use(morgan('dev'));

// connect with database
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// API ROUTES
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes)

// MAIN CATCHALL ROUTE
// SEND USERS TO FRONTEND
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
app.listen(config.port);
console.log('Magic happens on port ' + config.port);









// ROUTES
// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
})

// // api endpoint to get user information
// apiRouter.get('/me', function(req, res) {
//   res.send(req.decoded);
// });
