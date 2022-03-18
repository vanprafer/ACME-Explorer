'use strict'
module.exports = function (app) {
  const finders = require('../controllers/finderController')

  /**
   * Get the explorer finder
   *    RequiredRoles: Explorer
   * Create a finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type get post
   * @url /v0/finders/
  */
  app.route('/v0/finders')
    .get(finders.list_all_finders)
    .post(finders.create_a_finder)

  /**
   * Modify a finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type put
   * @url /v0/finders/:finderId
  */
  app.route('/v0/finders/:finderId')
    .put(finders.update_a_finder)

  /**
  * Get my finders.
  *    RequiredRoles: to be a explorer
  *
  * @section mytrips
  * @type get
  * @url /v0/myfinders/
  */
  app.route('/v0/myfinders')
    .get(finders.list_my_finders)
}
