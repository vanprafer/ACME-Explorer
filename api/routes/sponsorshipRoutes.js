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
   * @url /v0/sponsorships
  */
  app.route('/v0/sponsorships')
    .get(sponsorships.list_my_sponsorships)
    .post(sponsorships.create_a_sponsorship)

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
    .get(sponsorships.list_my_sponsorships_verified)
    .post(sponsorships.create_a_sponsorship_verified)

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
   * @url /v0/sponsorships/:sponsorshipId
   * @param {string} sponsorshipId
  */

  app.route('/v0/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
    .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship)

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
   * @param {string} sponsorshipId
  */

  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship_verified)
    .put(sponsorships.update_a_sponsorship_verified)
    .delete(sponsorships.delete_a_sponsorship_verified)

  /**
   * Get a sponsorship
   *    RequiredRoles: Sponsor
   * Modify a sponsorship
   *    RequiredRoles: Sponsor
   * Delete a sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type put
   * @url /v0/sponsorships/:sponsorshipId/pay
   * @param {string} sponsorshipId
  */

  app.route('/v0/sponsorships/:sponsorshipId/pay')
    .patch(sponsorships.pay_a_sponsorship)

  /**
   * Get a sponsorship
   *    RequiredRoles: Sponsor
   * Modify a sponsorship
   *    RequiredRoles: Sponsor
   * Delete a sponsorship
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type put
   * @url /v1/sponsorships/:sponsorshipId/pay
   * @param {string} sponsorshipId
  */

  app.route('/v1/sponsorships/:sponsorshipId/pay')
    .patch(sponsorships.pay_a_sponsorship_verified)

  /**
   * Get a random sponsorship for a trip
   *    RequiredRoles: None
   *
   * @section sponsorships
   * @type get
   * @url /v0/sponsorships/random/tripId
   * @param {string} tripId
  */

  app.route('/v0/sponsorships/random/:tripId')
    .get(sponsorships.get_random_sponsorship)
}
