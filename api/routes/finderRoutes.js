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
   * @url /v1/finders/
  */
  app.route('/v0/finders')
    // .get(finders.read_my_finder)
    .post(finders.create_a_finder)

  /**
   * Modify a finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type put
   * @url /v1/finders/:finderId
  */
  app.route('/v0/finders/:finderId')
    .put(finders.update_a_finder)

}
