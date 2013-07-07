var mid = require('../middleware').middle
  , AM = require('../modules/account-manager')
  , EM = require('../modules/email-dispatcher')
  , controllers = require('../controllers')
  , home = controllers.Home
  , login = controllers.Login
  , signup = controllers.Signup;

module.exports = function(app) {

  // main login
  app.get('/', function(req, res) {
    // check if the user's credentials are saved in a cookie//
    if (req.cookies.user === undefined || req.cookies.pass === undefined) {
      res.render('login', {
        title: 'Hello - Please Login To Your Account'
      });
    } else {
      // attempt automatic login //
      AM.autoLogin(req.cookies.user, req.cookies.pass, function(user) {
        if (user !== null) {
          req.session.user = user;
          res.redirect('/home');
        } else {
          res.render('login', {
            title: 'Hello - Please Login To Your Account'
          });
        }
      });
    }
  });

  // post login
  app.post('/', function(req, res) {
    AM.manualLogin(req.param('username'), req.param('pass'), function(err, o) {
      if (!o) {
        res.send(err, 400);
      } else {
        req.session.user = o;
      if (req.param('remember-me') == 'true') {
        res.cookie('user', o.username, {signed: true, httpOnly: true, path: '/'});
        res.cookie('pass', o.password, {signed: true, httpOnly: true, path: '/'});
      }
      res.send(o, 200);
      }
    });
  });

  // logged-in user homepage //
  app.get('/home', function(req, res) {
    if (req.session.user === null){
    // if user is not logged-in redirect back to login page //
      res.redirect('/');
    } else {
      res.render('home', {
        title : 'Control Panel',
        countries : CT,
        udata : req.session.user
      });
    }
  });

  app.post('/home', function(req, res){
    if (req.param('username') !== undefined) {
      AM.updateAccount({
        username    : req.param('username'),
        name    : req.param('name'),
        email     : req.param('email'),
        country   : req.param('country'),
        pass    : req.param('pass')
      }, function(err, o) {
        if (err) {
          res.send('error-updating-account', 400);
        } else {
          req.session.user = o;
      // update the user's login cookies if they exists //
          if (req.cookies.user !== undefined && req.cookies.pass !== undefined) {
            res.cookie('user', o.username, {signed: true, httpOnly: true, path: '/'});
            res.cookie('pass', o.password, {signed: true, httpOnly: true, path: '/'});
          }
          res.send('ok', 200);
        }
      });
    } else if (req.param('logout') == 'true') {
      res.clearCookie('user');
      res.clearCookie('pass');
      req.session.destroy(function(e) { res.send('ok', 200); });
    }
  });

  // creating new accounts //
  app.get('/signup', function(req, res) {
    res.render('signup', {  title: 'Signup', countries : CT });
  });

  app.post('/signup', function(req, res) {
    AM.addNewAccount({
      name  : req.param('name'),
      email   : req.param('email'),
      username  : req.param('username'),
      pass  : req.param('pass'),
      country : req.param('country')
    }, function(err) {
      if (err) {
        res.send(err, 400);
      } else {
        res.send('ok', 200);
      }
    });
  });

  // password reset //
  app.post('/lost-password', function(req, res) {
    // look up the user's account via their email //
      AM.getAccountByEmail(req.param('email'), function(user) {
        if (user) {
          res.send('ok', 200);
          EM.dispatchResetPasswordLink(user, function(err, m) {
          // this callback takes a moment to return //
          // should add an ajax loader to give user feedback //
            if (!err) {
              res.send('ok', 200);
            } else {
              res.send('email-server-error', 400);
              for (var k in err) console.log('error : ', k, err[k]);
            }
          });
        } else {
          res.send('email-not-found', 400);
        }
      });
  });

  app.get('/reset-password', function(req, res) {
    var email = req.query["e"];
    var passH = req.query["p"];
    AM.validateResetLink(email, passH, function(err){
      if (err != 'ok'){
        res.redirect('/');
      } else {
        // save the user's email in a session instead of sending to the client //
        req.session.reset = { email:email, passHash: passH };
        res.render('reset', { title : 'Reset Password' });
      }
    });
  });

  app.post('/reset-password', function(req, res) {
    var nPass = req.param('pass');
    // retrieve the user's email from the session to lookup their account and reset password
    var email = req.session.reset.email;
    // destory the session immediately after retrieving the stored email //
    req.session.destroy();
    AM.updatePassword(email, nPass, function(err, o) {
      if (o) {
        res.send('ok', 200);
      } else {
        res.send('unable to update password', 400);
      }
    });
  });

  // view & delete accounts //
  app.get('/print', function(req, res) {
    AM.getAllRecords( function(err, accounts) {
      //TODO: take care of error
      res.render('print', { title : 'Account List', accts : accounts });
    });
  });

  app.post('/delete', function(req, res) {
    AM.deleteAccount(req.body.id, function(err, obj) {
      if (!err) {
        res.clearCookie('user');
        res.clearCookie('pass');
              req.session.destroy(function(err) {
                res.send('ok', 200);
              });
      } else {
        res.send('record not found', 400);
      }
    });
  });

  app.get('/reset', function(req, res) {
    AM.delAllRecords(function(){
      res.redirect('/print'); 
    });
  });

  app.get('*', function(req, res) {
    res.render('404',
      { title: 'Page Not Found'});
  });

};




  // // login
  // app.get('/login', function(req, res) {
  //   res.render('login');
  // });
  // app.post('/login', function(req, res) {
  //   res.render('home');
  // });

  // // Logout
  // // app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // // sign Up
  // app.get('/signup', function(req, res) {
  //   res.render('signup');
  // });
  // app.post('/signup', function(req, res) {
  //   res.redirect('/login');
  // });









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

