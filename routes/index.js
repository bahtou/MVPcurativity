var mid = require('../middleware').middle
  , controllers = require('../controllers')
  , signup = controllers.SignUp;

module.exports = function(app) {

  // Signup splash page
  app.get('/', function(req, res) {
    var errors = req.flash('errors');
    var email = req.flash('email');
    res.render('index', {
      email: email.length !== 0 ? email : '',
      errors: errors.length !== 0 ? errors : ''
    });
  });

  // Signup post
  app.post('/signup', mid.validate, signup.insert);

  // Signup success
  app.get('/success', function(req, res) {
    res.render('success');
  });

};
