'use strict'
module.exports = function (app) {
  const trip = require('../controllers/tripController')

  /**
   * Get the list of trips
   *
   * Post a trip
   *    RequiredRoles: to be a Manager
   *
   * @section trips
   * @type get post
   * @url /v0/trips
   * @param {string} title
   * @param {string} description
   * @param {Array[string]} requirements
   * @param {string} dateStart
   * @param {string} dateEnd
   * @param {objectId} manager
   * @param {Array[Stage]} stages
  */
  app.route('/v0/trips')
    .get(trip.list_all_trips_v0)
    .post(trip.create_a_trip_v0)

  /**
  * Get my trips.
  *    RequiredRoles: to be a Manager
  *
  * @section mytrips
  * @type get
  * @url /v0/mytrips/
  */
  app.route('/v0/mytrips')
    .get(trip.list_my_trips)

  /**
   * Search engine for trips
   * Get trips depending on params
   *    RequiredRoles: None
   *
   * @section trips
   * @type get
   * @url /v0/trips/search
   * @param {string} keyWord
   * @param {string} sortedBy
   * @param {string} reverse
   * @param {string} startFrom
   * @param {string} pageSize
  */
  app.route('/v0/trips/search')
    .get(trip.search_trips_v0)

  /**
   * Delete a trip if it is not published
   *    RequiredRoles: to be the Manager that posted the trip
   * Update a trip if it is not published
   *    RequiredRoles: to be the Manager that posted the trip
   * Get an specific trip. It has to get the trip sponsorships in order to show a
   * banner (selected) randomly from one of the paid sponsorships
   *    RequiredRoles: None
   *
   * @section trips
   * @type get put delete
   * @url /v0/trips/:tripId
  */
  app.route('/v0/trips/:tripId')
    .get(trip.read_a_trip_v0)
    .put(trip.update_a_trip_v0)
    .delete(trip.delete_a_trip_v0)

  /**
    * Patch to publish the trip.
    *    RequiredRoles: to be the Manager that posted the trip
    *
  */
  app.route('/v0/trips/:tripId/publish')
    .patch(trip.publish_a_trip_v0)

  /**
   * Put to cancel the trip if has not started and has not any accepted applications
   *    RequiredRoles: to be the Manager that posted the trip
   */
  app.route('/v0/trips/:tripId/cancel')
    .put(trip.cancel_a_trip_v0) // This is put and not patch because we need to take the cancelation reason
}
