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

exports.list_all_trips = function (req, res) {
  Trip.find({}, function (err, trips) {
    if (err) {
      res.send(err)
    } else {
      res.json(trips)
    }
  })
}

exports.create_a_trip_v0 = function (req, res) {
  // Check that user is a Manager and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newTrip = new Trip(req.body)

  newTrip.save(function (error, trip) {
    if (error) {
      res.send(error)
    } else {
      res.json(trip)
    }
  })
}

exports.create_a_trip = function (req, res) {
  // Check that user is a Manager and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newTrip = new Trip(req.body)

  newTrip.save(function (error, trip) {
    if (error) {
      res.send(error)
    } else {
      res.json(trip)
    }
  })
}

exports.search_trips_v0 = function (req, res) {
  // check if keyword param exists
  // Search depending on params
  console.log('Searching trips depending on params')
  res.send('Trips returned from the trips search')
}

exports.search_trips = function (req, res) {
  // check if keyword param exists
  // Search depending on params
  console.log('Searching trips depending on params')
  res.send('Trips returned from the trips search')
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

exports.read_a_trip = function (req, res) {
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
      res.send(err)
    } else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          res.send(err)
        } else {
          res.json(trip)
        }
      })
    }
  })
}

exports.update_a_trip = function (req, res) {
  // Check if the trip has not been previously published or not
  // Check if the user is a Manager and is the 
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          res.send(err)
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
      res.send(err)
    } else {
      res.json({ message: 'Trip successfully deleted' })
    }
  })
}

exports.delete_an_order = function (req, res) {
  // Check if the order is not published yet
  // Check if the user is a Manager and the trip's owner and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Trip.deleteOne({
    _id: req.params.tripId
  }, function (err, trip) {
    if (err) {
      res.send(err)
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
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.publish_a_trip = function (req, res) {
  Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { published: 'true' } }, { new: true }, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      res.json(trip)
    }
  })
}

exports.cancel_a_trip_v0 = function (req, res) {
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          res.send(err)
        } else {
          res.json(trip)
        }
      })
    }
  })
}

exports.cancel_a_trip = function (req, res) {
  // Check whether the trip has not started and has not any applications
  // Check if the user is a Manager and is the 
  // creator of the trip and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Trip.findById(req.params.tripId, function (err, trip) {
    if (err) {
      res.send(err)
    } else {
      Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
        if (err) {
          res.send(err)
        } else {
          res.json(trip)
        }
      })
    }
  })
}