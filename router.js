var accountController = require('./controllers/account');

module.exports = function(router, authController) {

  router.route('/accounts')
    .get(authController.isAppAuthenticated, accountController.getAccounts)
    .post(authController.isAppAuthenticated, accountController.postAccounts);

}
