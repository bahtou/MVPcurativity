var SignUp = require('../models').SignUps;

module.exports.insert = function(req, res) {
  console.info('Inserting Email');

  new SignUp({email: req.body.email}).save(function(err) {
    if (err) {
      if (err.code === 11000) {
        console.error('duplicate email entry.  Redirect to success page.');
        return res.redirect('/success');
      } else {
        console.error('Error saving:', err);
        req.flash('email', req.body.email);
        return res.redirect('back');
      }
    } else {
      console.info('Email Saved');
      return res.redirect('/success');
    }
  });

};
