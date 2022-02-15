'use strict'
module.exports = function (app) {
  const dashboard = require('../controllers/dashboardController')

  /**
   * Get the average, the minimum, the maximum, and the standard deviation of the
    number of trips managed per manager
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/trips')
    .get(dashboard.trips_statistics)

  app.route('/v0/dashboard/trips')
    .get(dashboard.trips_statistics_v0)

  /**
   * Get the average, the minimum, the maximum, and the standard deviation of the
    number of trips managed per manager
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/tripsPerManager')
    .get(dashboard.trips_per_manager)

  app.route('/v0/dashboard/tripsPerManager')
    .get(dashboard.trips_per_manager_v0)

  /**
   * Get the average, the minimum, the maximum, and the standard deviation of the
    number of applications per trip
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/applicationsPerTrip')
    .get(dashboard.applications_per_trip)

  app.route('/v0/dashboard/applicationsPerTrip')
    .get(dashboard.applications_per_trip_v0)

  /**
   * The average, the minimum, the maximum, and the standard deviation of the
    price of the trips
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/tripsPrices')
    .get(dashboard.trips_prices)

  app.route('/v0/dashboard/tripPrices')
    .get(dashboard.trips_prices_v0)

  /**
   * The ratio of applications grouped by status
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/applicationsRatio')
    .get(dashboard.applications_ratio)

  app.route('/v0/dashboard/applicationsRatio')
    .get(dashboard.applications_ratio_v0)

  /**
   * The average price range that explorers indicate in their finders
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/findersPriceRange')
    .get(dashboard.finders_average_price)

  app.route('/v0/dashboard/findersPriceRange')
    .get(dashboard.finders_average_price_v0)

  /**
   * The top 10 key words that the explorers indicate in their finders
   *
   *    RequiredRoles: Administrator
  */
  app.route('/v1/dashboard/findersTopKeywords')
    .get(dashboard.finders_top_keywords)

  app.route('/v0/dashboard/topKeywords')
    .get(dashboard.finders_top_keywords_v0)
}
