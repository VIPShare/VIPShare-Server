var accountController = require('./controllers/account');

module.exports = function(router, authController) {

  router.route('/accounts')
    .get(authController.isAuthenticated, accountController.getAccounts)
    .post(authController.isAuthenticated, accountController.postAccounts);

}
