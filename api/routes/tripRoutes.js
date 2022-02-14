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
  */
  app.route('/v0/trips')
    .get(trip.list_all_trips_v0)
    .post(trip.create_a_trip_v0)

  /**
   * Search engine for trips
   * Get trips depending on params
   *    RequiredRoles: None
   *
   * @section trips
   * @type get
   * @url /v0/trips/search
   * @param {string} keyWord
  */
  app.route('/v0/trips/search')
    .get(trip.search_trips_v0)

  /**
   * Delete a trip if it is not published
   *    RequiredRoles: to be the Manager that posted the trip
   * Put a trip if it is not published
   *    RequiredRoles: to be the Manager that posted the trip
   * Put to publish the trip.
   *    RequiredRoles: to be the Manager that posted the trip
   * Get an specific trip.
   *    RequiredRoles: None
   * Put to cancel the trip if has not started and has not any accepted applications
   *    RequiredRoles: to be the Manager that posted the trip
   * 
   * @section trips
   * @type get put delete
   * @url /v0/trips/:tripId
  */
  app.route('/v0/trips/:tripId')
    .get(trip.read_a_trip_v0)
    .put(trip.update_a_trip_v0)
    .patch(trip.publish_a_trip_v0)
    .put(trip.cancel_a_trip_v0) // This is put and not patch because we need to take the cancelation reason
    .delete(trip.delete_a_trip_v0)
}
