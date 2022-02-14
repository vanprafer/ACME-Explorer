'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FinderSchema = new Schema({
  keyword: {
    type: String,
    minlength: 1
  },
  maxPrice: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
  results: [TripSchema]
}, { strict: false })

module.exports = mongoose.model('Finders', FinderSchema)
