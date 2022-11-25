const mysql = require('mysql2')
const config = require('../config/config')

const pool = mysql.createPool({
  host: config.HOST,
  user: config.USER,
})

module.exports = pool
