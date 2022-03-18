'use strict'

const mongoose = require('mongoose')
const Sponsorship = mongoose.model('Sponsorships')

exports.list_my_sponsorships = function (req, res) {
  Sponsorship.find({}, function (err, sponsorships) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(sponsorships)
    }
  })
}

exports.create_a_sponsorship = function (req, res) {
  const newSponsorship = new Sponsorship(req.body)
  newSponsorship.save(function (err, sponsorship) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(sponsorship)
    }
  })
}

exports.read_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(sponsorship)
    }
  })
}

exports.update_a_sponsorship = function (req, res) {
  Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
    if (err) {
      if (err.name === 'ValidationError') {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    } else {
      res.json(sponsorship)
    }
  })
}

exports.delete_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (sponsorship) {
        Sponsorship.deleteOne({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
          if (err) {
            res.status(500).send(err)
          } else {
            res.json({ message: 'Sponsorship successfully deleted' })
          }
        })
      } else {
        res.status(404).send('Sponsorship not found')
      }
    }
  })
}

exports.pay_a_sponsorship = function (req, res) {
  console.log('Pay a sponsorship with id: ' + req.params.sponsorshipId)
  Sponsorship.findOneAndUpdate(
    { _id: req.params.sponsorshipId },
    { $set: { isPaid: true } },
    { new: true },
    function (err, sponsorship) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(sponsorship)
      }
    }
  )
}
exports.get_random_sponsorship = function (req, res) {
  const tripId = req.params.tripId
  Sponsorship.find({ isPaid: true, trip: tripId }).count().exec(function (err, count) {
    if (err) {
      res.status(500).send(err)
    } else {
      const random = Math.floor(Math.random() * count)
      Sponsorship.findOne({ isPaid: true, trip: tripId }).skip(random).exec(
        function (err, result) {
          if (err) {
            res.status(500).send(err)
          } else {
            res.json(result)
          }
        }
      )
    }
  })
}
