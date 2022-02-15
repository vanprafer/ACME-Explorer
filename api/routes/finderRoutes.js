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
  app.route('/v1/finders')
    .get(finders.read_my_finder)
    .post(finders.create_a_finder)

  app.route('/v0/finders')
    .get(finders.read_my_finder_v0)
    .post(finders.create_a_finder_v0)

  /**
   * Modify a finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type put
   * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .put(finders.update_a_finder)

  app.route('/v0/finders/:finderId')
    .put(finders.update_a_finder_v0)
}
