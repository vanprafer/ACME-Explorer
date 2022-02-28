'use strict'

const mongoose = require('mongoose')
const Trip = mongoose.model('Trips')

exports.list_all_trips_v0 = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.list_my_trips = function (req, res) {
  // Check whether the logged user is a Manager
  // Return trips owned by the Manager
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
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(trip)
    }
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
  // Check if the trip has not been previously published or not
  // Check if the user is a Manager and is the
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else if (trip.published === true) {
        res.status(400).send('Trip already published')
      } else {
        res.status(500).send(err)
      }
    } else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.json(trip)
        }
      })
    }
  })
}

exports.delete_a_trip_v0 = function (req, res) {
  Trip.deleteOne({
    _id: req.params.tripId
  }, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Trip successfully deleted' })
    }
  })
}

exports.publish_a_trip_v0 = function (req, res) {
  // Check if the user is a Manager and is the
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { published: 'true' } }, { new: true }, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.cancel_a_trip_v0 = function (req, res) {
  if (!req.body.cancelationReason) {
    res.status(400).send('Missing cancelation reason.')
  }
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.status(500).send(err)
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
}
