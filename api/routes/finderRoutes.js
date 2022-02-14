'use strict'
module.exports = function (app) {
  const finders = require('../controllers/finderController')

  /**
   * Get finders
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type get
   * @url /v1/finders
  */
  app.route('/v1/finders')
    .get(finders.list_all_finders)

  app.route('/v0/finders')
    .get(finders.list_all_finders_v0)

  /**
   * Get an finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type get
   * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .get(finders.read_an_finder)

  app.route('/v0/finders/:finderId')
    .get(finders.read_an_finder_v0)

  /**
   * Create an finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type post
   * @url /v1/finders
  */
  app.route('/v1/finders')
    .post(finders.create_an_finder)

  app.route('/v0/finders')
    .post(finders.create_an_finder_v0)

  /**
   * Modify an finder
   *    RequiredRoles: Explorer
   *
   * @section finders
   * @type put
   * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .put(finders.update_an_finder)

  app.route('/v0/finders/:finderId')
    .put(finders.update_an_finder_v0)

  /**
   * Delete an finder
   *    RequiredRoles: Administrator
   *
   * @section finders
   * @type delete
   * @url /v1/finders/:finderId
  */
  app.route('/v1/finders/:finderId')
    .delete(finders.delete_an_finder)

  app.route('/v0/finders/:finderId')
    .delete(finders.delete_an_finder_v0)
}
