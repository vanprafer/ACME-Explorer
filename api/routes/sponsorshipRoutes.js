'use strict'
module.exports = function (app) {
  const sponsorships = require('../controllers/sponsorshipController')

  /**
   * Get my sponsorships
   *    RequiredRoles: Sponsor
   * Create a sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get post
   * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
    .get(sponsorships.list_my_sponsorships)
    .post(sponsorships.create_a_sponsorship)

  app.route('/v0/sponsorships')
    .get(sponsorships.list_my_sponsorships_v0)
    .post(sponsorships.create_a_sponsorship_v0)

  /**
   * Get a sponsorship
   *    RequiredRoles: Sponsor
   * Modify a sponsorship
   *    RequiredRoles: Sponsor
   * Delete a sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get put delete
   * @url /v1/sponsorships/:sponsorshipId
  */

  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
    // .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship)

  app.route('/v0/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship_v0)
    .put(sponsorships.update_a_sponsorship_v0)
    .delete(sponsorships.delete_a_sponsorship_v0)

  /**
  * Pay a sponsorship which has not been paid yet
  *    RequiredRoles: Sponsor
  *
  * @section sponsorships
  * @type patch
  * @url /v1/sponsorships/:sponsorshipId
 */
  app.route('/v0/sponsorships/:sponsorshipId/pay')
  // .patch(sponsorships.pay_a_sponsorship_v0)
}
