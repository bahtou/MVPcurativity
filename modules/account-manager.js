var crypto    = require('crypto')
  , moment    = require('moment')
  , Accounts = require('../models').Accounts
  , Passwords = require('../models').Passwords;

/* login validation methods */
exports.autoLogin = function(user, pass, callback)
{
  Passwords.findOne({username:user}, function(err, user) {
    if (user) {
      user.password == pass ? callback(user) : callback(null);
    } else {
      callback(null);
    }
  });
};

exports.manualLogin = function(user, pass, callback)
{
  Passwords.findOne({username:user}, function(err, user) {
    if (user === null) {
      callback('user-not-found');
    } else {
      validatePassword(pass, user.password, function(err, valid) {
        if (valid) {
          callback(null, user);
        } else {
          callback('invalid-password');
        }
      });
    }
  });
};

/* record insertion, update & deletion methods */
exports.addNewAccount = function(newData, callback)
{
  Accounts.findOne({username: newData.username}, function(err, acct) {
    if (acct) {
      callback('username-taken');
    } else {
      Accounts.findOne({email: newData.email}, function(err, acct) {
        if (acct) {
          callback('email-taken');
        } else {
          var newAcct = new Account({
            name: newData.name,
            username: newData.username,
            email: newData.email,
            country: newData.country
          });
          newAcct.save(function(err) {
            if (err) res.send(err, 400);
            // salt/hash and save password
            saltAndHash(newData.pass, function(hash) {
              var newPass = new Passwords({
                username: newData.username,
                password: hash
              });
              newPass.save(callback);
            });
          });
        }
      });
    }
  });
};

// startHere
// NOTE: this needs to be tested
exports.updateAccount = function(newData, callback)
{
  var upAcct = {
      name: newData.name,
      email: newData.email,
      country: newData.country
    };
  Accounts.update({username: newData.username}, upAcct, function(err, num) {
    // TODO: err & num should point to different conclusions
    if (err) return callback(err);
    if (newData.pass !== '') {
      saltAndHash(newData.pass, function(hash) {
        Passwords.update({username: newData.username}, {password: hash}, function( err, num) {
          callback(err, {user: newData.username, pass: hash});
        });
      });
    } else {
      Passwords.findOne({username: newData.username}, function(err, user) {
        return callback(err, user);
      });
    }
  });
};

// NOTE: pay attention to the callback(err, num)
exports.updatePassword = function(email, newPass, callback)
{
  Accounts.findOne({email: email}, function(err, user) {
    if (err) {
      callback(err, null);
    } else {
      saltAndHash(newPass, function(hash) {
            // user.pass = hash;
            Passwords.update({username: user.username}, {password: hash}, callback);
      });
    }
  });
};

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
  accounts.remove({_id: getObjectId(id)}, callback);
};

exports.getAccountByEmail = function(email, callback)
{
  accounts.findOne({email:email}, function(e, o){ callback(o); });
};

// NOTE: must test '!user'
exports.validateResetLink = function(email, passHash, callback)
{
  Accounts.findOne({email: email}, function(err, user) {
    if (err) {
        res.send(err, 400);
      } else if (user) {
      Passwords.findOne({password: passHash}, function(err, passUser) {
        callback(passUser ? 'ok' : null);
      });
    }
  });
};

exports.getAllRecords = function(callback)
{
  accounts.find().toArray(
    function(e, res) {
    if (e) callback(e);
    else callback(null, res);
  });
};

exports.delAllRecords = function(callback)
{
  accounts.remove({}, callback); // reset accounts collection for testing //
};

/* private encryption & validation methods */

function generateSalt()
{
  var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var p = Math.floor(Math.random() * set.length);
    salt += set[p];
  }
  return salt;
}

function sha512(str) {
  return crypto.createHmac('sha512').update(str).digest('base64');
}

function saltAndHash(pass, callback)
{
  var salt = generateSalt();
  callback(salt + sha512(pass + salt));
}

function validatePassword(plainPass, hashedPass, callback)
{
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + sha512(plainPass + salt);
  callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
  return accounts.db.bson_serializer.ObjectID.createFromHexString(id);
};

var findById = function(id, callback)
{
  accounts.findOne({_id: getObjectId(id)},
    function(e, res) {
    if (e) callback(e);
    else callback(null, res);
  });
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
  accounts.find( { $or : a } ).toArray(
    function(e, results) {
    if (e) callback(e);
    else callback(null, results);
  });
};
