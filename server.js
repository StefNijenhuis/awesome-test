var express = require('express'),
    app = express();
var path = require('path');

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });
app.route('/login')
  .get(function(req, res) {
    res.send('This is the login form!');
  })
  .post(function(req, res) {
    console.log('processing');
    req.send('processing the login form!');
  });

var adminRouter = express.Router();
// Middleware
adminRouter.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
})

adminRouter.param('name', function(req, res, next, name) {
  console.log('Doing some validation shizz on ' + name);
  req.name = name;
  next();
})

// Routes
adminRouter.get('/', function(req, res) {
  res.send('I am the dashboard!')
});

adminRouter.get('/users', function(req, res) {
  res.send('I show all the users!');
});

adminRouter.get('/users/:name', function(req, res) {
  res.send('hello ' + req.name + '!');
});

adminRouter.get('/posts', function(req, res) {
  res.send('I Show all the posts!');
});

app.use('/admin', adminRouter);

app.listen(1337);
console.log('1337 is the magic port!');
