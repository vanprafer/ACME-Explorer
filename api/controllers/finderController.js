"use strict";

const mongoose = require("mongoose");
const Finder = mongoose.model("Finders");
const configurations = require("../controllers/configurationController");
const moment = require("moment");

exports.list_all_finders = function (req, res) {
  Finder.find({}, function (err, finders) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(finders);
    }
  });
};

exports.create_a_finder = function (req, res) {
  const newFinder = new Finder(req.body);
  const finderCache = configurations.get_configuration()["finderCache"];
  const cacheDate = moment().subtract(finderCache, "hours").toDate();

  Finder.find({
    keyword: req.params.keyword,
    maxPrice: req.params.maxPrice,
    startDate: req.params.startDate,
    endDate: req.params.endDate,
    cachedDataDate: { $gt: cacheDate },
  })
    .limit(1)
    .exec({}, function (err, finders) {
      if (err) {
        res.status(500).send(err);
      } else {
        if (finders.length > 0) {
          read_a_finder(finders[0]._id);
        } else {
          newFinder.save(function (err, finder) {
            if (err) {
              if (err.name === "ValidationError") {
                res.status(422).send(err);
              } else {
                res.status(500).send(err);
              }
            } else {
              res.json(finder);
            }
          });
        }
      }
    });
};

exports.list_my_finders = function (req, res) {
  // Check whether the logged user is a Explorer
  // Return finders owned by the Explorer
  Trip.find({ explorer: req.paramas._id }, function (err, trips) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(trips);
    }
  });
};

exports.read_a_finder = function (req, res) {
  Finder.findById(req.params.finderId, function (err, finder) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(finder);
    }
  });
};

exports.update_a_finder = function (req, res) {
  Finder.findOneAndUpdate(
    { _id: req.params.finderId },
    req.body,
    { new: true },
    function (err, finder) {
      if (err) {
        if (err.name === "ValidationError") {
          res.status(422).send(err);
        } else {
          res.status(500).send(err);
        }
      } else {
        res.json(finder);
      }
    }
  );
};

exports.delete_a_finder = function (req, res) {
  Finder.deleteOne({ _id: req.params.finderId }, function (err, finder) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: "Finder successfully deleted" });
    }
  });
};
