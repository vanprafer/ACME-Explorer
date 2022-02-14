'use strict'
module.exports = function (app) {
  const sponsorships = require('../controllers/sponsorshipController')

  /**
   * Get sponsorships
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get
   * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
    .get(sponsorships.list_all_sponsorships)

  app.route('/v0/sponsorships')
    .get(sponsorships.list_all_sponsorships_v0)

  /**
   * Get an sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get
   * @url /v1/sponsorships/:sponsorshipId
  */

  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_application)

  app.route('/v0/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_application_v0)

  /**
  * Create an sponsorship
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type post
  * @url /v1/sponsorships
 */
  app.route('/v1/sponsorships')
    .post(sponsorships.create_an_sponsorship)

  app.route('/v0/sponsorships')
    .post(sponsorships.create_an_sponsorship_v0)

  /**
  * Modify an sponsorship
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type put
  * @url /v1/sponsorships/:sponsorshipId
 */
  app.route('/v1/sponsorships/:sponsorshipId')
    .put(sponsorships.update_an_sponsorship)

  app.route('/v0/sponsorships/:sponsorshipId')
    .put(sponsorships.update_an_sponsorship_v0)

  /**
  * Delete an sponsorship
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type delete
  * @url /v1/sponsorships/:sponsorshipId
 */
  app.route('/v1/sponsorships/:sponsorshipId')
    .delete(sponsorships.delete_an_sponsorship)

  app.route('/v0/sponsorships/:sponsorshipId')
    .delete(sponsorships.delete_an_sponsorship_v0)
}
