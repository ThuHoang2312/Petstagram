"use strict";
const mysql = require("mysql2");
const config = require('../config/config')

// Get values from the config file and link the database to the project
const pool = mysql.createPool({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool