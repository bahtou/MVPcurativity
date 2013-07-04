/*
    Account schema
*/
var mongoose = require('mongoose');

var AccountSchema = module.exports = new mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  country: {
    type: String
  },
  recDate: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'accounts',
  safe: true
});

// indexes
AccountSchema.index({name: 1, username: 1, email: 1, location: 1, date: 1});
