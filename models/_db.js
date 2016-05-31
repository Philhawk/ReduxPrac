var Sequelize = require('sequelize');

var db = new Sequelize('postgres://localhost:5432/checkpoint_express_review', {
  logging: false
});

module.exports = db;