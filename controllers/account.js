// Load required packages
var Account = require('../models/account');
var validator = require('../validators/account');
var { response, error } = require('../response');

// Create endpoint /api/accounts for POST
exports.postAccounts = function(req, res) {
  var errors;
  if (errors = validator.beforeAdd(req.body)) {
    error(req, res, {
      status: 400,
      message: errors.message,
    });
    return;
  }

  var account = new Account({
    type: req.body.type,
    username: req.body.username,
    password: req.body.password
  });

  account.save(function(err) {
    response(req, res, err, function() {
      return {
        status: 201,
      }
    }, function() {
      return {
        status: 500,
        message: '保存分享账号失败',
      }
    });
  });
};

// Create endpoint /api/accounts for GET
exports.getAccounts = function(req, res) {
  Account.find(function(err, accounts) {
    if (err)
      return res.send(err);

    res.json(accounts);
  });
};
