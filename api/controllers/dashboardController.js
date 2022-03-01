'use strict'

/** TODO */
const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const Application = mongoose.model('Applications')
const Finder = mongoose.model('Finders')

/**
 * Get the average, the minimum, the maximum, and the standard deviation of the
     number of trips managed per manager
    *
    *    RequiredRoles: Administrator
*/
exports.trips_per_manager = function (req, res) {
  Trip.aggregate([

    { $group: { _id: '$manager', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, queryres) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}

//   /**
//    * Get the average, the minimum, the maximum, and the standard deviation of the
//     number of applications per trip
//    *
//    *    RequiredRoles: Administrator
//   */
exports.applications_per_trip = function (req, res) {
  Application.aggregate([

    { $group: { _id: '$trip', count: { $sum: 1 } } },
    { $group: { _id: null, average: { $avg: '$count' }, max: { $max: '$count' }, min: { $min: '$count' }, std: { $stdDevSamp: '$count' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, queryres) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}

//   /**
//    * The average, the minimum, the maximum, and the standard deviation of the
//     price of the trips
//    *
//    *    RequiredRoles: Administrator
//   */
exports.trips_prices = function (req, res) {
  Trip.aggregate([
    { $group: { _id: null, average: { $avg: '$price' }, max: { $max: '$price' }, min: { $min: '$price' }, std: { $stdDevSamp: '$price' } } },
    { $project: { _id: 0, average: 1, max: 1, min: 1, std: 1 } }

  ], function (err, queryres) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}

//   /**
//    * The ratio of applications grouped by status
//    *
//    *    RequiredRoles: Administrator
//   */ TODO
exports.applications_ratio = function (req, res) {
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
        totales: {
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
  ], function (err, queryres) {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}

//   /**
//    * The average price range that explorers indicate in their finders
//    *
//    *    RequiredRoles: Administrator
//   */
exports.finders_average_price = function (req, res) {
  Finder.aggregate([
    { $group: { _id: null, averageMaxPrice: { $avg: '$maxPrice' } } },
    { $project: { _id: 0, averageMaxPrice: 1 } }

  ], function (err, queryres) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}

//   /**
//    * The top 10 key words that the explorers indicate in their finders
//    *
//    *    RequiredRoles: Administrator
//   */
exports.finders_top_keywords = function (req, res) {
  Finder.aggregate([
    { $group: { _id: '$keyword', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ], function (err, queryres) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(queryres)
    }
  })
}
