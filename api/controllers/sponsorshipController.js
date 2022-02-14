'use strict'

const mongoose = require('mongoose')
const Sponsorship = mongoose.model('Sponsorships')

exports.list_my_sponsorships_v0 = function (req, res) {
  Sponsorship.find({}, function (err, sponsorships) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorships)
    }
  })
}

exports.list_my_sponsorships = function (req, res) {
  Sponsorship.find({}, function (err, sponsorships) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorships)
    }
  })
}

exports.create_a_sponsorship_v0 = function (req, res) {
  const newSponsorship = new Sponsorship(req.body)
  newSponsorship.save(function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.create_a_sponsorship = function (req, res) {
  const newSponsorship = new Sponsorship(req.body)
  newSponsorship.save(function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.read_a_sponsorship_v0 = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.read_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.update_a_sponsorship_v0 = function (req, res) {
  Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.delete_a_sponsorship_v0 = function (req, res) {
  Sponsorship.deleteOne({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Sponsorship successfully deleted' })
    }
  })
}

exports.delete_a_sponsorship = function (req, res) {
  Sponsorship.deleteOne({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
    if (err) {
      res.send(err)
    } else {
      res.json({ message: 'Sponsorship successfully deleted' })
    }
  })
}
