'use strict'
module.exports = function (app) {
  const configurations = require('../controllers/configurationController')

  /**
   * Get configuration
   *    RequiredRoles: Administrator
   * Create configuration
   *    RequiredRoles: -
   *
   * @section configuration
   * @type get post put
   * @url /v0/configuration
  */
  app
    .route('/v0/configuration')
    .get(configurations.get_configuration)
    .post(configurations.create_configuration)
    .put(configurations.update_configuration)
}
