'use strict'

const mongoose = require('mongoose')
const Application = mongoose.model('Applications')
const Trip = mongoose.model('Trips')
const Actor = mongoose.model('Actors')
const authController = require('./authController')

exports.list_my_applications_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
            Application.aggregate([
              { $match: { explorer: loggedUser } },
              { $group: { status: 1 } }
            ], function (err, applications) {
              if (err) {
                res.send(err)
              } else {
                res.json(applications)
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}

exports.list_my_applications_by_trip_verified = function (req, res) {
  const trip = req.params.tripId
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('MANAGER')) {
            Trip.findById(trip, function (err, trip) {
              if (err) {
                res.status(500).send(err)
              } else {
                if (trip && trip.manager === loggedUser) {
                  Application.find({ trip: trip }, function (err, applications) {
                    if (err) {
                      res.status(500).send(err)
                    } else {
                      res.json(applications)
                    }
                  })
                } else {
                  res.status(405).send('The Actor has unidentified roles') // Not allowed
                }
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
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

exports.create_an_application_verified = function (req, res) {
  const idToken = req.headers.idtoken
  const newApplication = new Application(req.body)

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
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
                    Application.find({ explorer: loggedUser, trip: newApplication.trip }, function (err, application) {
                      if (err) {
                        res.status(500).send(err)
                      } else {
                        if (application) {
                          res.status(405).send('You already have an application for this trip')
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
                      }
                    })
                  }
                } else {
                  res.status(404).send('Trip not found')
                }
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
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

exports.read_an_application_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else if (application.explorer !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
                res.json(application)
              }
            })
          } else if (actor.roles.includes('MANAGER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else {
                Trip.findById(application.trip, function (err, trip) {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    if (trip && trip.manager === loggedUser) {
                      res.json(application)
                    } else {
                      res.status(405).send('The Actor has unidentified roles') // Not allowed
                    }
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
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

exports.update_an_application_verified = function (req, res) {
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else if (application.explorer !== loggedUser) {
                res.status(405).send('The Actor has unidentified roles') // Not allowed
              } else {
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
            })
          } else if (actor.roles.includes('MANAGER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else {
                Trip.findById(application.trip, function (err, trip) {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    if (trip && trip.manager === loggedUser) {
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
                    } else {
                      res.status(405).send('The Actor has unidentified roles') // Not allowed
                    }
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
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

exports.reject_an_application_verified = function (req, res) {
  console.log('Reject an application with id: ' + req.params.applicationId)
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('MANAGER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else {
                Trip.findById(application.trip, function (err, trip) {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    if (trip && trip.manager === loggedUser) {
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
                    } else {
                      res.status(405).send('The Actor has unidentified roles') // Not allowed
                    }
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
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

exports.due_an_application_verified = function (req, res) {
  console.log('Due an application with id: ' + req.params.applicationId)
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('MANAGER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else {
                Trip.findById(application.trip, function (err, trip) {
                  if (err) {
                    res.status(500).send(err)
                  } else {
                    if (trip && trip.manager === loggedUser) {
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
                    } else {
                      res.status(405).send('The Actor has unidentified roles') // Not allowed
                    }
                  }
                })
              }
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
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

exports.accept_an_application_verified = function (req, res) {
  console.log('Accept an application with id: ' + req.params.applicationId)
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else if (application.explorer !== loggedUser) {
                res.status(500).send('Unable to accept this application')
              } else if (application.status !== 'DUE') {
                res.status(500).send('Unable to accept this application')
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
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
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

exports.cancel_an_application_verified = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  const idToken = req.headers.idtoken

  authController.getUserId(idToken).then(function (loggedUser) {
    Actor.findById(loggedUser, function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        if (actor) {
          if (actor.roles.includes('EXPLORER')) {
            Application.findById(req.params.applicationId, function (err, application) {
              if (err) {
                res.status(500).send(err)
              } else if (application.explorer !== loggedUser) {
                res.status(500).send('Unable to cancel this application')
              } else if (application.status !== 'PENDING' && application.status !== 'ACCEPTED') {
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
            })
          } else {
            res.status(405).send('The Actor has unidentified roles') // Not allowed
          }
        } else {
          res.status(404).send('Cannot find actor')
        }
      }
    })
  })
}
