'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actorController')
  const authController = require('../controllers/authController')

  /**
   * Get actors
   *    RequiredRoles: -
   * Create an actor
   *    RequiredRoles: -
   *
   * @section actors
   * @type get post
   * @url /v0/actors/
  */
  app
    .route('/v0/actors')
    .get(actors.list_all_actors)
    .post(actors.create_an_actor)

  /**
   * Get an actor
   *    RequiredRoles: any
   * Update an actor:
   *    RequiredRoles: Administrator or self
   * Delete an actor:
   *    RequiredRoles: Administrator or self
   *
   * @section actors
   * @type get put delete
   * @url /v0/actors/:actorId'
  */
  app
    .route('/v0/actors/:actorId')
    .get(actors.read_an_actor)
    .put(actors.update_an_actor)
    // .delete(actors.delete_an_actor)

  /**
   * Get an actor
   *    RequiredRoles: -
   * Update an actor:
   *    RequiredRoles: Administrator or self
   *
   * @section actors
   * @type get put delete
   * @url /v1/actors/:actorId'
  */
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
    .put(authController.verifyUser(
      ['EXPLORER',
        'MANAGER',
        'ADMINISTRATOR',
        'SPONSOR']), actors.update_a_verified_actor)

  /**
   * Banor or unban an actor:
   *    Required Role: Administrator
   *
   * @section actors
   * @type patch
   * @url /v0/actors/unban/:actorId
  */
  app.route('/v0/actors/unban/:actorId').patch(actors.unban_an_actor)
  app.route('/v0/actors/ban/:actorId').patch(actors.ban_an_actor)
}
