'use strict'

const mongoose = require('mongoose')
const Application = mongoose.model('Applications')

exports.list_all_applications_v0 = function (req, res) {
  Application.find({}, function (err, applications) {
    if (err) {
      res.send(err)
    } else {
      res.json(applications)
    }
  })
}

exports.list_all_applications = function (req, res) {
  Application.find({}, function (err, applications) {
    if (err) {
      res.send(err)
    } else {
      res.json(applications)
    }
  })
}

exports.list_my_applications = function (req, res) {
  Application.find({}, function (err, applications) {
    if (err) {
      res.send(err)
    } else {
      res.json(applications)
    }
  })
}

exports.create_an_application_v0 = function (req, res) {
  const newApplication = new Application(req.body)
  newApplication.save(function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.create_an_application = function (req, res) {
  const newApplication = new Application(req.body)
  newApplication.save(function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.read_an_application_v0 = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.read_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.update_an_application_v0 = function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.update_an_application = function (req, res) {
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      res.send(err)
    } else {
      res.json(application)
    }
  })
}

exports.reject_an_application_v0 = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'REJECTED' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json(application)
      }
    }
  )
}

exports.due_an_application_v0 = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'DUE' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json(application)
      }
    }
  )
}

exports.accept_an_application_v0 = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'ACCEPTED' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json(application)
      }
    }
  )
}

exports.cancel_an_application_v0 = function (req, res) {
  console.log('Cancel an application with id: ' + req.params.applicationId)
  Application.findOneAndUpdate(
    { _id: req.params.applicationId },
    { $set: { status: 'CANCELLED' } },
    { new: true },
    function (err, application) {
      if (err) {
        res.send(err)
      } else {
        res.json(application)
      }
    }
  )
}
