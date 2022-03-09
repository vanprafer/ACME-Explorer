'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ConfigurationSchema = new Schema(
  {
    flatRate: {
      type: Number,
      required: 'Kindly enter the value of the flat rate'
    },
    finderCache: {
      type: Number,
      default: 1,
      min: 1,
      max: 24,
      required: 'Kindly enter the value of the cache'
    },
    finderResults: {
      type: Number,
      default: 10,
      max: 100,
      required: 'Kindly enter the value of the results size'
    },
    rebuildPeriod: {
      type: String,
      default: '*/10 * * * * *',
      required: 'Kindly enter the value of the rebuild period'
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false }
)

module.exports = mongoose.model('Configuration', ConfigurationSchema)
