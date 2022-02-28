'use strict'
const mongoose = require('mongoose')
/* ---------------CONFIGURATION---------------------- */
const Configuration = mongoose.model('Configuration')

exports.list_all_configurations_v0 = function (req, res) {
  Configuration.find({}, function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      res.json(configuration)
    }
  })
}

exports.list_all_configurations = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Configuration.find({}, function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      res.json(configuration)
    }
  })
}

exports.create_a_configuration_v0 = function (req, res) {
  const newConfiguration = new Configuration(req.body)
  newConfiguration.save(function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      res.json(configuration)
    }
  })
}

exports.create_a_configuration = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  const newConfiguration = new Configuration(req.body)
  newConfiguration.save(function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      res.json(configuration)
    }
  })
}

exports.read_a_configuration = function (req, res) {
  Configuration.findById(
    req.params.configurationId,
    function (err, configuration) {
      if (err) {
        res.send(err)
      } else {
        res.json(configuration)
      }
    }
  )
}

exports.update_a_configuration_v0 = function (req, res) {
  Configuration.findOneAndUpdate(
    { _id: req.params.configurationId },
    req.body,
    { new: true },
    function (err, configuration) {
      if (err) {
        res.send(err)
      } else {
        res.json(configuration)
      }
    }
  )
}

exports.update_a_configuration = function (req, res) {
  // Check that the user is administrator if it is updating more things than comments and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Configuration.findOneAndUpdate(
    { _id: req.params.configurationId },
    req.body,
    { new: true },
    function (err, configuration) {
      if (err) {
        res.send(err)
      } else {
        res.json(configuration)
      }
    }
  )
}

exports.delete_a_configuration_v0 = function (req, res) {
  Configuration.deleteOne(
    { _id: req.params.configurationId },
    function (err, configuration) {
      if (err) {
        res.send(err)
      } else {
        res.json({ message: 'Configuration successfully deleted' })
      }
    }
  )
}

exports.delete_a_configuration = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Configuration.deleteOne(
    { _id: req.params.configurationId },
    function (err, configuration) {
      if (err) {
        res.send(err)
      } else {
        res.json({ message: 'Configuration successfully deleted' })
      }
    }
  )
}
