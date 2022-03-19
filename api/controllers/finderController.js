'use strict'

const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')
const Configuration = mongoose.model('Configuration')
const Trip = mongoose.model('Trips')

exports.list_all_finders = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(finders)
    }
  })
}

exports.create_a_finder = function (req, res) {
  const newFinder = new Finder(req.body)
  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      res.send({ message: 'Failed to acces the system configuration', error: err })
    } else {
      const finderCache = configuration[0].finderCache
      const finderResults = configuration[0].finderResults
      const cacheDate = Date.now() - finderCache * 60 * 60 * 1000

      const query = {}
      if (req.body.keyword) {
        query.keyword = req.body.keyword
      }
      if (req.body.maxPrice) {
        query.maxPrice = req.body.maxPrice
      }
      if (req.body.startDate) {
        query.startDate = new Date(req.body.startDate)
      }
      if (req.body.endDate) {
        query.endDate = new Date(req.body.endDate)
      }
      query.created = { $gte: new Date(cacheDate) }

      Finder.find(query)
        .limit(1)
        .exec({}, function (err, finders) {
          if (err) {
            res.status(500).send({ message: 'Failed to get existing Finders', error: err })
          } else {
            if (finders.length > 0) { // Create new finder with cached results.
              console.log('Using cached results')
              Finder.findById(finders[0]._id, function (err, finder) {
                if (err) {
                  res.status(500).send(err)
                } else {
                  newFinder.results = finder.results
                  newFinder.save(function (err, finder) {
                    if (err) {
                      if (err.name === 'ValidationError') {
                        res.status(422).send(err)
                      } else {
                        res.status(500).send({ message: 'Failed to create Finder', error: err })
                      }
                    } else {
                      res.json(finder)
                    }
                  })
                }
              })
            } else { // Search for trips and create new finder
              // Find trips with finder criteria
              const query = {}
              if (req.body.keyword) {
                query.$text = { $search: req.body.keyword }
              }
              if (req.body.startDate) {
                console.log(req.body.startDate)
                query.dateStart = { $gte: new Date(req.body.startDate) }
              }
              if (req.body.endDate) {
                query.dateEnd = { $lte: new Date(req.body.endDate) }
              }
              if (req.body.maxPrice) {
                query.price = { $lte: req.body.maxPrice }
              }

              console.log('Query: ' + query + ' Limit: ' + finderResults)

              Trip.find(query)
                .limit(configuration.finderResults)
                .lean()
                .exec(function (err, trips) {
                  console.log('Start searching trips')
                  if (err) {
                    res.status(500).send({ message: 'Error when searching trips', error: err })
                  } else {
                    newFinder.results = trips.map(x => x._id)
                    newFinder.save(function (err, finder) {
                      if (err) {
                        if (err.name === 'ValidationError') {
                          res.status(422).send(err)
                        } else {
                          res.status(500).send({ message: 'Failed to create Finder', error: err })
                        }
                      } else {
                        res.json(finder)
                      }
                    })
                  }
                  console.log('End searching trips')
                })
            }
          }
        })
    }
  })
}

exports.list_my_finders = function (req, res) {
  // Check whether the logged user is a Explorer
  // Return finders owned by the Explorer
  Finder.find({ explorer: req.paramas._id }, function (err, trips) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.read_a_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(finder)
    }
  })
}

exports.update_a_finder = function (req, res) {
  const updatedFinder = req.body
  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      res.send({ message: 'Failed to acces the system configuration', error: err })
    } else {
      const finderCache = configuration[0].finderCache
      const finderResults = configuration[0].finderResults
      const cacheDate = Date.now() - finderCache * 60 * 60 * 1000

      const query = {}
      if (req.body.keyword) {
        query.keyword = req.body.keyword
      }
      if (req.body.maxPrice) {
        query.maxPrice = req.body.maxPrice
      }
      if (req.body.startDate) {
        query.startDate = new Date(req.body.startDate)
      }
      if (req.body.endDate) {
        query.endDate = new Date(req.body.endDate)
      }
      query.created = { $gte: new Date(cacheDate) }

      Finder.find(query)
        .limit(1)
        .exec({}, function (err, finders) {
          if (err) {
            res.status(500).send({ message: 'Failed to get existing Finders', error: err })
          } else {
            if (finders.length > 0) { // update finder with cached results.
              console.log('Using cached results')
              Finder.findById(finders[0]._id, function (err, finder) {
                if (err) {
                  res.status(500).send(err)
                } else {
                  updatedFinder.results = finder.results
                  Finder.findOneAndUpdate(
                    { _id: req.params.finderId },
                    updatedFinder,
                    { new: true },
                    function (err, finder) {
                      if (err) {
                        if (err.name === 'ValidationError') {
                          res.status(422).send(err)
                        } else {
                          res.status(500).send(err)
                        }
                      } else {
                        res.json(finder)
                      }
                    }
                  )
                }
              })
            } else { // Search for trips and update finder results
              // Find trips with finder criteria
              const query = {}
              if (req.body.keyword) {
                query.$text = { $search: req.body.keyword }
              }
              if (req.body.startDate) {
                query.dateStart = { $gte: new Date(req.body.startDate) }
              }
              if (req.body.endDate) {
                query.dateEnd = { $lte: new Date(req.body.endDate) }
              }
              if (req.body.maxPrice) {
                query.price = { $lte: req.body.maxPrice }
              }

              console.log('Query: ' + query + ' Limit: ' + finderResults)

              Trip.find(query)
                .limit(configuration.finderResults)
                .lean()
                .exec(function (err, trips) {
                  console.log('Start searching trips')
                  if (err) {
                    res.status(500).send({ message: 'Error when searching trips', error: err })
                  } else {
                    updatedFinder.results = trips.map(x => x._id)
                    Finder.findOneAndUpdate(
                      { _id: req.params.finderId },
                      updatedFinder,
                      { new: true },
                      function (err, finder) {
                        if (err) {
                          if (err.name === 'ValidationError') {
                            res.status(422).send(err)
                          } else {
                            res.status(500).send(err)
                          }
                        } else {
                          console.log('updated' + finder)
                          res.json(finder)
                        }
                      }
                    )
                  }
                  console.log('End searching trips')
                })
            }
          }
        })
    }
  })
}

exports.delete_a_finder = function (req, res) {
  Finder.deleteOne({ _id: req.params.finderId }, function (err, finder) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Finder successfully deleted' })
    }
  })
}
