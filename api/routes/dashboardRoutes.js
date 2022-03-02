'use strict'

module.exports = function (app) {
  const dashboard = require('../controllers/dashboardController')

  /**
   * Get a list of all indicators or post a new computation period for rebuilding
   * RequiredRole: Administrator
   * @section dashboard
   * @type get post
   * @url /dashboard
   * @param [string] rebuildPeriod
  */
  app.route('/v0/dashboard')
    .get(dashboard.list_all_indicators)
    .post(dashboard.rebuildPeriod)

  /**
  * Get a list of last computed indicator
  * RequiredRole: Administrator
  * @section dashboard
  * @type get
  * @url /dashboard/latest
 */
  app.route('/v0/dashboard/latest')
    .get(dashboard.last_indicator)
}
