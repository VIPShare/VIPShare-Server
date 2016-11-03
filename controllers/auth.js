// Load required packages
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  function(username, password, callback) {
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
  }
));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function(clientId, clientSecret, done) {
    Client.findOne({ id: clientId }, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.secret != secret) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      if (token.userId) {
        User.findOne({ _id: token.userId }, function (err, user) {
          if (err) { return callback(err); }

          // No user found
          if (!user) { return callback(null, false); }

          // Simple example with no scope
          callback(null, user, { scope: '*' });
        });
      } else {
        Client.findOne({ id: token.clientId }, function (err, client) {
          if (err) { return callback(err); }

          // No client found
          if (!client) { return callback(null, false); }

          // to keep this example simple, restricted scopes are not implemented,
          // and this is just for illustrative purposes
          var info = { scope: token.scope, expiration: token.expiration }
          callback(null, client, info);
        });
      }
    });
  }
));

var isAuthenticated = passport.authenticate(['local', 'bearer'], { session : false });
exports.isAuthenticated = isAuthenticated;
exports.isClientAuthenticated = passport.authenticate('basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

exports.isAppAuthenticated = [
  isAuthenticated,
  function(req, res, next) {
    if ( req.authInfo.expiration < new Date().getTime() ) {
      res.sendStatus(401);
    } else if ( !req.authInfo || !req.authInfo.scope || req.authInfo.scope !== '*' && req.authInfo.scope.indexOf(scope) == -1 ) {
      res.sendStatus(403);
    } else {
      next();
    }
  }
];
