'use strict'
module.exports = function (app) {
  const actors = require('../controllers/actorController')

  app
    .route('/v0/actors')
    .get(actors.list_all_actors_v0)
    .post(actors.create_an_actor_v0)

  app
    .route('/v0/actors/:actorId')
    .get(actors.read_an_actor_v0)
    .put(actors.update_an_actor_v0)
    .delete(actors.delete_an_actor_v0)

  

  /**
   * Required Role: Administrator
   */
  app.route('/v0/actors/:actorId/unban').patch(actors.unban_an_actor_v0)
  app.route('/v0/actors/:actorId/ban').patch(actors.ban_an_actor_v0)
}
