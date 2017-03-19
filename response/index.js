var logger = require('../log').logger;

exports.error = function(req, res, obj) {
  var errorid = uid(64);
  recordErrorLog(errorid, obj.message);
  res.status(obj.status);
  res.json(createResult(errorid, obj));
}

exports.success = function(res, obj) {
  res.status(obj.status || 200);
  res.json(createResult(errorid, obj));
}

exports.response = function(req, res, err, successCallback, failureCallback) {
  var obj, errorid;
  if (err) {
    errorid = uid(64);
    recordErrorLog(errorid, obj.message, err);
    obj = failureCallback(err);
  } else {
    obj = successCallback();
  }

  if (!obj.status) { throw new Error('no status specified') };

  res.status(obj.status);
  res.json(createResult(errorid, obj));

}

function createResult(errorid, obj) {
  var result = {};
  result.id = errorid;
  result.data = obj.data;
  if (obj.message) { result.message = obj.message };
  if (obj.code) { result.code = obj.code };

  return result;
}

function recordErrorLog(errorid, message, inclient, inuser, err) {
  logger.error(errorid, {
    inclient,
    inuser,
    message,
    timestamp: new Date().getTime(),
    err,
  });
}

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
