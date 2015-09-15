var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// secret for creating tokens
var superDuperSecret = config.secret;

module.exports = function(app, express) {

  var apiRouter = express.Router();

  // route to authenticate a user (POST http://localhost:8080/api/authenticate)
  apiRouter.post('/authenticate', function(req, res) {
    console.log(req.body.username);

    // find the user
    // select the password explicitly since mongoose is not returning it by default
    User.findOne({
      username: req.body.username
    }).select('password').exec(function(err, user) {

      if(err) throw err;

      // no user with that username was found
      if (!user) {
        res.join({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, superDuperSecret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.join({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    });
  });

  // route middleware to verify a token
  apiRouter.use(function(req, res, next) {
    // do logging
    console.log('Somebody just came to our app!');

    // check header or url or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-acess-token'];

    // decode token
    if (token) {

      // verifies secret and check exp
      jwt.verify(token, superDuperSecret, function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token '});
        } else {
          // if everythign is good, save to request for use in other routes
          req.decoded = decoded;

          next(); // make sure we go to the next routes and don't stop here
        }
      });
    } else {

      // if there is no token
      // return an HTTP response of 403 (access forbidden) and an error message
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  // test route to make sure everything is working
  // accessed at GET htpp://localhost:8080/api
  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our api! '});
  });

  // on routes that end in /users
  apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8080/users)
    .post(function(req, res) {

      var user = new User(); //create a new instance of the User model
      user.name = req.body.name; // set the name (comes from the request)
      user.username = req.body.username; // set the users username (comes form the request)
      user.password = req.body.password; // set the users password (comes from the request)

      user.save(function(err) {
        if (err) res.send(err);

        // return a message
        res.json({ message: 'User created!' });
      });
    });

  // on routes that end in /users/:user_id
  apiRouter.route('/users/:user_id')

    // get the user with that id
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return that user
        res.json(user);
      });
    })

    // update the user with this id
    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'user updated!'});
        });
      });
    })

    // delete the user with this id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted' });
      });
    });

  // api endpoint to get user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;
};
