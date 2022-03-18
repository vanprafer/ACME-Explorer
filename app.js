const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')

const Actor = require('./api/models/actorModel')
const Application = require('./api/models/applicationModel')
const Configuration = require('./api/models/configurationModel')
const Dashboard = require('./api/models/dashboardModel')
const Finder = require('./api/models/finderModel')
const Sponsorship = require('./api/models/sponsorshipModel')
const Trip = require('./api/models/tripModel')
const DashboardTools = require('./api/controllers/dashboardController')
const ConfigurationTools = require('./api/controllers/configurationController')

const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const serviceAccount = require('./acmeexplorerauth-88966-firebase-adminsdk-d8li5-b2ba853927.json')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const routesActors = require('./api/routes/actorRoutes')
const routesApplications = require('./api/routes/applicationRoutes')
const routesConfigurations = require('./api/routes/configurationRoutes')
const routesDashboard = require('./api/routes/dashboardRoutes')
const routesFinders = require('./api/routes/finderRoutes')
const routesSponships = require('./api/routes/sponsorshipRoutes')
const routesStorage = require('./api/routes/storageRoutes')
const routesTrips = require('./api/routes/tripRoutes')

routesActors(app)
routesApplications(app)
routesConfigurations(app)
routesDashboard(app)
routesFinders(app)
routesSponships(app)
routesStorage(app)
routesTrips(app)

// MongoDB URI building
const mongoDBUser = process.env.mongoDBUser || 'acmexplorer'
const mongoDBPass = process.env.mongoDBPass || 'explorador123'
const mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ':' + mongoDBPass + '@' : ''

const mongoDBHostname = process.env.mongoDBHostname || 'localhost'
const mongoDBPort = process.env.mongoDBPort || '27017'
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer'
const mongoDBURI = 'mongodb://' + mongoDBCredentials + mongoDBHostname + ':' + mongoDBPort + '/' + mongoDBName

// mongoose.set('useCreateIndex', true)
// mongoose.set('useFindAndModify', false)

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

// Launch dashboard computation job and define the default configurations of the system
ConfigurationTools.loadDefaultConfiguration()
DashboardTools.createDashboardJob()
