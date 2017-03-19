// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var RefreshTokenSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  token: { type: String, required: true },
});

// Export the Mongoose model
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);