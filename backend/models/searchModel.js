'use strict'
const pool = require('../database/db')
const promisePool = pool.promise()

// Get username from database that contains the user's searching characters
const getUsernameDataForSearch = async (username, res) => {
  try {
    const sql = `SELECT * FROM users WHERE username LIKE '%${username}%' `
    const [result] = await promisePool.query(sql)
    return result
  } catch (error) {
    res.status(500).send(error.message)
  }
}

// Get tag from database that contains the user's searching characters
const getPhotoDataForSearch = async (description, res) => {
  try {
    const sql = `SELECT * FROM photos WHERE description LIKE '%${description}%' `
    const [result] = await promisePool.query(sql)
    return result
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = { getUsernameDataForSearch, getPhotoDataForSearch }
