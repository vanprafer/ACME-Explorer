'use strict'

const mongoose = require('mongoose')
const Application = mongoose.model('Applications')
const Trip = mongoose.model('Trips')

exports.list_all_applications = function (req, res) {
  Application.find({}, function (err, applications) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(applications)
    }
  })
}

exports.list_my_applications = function (req, res) {
  const loggedUser = '' // Saco el id de la persona logueada
  Application.aggregate([
    { $match: { actor: loggedUser } },
    { $group: { status: 1 } }
  ], function (err, applications) {
    if (err) {
      res.send(err)
    } else {
      res.json(applications)
    }
  })
}

exports.create_an_application = function (req, res) {
  const newApplication = new Application(req.body)

  Trip.findById(newApplication.trip, function (err, trip) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (trip) {
        const startDate = trip.dateStart
        const cancelationReason = trip.cancelationReason

        if (Date.now() >= startDate) {
          res.status(500).send('The trip you are applying for has already begun')
        } else if (cancelationReason) {
          res.status(500).send('The trip you are applying for has been cancelled')
        } else {
          newApplication.status = 'PENDING'
          newApplication.save(function (err, application) {
            if (err) {
              if (err.name === 'ValidationError') {
                res.status(422).send(err)
              } else {
                res.status(500).send(err)
              }
            } else {
              res.json(application)
            }
          })
        }
      } else {
        res.status(404).send('Trip not found')
      }
    }
  })
}

exports.read_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(application)
    }
  })
}

exports.update_an_application = function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      application.status = req.params.status
      res.json(application)
    }
  })
}

exports.reject_an_application = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'REJECTED' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(application)
      }
    }
  )
}

exports.due_an_application = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'DUE' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(application)
      }
    }
  )
}

exports.accept_an_application = function (req, res) {
  console.log('Accept an application with id: ' + req.params.applicationId)
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (application.status !== 'DUE') {
        res.status(500).send('Unable to pay for this application')
      } else {
        Application.findOneAndUpdate(
          { _id: req.params.applicationId },
          { $set: { status: 'ACCEPTED' } },
          { new: true },
          function (err, application) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.json(application)
            }
          }
        )
      }
    }
  })
}

exports.cancel_an_application = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (application.status !== 'PENDING' && application.status !== 'ACCEPTED') {
        res.status(500).send('Unable to cancel this application')
      } else {
        Application.findOneAndUpdate(
          { _id: req.params.applicationId },
          { $set: { status: 'CANCELLED' } },
          { new: true },
          function (err, application) {
            if (err) {
              res.status(500).send(err)
            } else {
              res.json(application)
            }
          }
        )
      }
    }
  })
}
