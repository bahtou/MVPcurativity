var mid = require('../middleware').middle
  , controllers = require('../controllers')
  , signup = controllers.SignUp;

module.exports = function(app) {

  // signInUp
  app.get('/', function(req, res) {
    res.render('signInUp');
  });

  // login
  app.get('/login', function(req, res) {
    res.render('login');
  });
  app.post('/login', function(req, res) {
    res.render('home');
  });

  // Logout
  // app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // sign Up
  app.get('/signup', function(req, res) {
    res.render('signup');
  });
  app.post('/signup', function(req, res) {
    res.redirect('/login');
  });









  // // Signup splash page
  // app.get('/', function(req, res) {
  //   var errors = req.flash('errors');
  //   var email = req.flash('email');
  //   res.render('index', {
  //     email: email.length !== 0 ? email : '',
  //     errors: errors.length !== 0 ? errors : ''
  //   });
  // });

  // // Signup post
  // app.post('/signup', mid.validate, signup.insert);

  // // Signup success
  // app.get('/success', function(req, res) {
  //   res.render('success');
  // });

};
