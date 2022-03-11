'use strict'
module.exports = function (app) {
  const applications = require('../controllers/applicationController')

  /**
   * Get my applications - Grouped by Status
   *    RequiredRoles: Explorer
   *
   * @section my_applications
   * @type get
   * @url /v0/my_applications
  */
  app.route('/v0/my_applications')
    .get(applications.list_my_applications)

  /**
   * Get applications
   *    RequiredRoles: Manager
   * Create an application
   *    RequiredRoles: Explorer
   *
   * @section applications
   * @type get post
   * @url /v0/applications
  */
  app.route('/v0/applications')
    .get(applications.list_all_applications)
    .post(applications.create_an_application)

  /**
   * Get an application
   *    RequiredRoles: Explorer, Manager
   *
   * Modify an application
   *    RequiredRoles: Explorer, Manager
   *
   * @section applications
   * @type get put
   * @url /v0/applications/:applicationId
   * @param {string} applicationId
  */
  app.route('/v0/applications/:applicationId')
    .get(applications.read_an_application)
    .put(applications.update_an_application)

  /**
   * Reject an application
   *    RequiredRoles: Manager
   * @param {string} applicationId
  */
  app.route('/v0/applications/:applicationId/reject')
    .patch(applications.reject_an_application)

  /**
   * Manager accepts an application (is DUE)
   *    RequiredRoles: Manager
   *    @param {string} applicationId
  */
  app.route('/v0/applications/:applicationId/due')
    .patch(applications.due_an_application)

  /**
   * Accept an application which has been PAID by the Explorer
   *    RequiredRoles: Explorer
   *    @param {string} applicationId
  */
  app.route('/v0/applications/:applicationId/accept')
    .patch(applications.accept_an_application)

  /**
   * Cancel an application by the creator Explorer. It must have an status "PENDING" or "ACCEPTED"
   *    RequiredRoles: Explorer
   *    @param {string} applicationId
  */
  app.route('/v0/applications/:applicationId/cancel')
    .patch(applications.cancel_an_application)
}
