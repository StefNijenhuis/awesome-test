// CALL THE PACKAGES
var config = require('./config')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + config.port);

// connect with database
mongoose.connect(config.database);

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

// ROUTES
// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
})

// get an instance of the express router
var apiRouter = express.Router();

apiRouter.post('/authenticate', function(req, res) {
  // find user
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {
    if (err) throw err;

    // no user found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // check password match
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found ans password is correct
        // create token
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superDuperSecret, {
          expiresInMinutes: 1440 // 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

// MIDDLEWARE
// for all requests
apiRouter.use('/', function(req, res, next) {

  //check header url or post for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //decode token
  if (token) {
    // verify secret
    jwt.verify(token, superDuperSecret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good save to request for use in other routes
        req.decoded =decoded;
        next();
      }
    });
  } else {
    // in case of no token
    // return HTTP response 403 (access forbidden) and an error message
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({ message: 'Hooray! Welcome to our api!'});
});

// REGISTER OUR ROUTES
// all of the routes will be prefixed with /api
app.use('/api', apiRouter);

// /users routes
apiRouter.route('/users')

  // create a user (accessed at POST http://localhost:8080/api/users)
  .post(function(req, res) {
    // create a new instance of the User model
    var user = new User();

    // set the users information (comes from the request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    // save the user and check for errors
    user.save(function(err) {
      if (err) {
        // duplicate entry
        if (err.code == 11000)
          return res.json({ success: false, message: 'A user with thar username already exists. '});
        else
          return res.send(err);
      }
      res.json({ message: 'User created!' });
    });
  }) // WHY NO ; ?!

  // get all the users (accessed at GET http://localhost:8080/api/users)
  .get(function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);

      //return the users
      res.json(users);
    });
  });

// /users/:user_id routes
apiRouter.route('/users/:user_id')

  // get the user with that id
  // (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      // return that user
      res.json(user);
    })
  })

  // update the user with this id
  // (accessed at PUT http://localhost:8080/api/users/:user_id)
  .put(function(req, res) {

    // use the user model to find the user
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      // update the user info if its new
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;

      // save the user
      user.save(function(err) {
        if (err) res.send(err);

        // return a message
        res.json({ message: 'User updated! '});
      });
    });
  })

  // delete the user with this id
  // (accessed at DELETE http://localhost:8080/api/users/:user_id)
  .delete(function(req, res) {
    User.remove({ _id: req.params.user_id }, function(err, user) {
      if(err) return res.send(err);

      res.json({ message: 'Successfully deleted! '});
    });
  });

// api endpoint to get user information
apiRouter.get('/me', function(req, res) {
  res.send(req.decoded);
});
