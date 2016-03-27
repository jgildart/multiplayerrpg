var Sequelize = require('sequelize');
var config = require('../config/dev').mysql;

var database = config.database;
var user = config.user;
var pass = config.password;
var options = {
  host: config.host,
  port: config.port,
  dialect: 'mysql'
};

if (config.pool) {
  options.pool = config.pool;
}

if (config.dialectOptions) {
  options.dialectOptions = config.dialectOptions;
}

module.exports = new Sequelize(database, user, pass, options);