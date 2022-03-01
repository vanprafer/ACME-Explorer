'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dateFormat = require('moment')
const customAlphabet = require('nanoid').customAlphabet
const idGenerator = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4)

const StageSchema = new Schema({
  title: {
    type: String,
    required: 'Stage title required'
  },
  description: {
    type: String,
    required: 'Stage description required'
  },
  price: {
    type: Number,
    min: 0
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

const TripSchema = new mongoose.Schema({
  ticker: {
    type: String,
    unique: true,
    // required: 'Trip ticker required', -> It is not necessary because it is auto-generated
    // This validation does not run after middleware pre-save
    validate: {
      validator: function (v) {
        return /\d{6}-\w{4}/.test(v)
      },
      message: 'ticker is not valid!, Pattern("d(6)-w(4)")'
    }
  },
  title: {
    type: String,
    required: 'Trip title required'
  },
  description: {
    type: String,
    required: 'Trip description required'
  },
  price: {
    type: Number,
    min: 0
  },
  requirements: {
    type: [String],
    validate: [v => Array.isArray(v) && v.length > 0, 'The trip must have at least one requirement']
  },
  dateStart: {
    type: Date,
    required: 'Trip start date required'
  },
  dateEnd: {
    type: Date,
    required: 'Trip end date required'
  },
  pictures: [{ data: Buffer, contentType: String }],
  cancelationReason: {
    type: String
  },
  published: {
    type: Boolean,
    required: 'Trip published state required',
    default: false
  },
  manager: {
    type: Schema.Types.ObjectId,
    required: 'Manager id required',
    ref: 'Actor'
  },
  stages: {
    type: [StageSchema],
    validate: [minArraySize, 'The trip must have at least one stage']
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false })

TripSchema.index({ ticker: 'text', title: 'text', description: 'text' })
TripSchema.index({ manager: 1 })
TripSchema.index({ published: 1, dateStart: 1, cancelationReason: 1 })

function minArraySize (val) {
  return val.length >= 1
}

TripSchema.pre('save', function (callback) {
  const newTrip = this
  const day = dateFormat(new Date()).format('YYMMDD')

  const generatedTicker = [day, idGenerator()].join('-')
  newTrip.ticker = generatedTicker

  callback()
})

TripSchema.pre('save', function (callback) {
  const trip = this
  let sum = 0
  for (let i = 0; i < trip.stages.length; i++) {
    sum = sum + trip.stages[i].price
  }
  trip.price = sum
  callback()
})

TripSchema.pre('save', function (callback) {
  const trip = this
  if (trip.dateEnd < trip.dateStart) {
    const error = Error('Start date must be before the end date of the trip.')
    error.name = 'ValidationError'
    return callback(error)
  } else {
    callback()
  }
})
module.exports = mongoose.model('Trips', TripSchema)
