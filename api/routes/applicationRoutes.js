'use strict'
module.exports = function (app) {
  const applications = require('../controllers/applicationController')

  /**
   * Get applications
   *    RequiredRoles: Explorer, Manager
   *
   * @section applications
   * @type get
   * @url /v1/applications
  */
  app.route('/v1/applications')
    .get(applications.list_all_applications)

  app.route('/v0/applications')
    .get(applications.list_all_applications_v0)

  /**
   * Get an application
   *    RequiredRoles: Explorer, Manager
   *
   * @section applications
   * @type get
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.read_an_application)

  app.route('/v0/applications/:applicationId')
    .get(applications.read_an_application_v0)

  /**
   * Create an application
   *    RequiredRoles: Explorer
   *
   * @section applications
   * @type post
   * @url /v1/applications
  */
  app.route('/v1/applications')
    .post(applications.create_an_application)

  app.route('/v0/applications')
    .post(applications.create_an_application_v0)

  /**
   * Modify an application
   *    RequiredRoles: Explorer, Manager
   *
   * @section applications
   * @type put
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .put(applications.update_an_application)

  app.route('/v0/applications/:applicationId')
    .put(applications.update_an_application_v0)

  /**
   * Delete an application
   *    RequiredRoles: Administrator
   *
   * @section applications
   * @type delete
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .delete(applications.delete_an_application)

  app.route('/v0/applications/:applicationId')
    .delete(applications.delete_an_application_v0)
}
