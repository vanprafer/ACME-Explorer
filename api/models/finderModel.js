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

FinderSchema.pre('save', function(callback){
  const finder = this
  if(finder.endDate > startDate){
    throw error("The start date must be before the end date of the finder.")
  }else{
    callback()
  }
})

module.exports = mongoose.model('Finders', FinderSchema)
