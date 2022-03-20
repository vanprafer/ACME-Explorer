'use strict'
module.exports = function (app) {
  const configurations = require('../controllers/configurationController')
  const authController = require('../controllers/authController')

  /**
   * Get configuration
   *    RequiredRoles: Administrator
   * Create configuration
   *    RequiredRoles: Administrator
   * Update configuration
   *    RequiredRoles: Administrator
   * @section configuration
   * @type get post put
   * @url /v0/configuration
  */
  app
    .route('/v0/configuration')
    .get(configurations.get_configuration)
    .post(configurations.create_configuration)
    .put(configurations.update_configuration)

  /**
   * Get configuration
   *    RequiredRoles: Administrator
   * Create configuration
   *    RequiredRoles: Administrator
   * Update configuration
   *    RequiredRoles: Administrator
   * @section configuration
   * @type get post put
   * @url /v0/configuration
  */
  app
    .route('/v1/configuration')
    .get(authController.verifyUser(
      ['ADMINISTRATOR']), configurations.get_configuration)
    .post(authController.verifyUser(
      ['ADMINISTRATOR']), configurations.create_configuration)
    .put(authController.verifyUser(
      ['ADMINISTRATOR']), configurations.update_configuration)
}
