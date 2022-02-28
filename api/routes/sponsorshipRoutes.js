'use strict'
module.exports = function (app) {
  const sponsorships = require('../controllers/sponsorshipController')

  /**
   * Get my sponsorships
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get
   * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
    .get(sponsorships.list_my_sponsorships)

  app.route('/v0/sponsorships')
    .get(sponsorships.list_my_sponsorships_v0)

  /**
   * Get an sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type get
   * @url /v1/sponsorships/:sponsorshipId
   * @param {string} sponsorshipId
  */

  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
    .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship)

  app.route('/v0/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship_v0)
    .put(sponsorships.update_a_sponsorship_v0)
    .delete(sponsorships.delete_a_sponsorship_v0)
}
