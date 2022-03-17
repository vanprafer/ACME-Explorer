'use strict'
module.exports = function (app) {
  const storage = require('../controllers/storageController')

  // Data Storage routes
  /*
  *
  * Bad option: Put a large json with documents from a file into a collection of mongoDB
  *
  * @section storage
  * @type post
  * @url /v1/storage/insertMany
  * @param {string} mongooseModel  //mandatory
  * @param {string} sourceFile   //mandatory
  * Sample 1 (actors): http://localhost:8080/v1/storage/insertMany?dbURL=mongodb://acmexplorer:explorer123@localhost:27017/ACME-Explorer&mongooseModel=Actors&sourceFile=c:/temp/Actors.json
  * Sample 2 (test):   http://localhost:8080/v1/storage/insertMany?dbURL=mongodb://acmexplorer:explorer123@localhost:27017/ACME-Explorer&mongooseModel=Test&sourceFile=c:/temp/many_npm.json
  */
  app.route('/v0/storage/insertMany')
    .post(storage.store_json_insertMany)

  /**
   * Put a large json with documents from a file into a collection of mongoDB
   *
   * @section storage
   * @type post
   * @url /v1/storage/fs
   * @param {string} dbURL       //mandatory
   * @param {string} collection  //mandatory
   *  @param {string} sourceURL   //mandatory
   * @param {string} batchSize   //optional
   * @param {string} parseString //optional
   * Sample 1 (actors): http://localhost:8080/v1/storage/fs?dbURL=mongodb://acmexplorer:explorer123@localhost:27017/ACME-Explorer&collection=actors&batchSize=100&parseString=*&sourceFile=c:\temp\Actors.json
   * Sample 2 (test):   http://localhost:8080/v1/storage/fs?dbURL=mongodb://acmexplorer:explorer123@localhost:27017/ACME-Explorer&collection=test&batchSize=100&parseString=rows.*&sourceFile=c:\temp\many_npm.json
  */
  app.route('/v0/storage/fs')
    .post(storage.store_json_fs)
}
