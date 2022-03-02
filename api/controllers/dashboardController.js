'use strict'

const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')
const Dashboard = mongoose.model('Dashboards')
const async = require('async')

exports.list_all_indicators = function (req, res) {
  console.log('Requesting indicators')

  Dashboard.find().sort('-computationMoment').exec(function (err, indicators) {
    if (err) {
      res.send(err)
    } else {
      res.json(indicators)
    }
  })
}

exports.last_indicator = function (req, res) {
  Dashboard.find().sort('-computationMoment').limit(1).exec(function (err, indicators) {
    if (err) {
      res.send(err)
    } else {
      res.json(indicators)
    }
  })
}

const CronJob = require('cron').CronJob
const CronTime = require('cron').CronTime

// '0 0 * * * *' una hora
// '*/30 * * * * *' cada 30 segundos
// '*/10 * * * * *' cada 10 segundos
// '* * * * * *' cada segundo
let rebuildPeriod = '*/10 * * * * *' // El que se usará por defecto
let computeDashboardJob

exports.rebuildPeriod = function (req, res) {
  console.log('Updating rebuild period. Request: period: ' + req.query.rebuildPeriod)
  rebuildPeriod = req.query.rebuildPeriod
  computeDashboardJob.setTime(new CronTime(rebuildPeriod))
  computeDashboardJob.start()

  res.json(req.query.rebuildPeriod)
}

function createDashboardJob () {
  computeDashboardJob = new CronJob(rebuildPeriod, function () {
    const newDashboard = new Dashboard()
    console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod)
    async.parallel([
      computeTripsPerManager,
      computeApplicationsPerTrip,
      computeTripsPrices,
      computeApplicationsRatio,
      computeFindersAveragePrice,
      computeTopKeywords
    ], function (err, results) {
      if (err) {
        console.log('Error computing dashboard: ' + err)
      } else {
        // console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
        newDashboard.tripsPerManager = results[0]
        newDashboard.applicationsPerTrip = results[1]
        newDashboard.tripsPrices = results[2]
        newDashboard.applicationsRatio = results[3]
        newDashboard.findersAveragePrice = results[4]
        newDashboard.findersTopKeywords = results[5]
        newDashboard.rebuildPeriod = rebuildPeriod

        newDashboard.save(function (err, dashboard) {
          if (err) {
            console.log('Error saving dashboard: ' + err)
          } else {
            console.log('new Dashboard succesfully saved. Date: ' + new Date())
          }
        })
      }
    })
  }, null, true, 'Europe/Madrid')
}

module.exports.createDashboardJob = createDashboardJob

/**
 * Get the average, the minimum, the maximum, and the standard deviation of the
     number of trips managed per manager
*/
function computeTripsPerManager (callback) {
  Trip.aggregate([

    { $group: { _id: '$manager', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * Get the average, the minimum, the maximum, and the standard deviation of the
    number of applications per trip
  */
function computeApplicationsPerTrip (callback) {
  Application.aggregate([

    { $group: { _id: '$trip', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The average, the minimum, the maximum, and the standard deviation of the
    price of the trips
  */
function computeTripsPrices (callback) {
  Trip.aggregate([
    { $group: { _id: null, average: { $avg: '$price' }, max: { $max: '$price' }, min: { $min: '$price' }, std: { $stdDevSamp: '$price' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The ratio of applications grouped by status
   *
   * Fully developed using Mongo aggregation framework instead of mongoose utility "Application.count()"
   * to get Applications totals to compute percentage.
   */
function computeApplicationsRatio (callback) {
  Application.aggregate([
    { $unwind: '$status' },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    {
      $group: {
        _id: null,
        totalApps: { $sum: '$count' },
        statuses: {
          $push: {
            status: '$_id',
            count: '$count'
          }
        }
      }
    },
    {
      $project: {
        ratios: {
          $map: {
            input: { $range: [0, { $size: '$statuses' }] },
            as: 'ix',
            in: {
              $let: {
                vars: {
                  pre: { $arrayElemAt: ['$statuses.status', '$$ix'] },
                  cal: { $arrayElemAt: ['$statuses.count', '$$ix'] },
                  ta: '$totalApps'
                },
                in: {
                  status: '$$pre',
                  count: '$$cal',
                  applicationsRatio: {
                    $multiply: [
                      { $divide: ['$$cal', '$$ta'] },
                      100
                    ]
                  }
                }
              }
            }
          }
        },
        _id: 0
      }
    }
  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The average price range that explorers indicate in their finders
  */
function computeFindersAveragePrice (callback) {
  Finder.aggregate([
    { $group: { _id: null, averageMaxPrice: { $avg: '$maxPrice' } } },
    { $project: { _id: 0, averageMaxPrice: 1 } }

  ], function (err, res) {
    callback(err, res[0])
  })
};

/**
   * The top 10 key words that the explorers indicate in their finders
  */
function computeTopKeywords (callback) {
  Finder.aggregate([
    { $group: { _id: '$keyword', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ], function (err, res) {
    callback(err, res[0])
  })
};
