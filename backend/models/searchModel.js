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
const getTagDataForSearch = async (tagName, res) => {
  try {
    const sql = `SELECT * FROM tags WHERE tag_name LIKE '%${tagName}%' `
    const [result] = await promisePool.query(sql)
    return result
  } catch (error) {
    res.status(500).send(error.message)
  }
}

module.exports = { getUsernameDataForSearch, getTagDataForSearch }
