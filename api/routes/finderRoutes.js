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
    .post(finders.create_a_finder)

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
    .post(finders.create_a_finder_verified)

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
   * Modify a finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type put
   * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .put(finders.update_a_finder_verified)

  /**
  * Get my finder.
  *    RequiredRoles: Explorer
  *
  * @section mytrips
  * @type get
  * @url /v0/myfinder/
  */
  app.route('/v0/myfinder')
    .get(finders.read_my_finder)

  /**
  * Get my finder.
  *    RequiredRoles: Explorer
  *
  * @section mytrips
  * @type get
  * @url /v1/myfinder/
  */
  app.route('/v1/myfinder')
    .get(finders.read_my_finder_verified)
}
