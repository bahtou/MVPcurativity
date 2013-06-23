/*
 * Validate the input as EMAIL
 */

module.exports.validate = function(req, res, next) {
  console.info('\n--------------');
  console.info('validate email');
  console.info('--------------');

  var errors, email = req.body.email || '';
  req.assert('email', 'Email is required').notNull();
  req.assert('email', 'Incorrect Email Format').isEmail();

  errors = req.validationErrors();
  // console.error('errors:', errors);
  if (errors) {
    errors.forEach(function(item, index, array) {
      console.error('Email Error');
      console.error('param:', item.param);
      console.error('msg:', item.msg);
      console.error('input value:', item.value);
    });
    console.info('email validation: fail\n');
    req.flash('errors', errors[0].msg);
    req.flash('email', req.body.email);
    res.redirect('back');
  }
  else {
    console.info('email validation: success');
    return next();
  }
}; // end email validation
