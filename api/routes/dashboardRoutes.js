'use strict'

module.exports = function (app) {
  const dashboard = require('../controllers/dashboardController')

  /**
     * Get the average, the minimum, the maximum, and the standard deviation of the
      number of trips managed per manager
     *
     *    RequiredRoles: Administrator
    */
  app.route('/v0/dashboard/tripsPerManager')
    .get(dashboard.trips_per_manager)

  //   /**
  //    * Get the average, the minimum, the maximum, and the standard deviation of the
  //     number of applications per trip
  //    *
  //    *    RequiredRoles: Administrator
  //   */
  app.route('/v0/dashboard/applicationsPerTrip')
    .get(dashboard.applications_per_trip)

  //   /**
  //    * The average, the minimum, the maximum, and the standard deviation of the
  //     price of the trips
  //    *
  //    *    RequiredRoles: Administrator
  //   */
  app.route('/v0/dashboard/tripPrices')
    .get(dashboard.trips_prices)

  //   /**
  //    * The ratio of applications grouped by status
  //    *
  //    *    RequiredRoles: Administrator
  //   */
  app.route('/v0/dashboard/applicationsRatio')
    .get(dashboard.applications_ratio)

  //   /**
  //    * The average price range that explorers indicate in their finders
  //    *
  //    *    RequiredRoles: Administrator
  //   */
  app.route('/v0/dashboard/findersPriceRange')
    .get(dashboard.finders_average_price)

  //   /**
  //    * The top 10 key words that the explorers indicate in their finders
  //    *
  //    *    RequiredRoles: Administrator
  //   */
  app.route('/v0/dashboard/topKeywords')
    .get(dashboard.finders_top_keywords)
}
