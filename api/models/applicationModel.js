'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ApplicationSchema = new Schema({
  moment: {
    type: Date,
    default: Date.now,
    validate: function (date) {
      return Date.now() >= date
    },
    message: function (date) {
      return `The given date (${date}) must not be future`
    }
  },
  status: [{
    type: String,
    required: 'Kindly enter the status of the application',
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED'],
    default: 'PENDING'
  }],
  comments: {
    type: String
  },
  cancelationReason: {
    type: String
  }
}, { strict: false })

module.exports = mongoose.model('Applications', ApplicationSchema)
