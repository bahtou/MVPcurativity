var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

  host      : ES.host,
  user      : ES.user,
  password    : ES.password,
  ssl       : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
  EM.server.send({
    from         : ES.sender,
    to           : account.email,
    subject      : 'Password Reset',
    text         : 'something went wrong... :(',
    attachment   : EM.composeEmail(account)
  }, callback );
};

EM.composeEmail = function(acct)
{
  var link = 'http://node-login.braitsch.io/reset-password?e='+acct.email+'&p='+acct.pass;
  var html = "<html><body>";
    html += "Hi "+acct.name+",<br><br>";
    html += "Your username is :: <b>"+acct.user+"</b><br><br>";
    html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
    html += "Cheers,<br>";
    html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
    html += "</body></html>";
  return  [{data:html, alternative:true}];
};
