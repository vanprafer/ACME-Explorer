'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actorController')

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
    .get(actors.list_all_actors_v0)
    .post(actors.create_an_actor_v0)

  /**
   * Get an actor
   *    RequiredRoles: -
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
    .get(actors.read_an_actor_v0)
    .put(actors.update_an_actor_v0)
    .delete(actors.delete_an_actor_v0)

  /**
   * Banor or unban an actor:
   *    Required Role: Administrator
   *
   * @section actors
   * @type patch
   * @url /v0/actors/unban/:actorId
  */
  app.route('/v0/actors/unban/:actorId').patch(actors.unban_an_actor_v0)
  app.route('/v0/actors/ban/:actorId').patch(actors.ban_an_actor_v0)
}
