'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const ActorSchema = new Schema(
  {
    name: {
      type: String,
      required: 'Kindly enter the actor name'
    },
    surname: {
      type: String,
      required: 'Kindly enter the actor surname'
    },
    email: {
      unique: true,
      type: String,
      required: 'Kindly enter the actor email',
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      minlength: 5,
      required: 'Kindly enter the actor password'
    },
    phone: {
      type: String
    },
    language: {
      type: String,
      default: 'en',
      required: 'Kindly enter the preferred language'
    },
    address: {
      type: String
    },
    role: {
      type: [String],
      validate: [v => Array.isArray(v) && v.length > 0, 'The Actor must have at least one role'],
      required: 'Kindly enter the user role(s)',
      enum: ['EXPLORER', 'MANAGER', 'ADMINISTRATOR', 'SPONSOR']
    },
    banned: {
      type: Boolean,
      default: false,
      required: 'Kindly enter if the banned condition of the actor'
    },
    customToken: {
      type: String
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false }
)

ActorSchema.pre('save', function (callback) {
  const actor = this

  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err)

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err)
      actor.password = hash
      callback()
    })
  })
})

ActorSchema.pre('findOneAndUpdate', function (callback) {
  const actor = this._update
  // Break out if the password hasn't changed
  if (!actor.password) return callback()

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err)

    bcrypt.hash(actor.password, salt, function (err, hash) {
      if (err) return callback(err)
      actor.password = hash
      callback()
    })
  })
})

ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    // console.log('verifying password in actorModel: ' + password)
    if (err) return cb(err)
    // console.log('iMatch: ' + isMatch)
    cb(null, isMatch)
  })
}

ActorSchema.index({ email: 1, password: 1 })
ActorSchema.index({ banned: 1 })

module.exports = mongoose.model('Actors', ActorSchema)
