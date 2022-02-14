"use strict";
module.exports = function (app) {
  const configurations = require("../controllers/configurationController");

  app
    .route("/v0/configurations")
    .get(configurations.list_all_configurations_v0)
    .post(configurations.create_a_configuration_v0);

  app
    .route("/v1/configurations")
    .get(configurations.list_all_configurations)
    .post(configurations.create_a_configuration);

  app
    .route("/v0/configurations/:configurationId")
    .get(configurations.read_a_configuration)
    .put(configurations.update_a_configuration_v0)
    .delete(configurations.delete_a_configuration_v0);

  app
    .route("/v1/configurations/:configurationId")
    .get(configurations.read_a_configuration)
    .put(configurations.update_a_configuration)
    .delete(configurations.delete_a_configuration);
};
