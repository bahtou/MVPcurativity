/*
    Password schema
*/
var mongoose = require('mongoose');

var PasswordSchema = module.exports = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'passwords',
  safe: true
});

// indexes
PasswordSchema.index({username: 1, password: 1, date: 1});
