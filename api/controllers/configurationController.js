'use strict'
const mongoose = require('mongoose')
/* ---------------CONFIGURATION---------------------- */
const Configuration = mongoose.model('Configuration')

exports.get_configuration = function (req, res) {
  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      res.json(configuration)
    }
  })
}

exports.create_configuration = function (req, res) {
  // Check if the user is an administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  Configuration.find({}, function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      if (configuration.length > 0) {
        res.status(405).send('There is already a configuration in the database')
      } else {
        const newConfiguration = new Configuration(req.body)
        newConfiguration.save(function (err, configuration) {
          if (err) {
            res.send(err)
          } else {
            res.json(configuration)
          }
        })
      }
    }
  })
}

exports.update_configuration = function (req, res) {
  // Check that the user is administrator if it is updating more things than comments and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  Configuration.find().limit(1).exec({}, function (err, configuration) {
    if (err) {
      res.send(err)
    } else {
      Configuration.findOneAndUpdate(
        { _id: configuration[0]._id },
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
  })
}
