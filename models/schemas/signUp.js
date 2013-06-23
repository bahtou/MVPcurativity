/*
    SignUp schema
*/
var mongoose = require('mongoose');

var SignUpSchema = module.exports = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'signups',
  safe: true
});

// indexes
SignUpSchema.index({email: 1, date: 1});
