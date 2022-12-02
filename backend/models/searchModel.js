'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Get data from database that contains the user's searching characters
const getDataForSearch = async (search, res) => {
  try {
    const sql = `SELECT username FROM users WHERE username LIKE '%${search}%' `
    const [result] = await promisePool.query(sql)
    return result
  } catch (error) {
    res.status(500).send(error.message)
    console.error('error', error.message)
  }
}

module.exports = { getDataForSearch }
