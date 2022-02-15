'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SponsorshipSchema = new Schema({
  banner: {
    type: String,
    required: 'Kindly enter the sponsorship banner',
    match: [/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/, 'Please fill an URL']
  },
  landingPage: {
    type: String,
    required: 'Kindly enter the sponsorship landing page',
    match: [/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/, 'Please fill an URL']
  },
  isPaid: {
    type: Boolean,
    default: false,
    required: 'Kindly enter the paid condition of the banner'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required',
    ref: 'Trip'
  },
  sponsor: {
    type: Schema.Types.ObjectId,
    required: 'Sponsor id required',
    ref: 'Actor'
  },
  created: {
    type: Date,
    default: Date.now
  }

}, { strict: false })

module.exports = mongoose.model('Sponsorships', SponsorshipSchema)
