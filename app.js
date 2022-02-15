const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')

// const Actor = require('./api/models/actorModel')
// const Application = require('./api/models/applicationModel')
// const Configuration = require('./api/models/configurationModel')
// const Finder = require('./api/models/finderModel')
// const Sponsorship = require('./api/models/sponsorshipModel')
// const Trip = require('./api/models/tripModel')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// const routesActors = require('./api/routes/actorRoutes')
// const routesApplications = require('./api/routes/applicationRoutes')
// const routesConfigurations = require('./api/routes/configurationRoutes')
// const routesDashboard = require('./api/routes/dashboardRoutes')
// const routesFinders = require('./api/routes/finderRoutes')
// const routesSponsors = require('./api/routes/sponsorRoutes')
// const routesTrips = require('./api/routes/tripRoutes')

// routesActors(app)
// routesApplications(app)
// routesConfigurations(app)
// routesDashboard(app)
// routesFinders(app)
// routesSponsors(app)
// routesTrips(app)

// MongoDB URI building
const mongoDBUser = process.env.mongoDBUser || 'acmexplorer'
const mongoDBPass = process.env.mongoDBPass || 'explorador123'
const mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ':' + mongoDBPass + '@' : ''

const mongoDBHostname = process.env.mongoDBHostname || 'localhost'
const mongoDBPort = process.env.mongoDBPort || '27017'
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer'
const mongoDBURI = 'mongodb://' + mongoDBCredentials + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName

mongoose.connect(mongoDBURI, {
  // reconnectTries: 10,
  // reconnectInterval: 500,
  // poolSize: 10, // Up to 10 sockets
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // skip trying IPv6
  useNewUrlParser: true,
  useUnifiedTopology: true
})
console.log('Connecting DB to: ' + mongoDBURI)

mongoose.connection.on('open', function () {
  app.listen(port, function () {
    console.log('ACME-Explorer RESTful API server started on: ' + port)
  })
})
mongoose.connection.on('error', function (err) {
  console.error('DB init error ' + err)
})
