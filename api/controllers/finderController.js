'use strict'

const mongoose = require('mongoose')
const Finder = mongoose.model('Finders')

exports.list_all_finders_v0 = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.send(err)
    } else {
      res.json(finders)
    }
  })
}

exports.list_all_finders = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(finders)
    }
  })
}

exports.create_a_finder_v0 = function (req, res) {
  const newFinder = new Finder(req.body)
  newFinder.save(function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json(finder)
    }
  })
}

exports.create_a_finder = function (req, res) {
  const newFinder = new Finder(req.body)
  newFinder.save(function (err, finder) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(finder)
    }
  })
}

exports.read_a_finder_v0 = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json(finder)
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

exports.update_a_finder_v0 = function (req, res) {
  Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json(finder)
    }
  })
}

exports.update_a_finder = function (req, res) {
  Finder.findOneAndUpdate({ _id: req.params.finderId }, req.body, { new: true }, function (err, finder) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(finder)
    }
  })
}

exports.delete_a_finder_v0 = function (req, res) {
  Finder.deleteOne({ _id: req.params.finderId }, function (err, finder) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Finder successfully deleted' })
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
