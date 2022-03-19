'use strict'
/* ---------------ACTOR---------------------- */
const mongoose = require('mongoose')
const Actor = mongoose.model('Actors')
const admin = require('firebase-admin')
const authController = require('./authController')

exports.list_all_actors = function (req, res) {
  // Check if the role param exist
  /*
  if (req.query.role) {
    const roleName = req.query.role
  }
  */
  // Adapt to find the actors with the specified role
  Actor.find({}, function (err, actors) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actors)
    }
  })
}

exports.create_an_actor = function (req, res) {
  const newActor = new Actor(req.body)

  if (newActor.role.includes('MANAGER')) {
    // Check that the user is an Administrator and if not: res.status(403);
    // "an access token is valid, but requires more privileges"
  }
  newActor.save(function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.read_an_actor = function (req, res) {
  // Check that the user is an Administrator or proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json(actor)
    }
  })
}

exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor')
  const emailParam = req.query.email
  const password = req.query.password
  let customToken

  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { // No actor found with that email as username
      res.send(err)
    } else if (!actor) { // an access token isn’t provided, or is invalid
      res.status(401)
      res.json({ message: 'forbidden', error: err })
    } else if (actor.banned === true) { // an access token is valid, but the user is banned
      res.status(403)
      res.json({ message: 'forbidden', error: err })
    } else {
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err)
        } else if (!isMatch) { // Password did not match
          res.status(401) // an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err })
        } else {
          try {
            customToken = await admin.auth().createCustomToken(actor.email)
          } catch (error) {
            console.log('Error creating custom token:', error)
          }
          actor.customToken = customToken
          res.json(actor)
        }
      })
    }
  })
}

exports.update_an_actor = function (req, res) {
  // Check that the user is the proper actor and if not: res.status(403);
  // "an access token is valid, but requires more privileges"
  Actor.findOneAndUpdate(
    { _id: req.params.actorId },
    req.body,
    { new: true },
    function (err, actor) {
      if (err) {
        res.status(500).send(err.message)
      } else {
        res.json(actor)
      }
    }
  )
}

exports.update_a_verified_actor = function (req, res) {
  // Customer and Clerks can update theirselves, administrators can update any actor
  console.log('Starting to update the verified actor...')
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err)
    } else {
      console.log('actor: ' + actor)
      const idToken = req.headers.idtoken // WE NEED the FireBase custom token in the req.header... it is created by FireBase!!
      if (actor.role.includes('EXPLORER') || actor.role.includes('MANAGER') || actor.role.includes('SPONSOR')) {
        const authenticatedUserId = await authController.getUserId(idToken)

        if (authenticatedUserId == req.params.actorId) {
          Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
            if (err) {
              res.send(err)
            } else {
              res.json(actor)
            }
          })
        } else {
          res.status(403) // Auth error
          res.send('The Actor is trying to update an Actor that is not himself!' + authenticatedUserId + ' ' + req.params.actorId)
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
          if (err) {
            res.send(err)
          } else {
            res.json(actor)
          }
        })
      } else {
        res.status(405) // Not allowed
        res.send('The Actor has unidentified roles')
      }
    }
  })
}

exports.unban_an_actor = function (req, res) {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  // Check if user is already unban
  console.log('Unban an actor with id: ' + req.params.actorId)
  Actor.findOneAndUpdate(
    { _id: req.params.actorId },
    { $set: { banned: false } },
    { new: true },
    function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(actor)
      }
    }
  )
}

exports.ban_an_actor = function (req, res) {
  // Check that the user is an Administrator and if not: res.status(403);
  // "an access token is valid, but requires more privileges"

  // Check if user is already unban
  console.log('Ban an actor with id: ' + req.params.actorId)
  Actor.findOneAndUpdate(
    { _id: req.params.actorId },
    { $set: { banned: true } },
    { new: true },
    function (err, actor) {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(actor)
      }
    }
  )
}

exports.delete_an_actor = function (req, res) {
  Actor.deleteOne({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.status(500).send(err)
    } else {
      res.json({ message: 'Actor successfully deleted' })
    }
  })
}
