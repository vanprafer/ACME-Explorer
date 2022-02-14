'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SponsorshipSchema = new Schema({
  banner: {
    data: Buffer,
    contentType: String,
    required: 'Kindly enter the sponsorship banner'
  },
  landingPage: {
    data: Buffer,
    contentType: String,
    required: 'Kindly enter the sponsorship landing page'
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, { strict: false })

module.exports = mongoose.model('Sponsorships', SponsorshipSchema)
