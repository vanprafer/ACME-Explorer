'use strict'
module.exports = function (app) {
  const applications = require('../controllers/applicationController')

  /**
   * Get my applications
   *    RequiredRoles: Explorer
   *
   * @section my_applications
   * @type get
   * @url /v1/my_applications
  */
  app.route('/v1/my_applications')
    .get(applications.list_my_applications)

  /**
   * Get applications
   *    RequiredRoles: Manager
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
   * @param {string} applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.read_an_application)

  app.route('/v0/applications/:applicationId')
    .get(applications.read_an_application_v0)

  /**
   * Reject an application
   *    RequiredRoles: Manager
   * @param {string} applicationId
  */
  app.route('/v1/applications/:applicationId/reject')
    .patch(applications.reject_an_application)

  app.route('/v0/applications/:applicationId/reject')
    .patch(applications.reject_an_application_v0)

  /**
   * Manager accepts an application (is DUE)
   *    RequiredRoles: Manager
   *    @param {string} applicationId
  */
  app.route('/v1/applications/:applicationId/due')
    .patch(applications.due_an_application)

  app.route('/v0/applications/:applicationId/due')
    .patch(applications.due_an_application_v0)

  /**
   * Accept an application which has been PAID by the Explorer
   *    RequiredRoles: Explorer
   *    @param {string} applicationId
  */
  app.route('/v1/applications/:applicationId/accept')
    .patch(applications.accept_an_application)

  app.route('/v0/applications/:applicationId/accept')
    .patch(applications.accept_an_application_v0)

  /**
   * Cancel an application by the creator Explorer. It must have an status "PENDING" or "ACCEPTED"
   *    RequiredRoles: Explorer
   *    @param {string} applicationId
  */
  app.route('/v1/applications/:applicationId/cancel')
    .patch(applications.cancel_an_application)

  app.route('/v0/applications/:applicationId/cancel')
    .patch(applications.cancel_an_application_v0)
}
