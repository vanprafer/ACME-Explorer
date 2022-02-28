'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripSchema = require('./tripModel').schema

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
  },
  cachedDataDate: {
    type: Date
  },
  results: [TripSchema],
  explorer: {
    type: Schema.Types.ObjectId,
    required: 'Explorer id required',
    ref: 'Actor'
  },
  created: {
    type: Date,
    default: Date.now
  }

}, { strict: false })

FinderSchema.pre('save', function (callback) {
  const finder = this
  if (finder.endDate > finder.startDate) {
    throw Error('The start date must be before the end date of the finder.')
  } else {
    callback()
  }
})


FinderSchema.index({ explorer: 1 })
FinderSchema.index({ keyword: 1 })
FinderSchema.index({ maxPrice: 1 })

module.exports = mongoose.model('Finders', FinderSchema)
