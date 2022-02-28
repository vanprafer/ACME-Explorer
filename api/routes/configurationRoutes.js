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
   * @type get post
   * @url /v0/configurations/
  */
  app
    .route('/v0/configurations')
    .get(configurations.list_all_configurations_v0)
    .post(configurations.create_a_configuration_v0)

  app
    .route('/v1/configurations')
    .get(configurations.list_all_configurations)
    .post(configurations.create_a_configuration)

  /**
   * Update configuration
   *    RequiredRoles: Administrator
   *
   * @section configuration
   * @type get put delete
   * @url /v0/configurations/:configurationId
  */
  app
    .route('/v0/configurations/:configurationId')
    .get(configurations.read_a_configuration)
    .put(configurations.update_a_configuration_v0)
    .delete(configurations.delete_a_configuration_v0)

  app
    .route('/v1/configurations/:configurationId')
    .get(configurations.read_a_configuration)
    .put(configurations.update_a_configuration)
    .delete(configurations.delete_a_configuration)
}
