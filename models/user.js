var Sequelize = require('sequelize');
var db = require('../components/db');

var User = db.define('user', {
  username: Sequelize.STRING,
  email:    Sequelize.STRING,
  password: Sequelize.STRING,
  created:  Sequelize.DATE,
  modified: Sequelize.DATE
},
{
  createdAt: 'created',
  updatedAt: 'modified'
});

module.exports = User;
