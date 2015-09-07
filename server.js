// CALL THE PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var User = require('./app/models/user');

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

// MIDDLEWARE
// for all requests
apiRouter.get('/', function(req, res, next) {
  console.log('Somebody just came to our app!');

  // more to come on chapter 10
  // this is where we will authenticate users

  next();
})

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

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);

// connect with database
mongoose.connect('mongodb://localhost:27017/RESTfulAPI_DB');
