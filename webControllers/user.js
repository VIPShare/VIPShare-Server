var User = require('../models/user');


exports.login = function(req, res) {
    res.render('../views/login');
}

exports.loginValidate = function(req, res, callback) {

    var username = req.body.username;
    var password = req.body.password;


    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
    // res.render('../views/index');

};

