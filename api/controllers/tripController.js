'use strict'

const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')
const authController = require('../controllers/authController')
const Actor = mongoose.model('Actors')
const Application = mongoose.model('Applications')

exports.list_all_trips_v0 = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.create_a_trip_v0 = function (req, res) {
  // Check that user is a Manager and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newTrip = new Trip(req.body)
  newTrip.save(function (err, trip) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err.message)
      } else {
        res.status(500).send(err.message)
      }
    } else {
      res.json(trip)
    }
  })
}

exports.create_a_trip_verified = function (req, res) {
  const idToken = req.headers.idtoken
  const newTrip = new Trip(req.body)

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          newTrip.save(function (err, trip) {
            if (err) {
              if (err.name === 'ValidationError') {
                res.status(422).send(err.message)
              } else {
                res.status(500).send(err.message)
              }
            } else {
              res.json(trip)
            }
          })
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.list_my_trips = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_my_trips_verified = function (req, res) {
  // Check whether the logged user is a Manager
  // Return trips owned by the Manager

  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          Trip.find({ manager: loggedUser }, function (err, trips) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.json(trips)
            }
          })
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.search_trips_v0 = function (req, res) {
  // check if keyword param exists
  // Search depending on params
  if (!req.query.keyword) {
    res.status(400).send('Missing keyword to search.')
  }

  let skip = 0
  if (req.query.startFrom) {
    skip = parseInt(req.query.startFrom)
  }
  let limit = 0
  if (req.query.pageSize) {
    limit = parseInt(req.query.pageSize)
  }
  let sort = ''
  if (req.query.reverse === 'true') {
    sort = '-'
  }
  if (req.query.sortedBy) {
    sort += req.query.sortedBy
  }

  console.log('Keyword: ' + req.query.keyword + ' Skip:' + skip + ' Limit:' + limit + ' Sort:' + sort)

  Trip.find({ $text: { $search: req.query.keyword } })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(function (err, trips) {
      console.log('Start searching trips')
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(trips)
      }
      console.log('End searching trips')
    })
}

exports.read_a_trip_v0 = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.update_a_trip_v0 = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (trip != null) {
        if (trip.published === true) {
          res.status(400).send('Trip already published')
        } else {
          Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
            if (err) {
              if (err.name === 'ValidationError') {
                res.status(422).send(err.message)
              } else {
                res.status(500).send(err)
              }
            } else {
              res.json(trip)
            }
          })
        }
      } else {
        res.status(404).send('Trip not found')
      }
    }
  })
}

exports.update_a_trip_verified = function (req, res) {
  // Check if the trip has not been previously published or not
  // Check if the user is a Manager and is the
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
              res.status(500).send(err)
            } else {
              if (trip != null) {
                // eslint-disable-next-line eqeqeq
                if (trip.manager != loggedUser) {
                  res.status(403).send('A manager cannot update a trip which does not belong to him')
                } else if (trip.published === true) {
                  res.status(400).send('Trip already published')
                } else {
                  Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
                    if (err) {
                      if (err.name === 'ValidationError') {
                        res.status(422).send(err.message)
                      } else {
                        res.status(500).send(err)
                      }
                    } else {
                      res.json(trip)
                    }
                  })
                }
              } else {
                res.status(404).send('Trip not found')
              }
            }
          })
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.delete_a_trip_v0 = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (trip != null) {
        if (trip.published === true) {
          res.status(400).send('Trip already published')
        } else {
          Trip.deleteOne({
            _id: req.params.tripId
          }, function (err, trip) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.status(204).send('Trip deleted')
            }
          })
        }
      } else {
        res.status(404).send('Trip not found')
      }
    }
  })
}

exports.delete_a_trip_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
              res.status(500).send(err)
            } else {
              if (trip != null) {
                // eslint-disable-next-line eqeqeq
                if (trip.manager != loggedUser) {
                  res.status(403).send('A manager cannot delete a trip which does not belong to him')
                } else if (trip.published === true) {
                  res.status(400).send('Trip already published')
                } else {
                  Trip.deleteOne({
                    _id: req.params.tripId
                  }, function (err, trip) {
                    if (err) {
                      res.status(500).send(err)
                    } else {
                      res.status(204).send('Trip deleted')
                    }
                  })
                }
              } else {
                res.status(404).send('Trip not found')
              }
            }
          })
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.publish_a_trip_v0 = function (req, res) {
  Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { published: 'true' } }, { new: true }, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.publish_a_trip_verified = function (req, res) {
  // Check if the user is a Manager and is the
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          Trip.findById(req.params.tripId, function (err, trip) {
            if (err) {
              res.status(500).send(err)
            } else {
              if (trip != null) {
                // eslint-disable-next-line eqeqeq
                if (trip.manager != loggedUser) {
                  res.status(403).send('A manager cannot publish a trip which does not belong to him')
                } else if (trip.published === true) {
                  res.status(400).send('Trip already published')
                } else {
                  Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { published: 'true' } }, { new: true }, function (err, trip) {
                    if (err) {
                      res.status(500).send(err)
                    } else {
                      res.json(trip)
                    }
                  })
                }
              } else {
                res.status(404).send('Trip not found')
              }
            }
          })
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.cancel_a_trip_v0 = function (req, res) {
  // cancel the trip if has not started and has not any accepted applications
  if (!req.body.cancelationReason) {
    res.status(400).send('Missing cancelation reason.')
  } else {
    Trip.findById(req.params.tripId, function (err, trip) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (trip != null) {
          Application.find({ trip: trip._id, status: 'ACCEPTED' }, function (err, applications) {
            if (err) {
              res.status(500).send(err)
            } else if (applications.length > 0) {
              res.status(400).send('Cannot cancel a trip with accepted applications')
            } else {
              Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { cancelationReason: req.body.cancelationReason } }, { new: true }, function (err, trip) {
                if (err) {
                  res.status(500).send(err)
                } else {
                  res.json(trip)
                }
              })
            }
          })
        } else {
          res.status(404).send('Trip not found')
        }
      }
    })
  }
}

exports.cancel_a_trip_verified = function (req, res) {
  // cancel the trip if has not started and has not any accepted applications
  // RequiredRoles: to be the Manager that posted the trip

  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (!req.body.cancelationReason) {
            res.status(400).send('Missing cancelation reason.')
          } else {
            Trip.findById(req.params.tripId, function (err, trip) {
              if (err) {
                res.status(500).send(err)
              } else {
                if (trip != null) {
                  Application.find({ trip: trip._id, status: 'ACCEPTED' }, function (err, applications) {
                    if (err) {
                      res.status(500).send(err)
                    } else if (applications.length > 0) {
                      res.status(400).send('Cannot cancel a trip with accepted applications')
                    } else {
                      Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { cancelationReason: req.body.cancelationReason } }, { new: true }, function (err, trip) {
                        if (err) {
                          res.status(500).send(err)
                        } else {
                          res.json(trip)
                        }
                      })
                    }
                  })
                } else {
                  res.status(404).send('Trip not found')
                }
              }
            })
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}
