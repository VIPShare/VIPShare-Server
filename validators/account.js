var validator = require('validator');

exports.beforeAdd = function(account) {
  if (!account.type || !validator.isInt(`${account.type}`)) {

    return {
      message: '必须选择分享账户类型',
    }
  }
  if (!account.username || validator.trim(account.username) === '') {
    return {
      message: '必须输入分享账户名',
    }
  }
  if (!account.password || validator.trim(account.password) === '') {
    return {
      message: '必须输入分享账户密码',
    }
  }
}
