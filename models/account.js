// Load required packages
var mongoose = require('mongoose');

// Define our account schema
var AccountSchema   = new mongoose.Schema({
  type: { type: Number, required: true },
  username: { type: String, required: false },
  password: { type: String, required: true }
});

// Export the Mongoose model
module.exports = mongoose.model('Account', AccountSchema);
