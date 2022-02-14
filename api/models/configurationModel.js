"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConfigurationSchema = new Schema(
  {
    flatRate: {
      type: Number,
      required: "Kindly enter the value of the flat rate",
    },
    finderCache: {
      type: Number,
      default: 1,
      min: 1,
      max: 24,
    },
    finderResults: {
      type: Number,
      default: 10,
      max: 100,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

module.exports = mongoose.model("Configuration", ConfigurationSchema);
