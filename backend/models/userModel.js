'use strict'
const pool = require("../database/db")
const promisePool = pool.promise()

// Get all users from the database
const getAllUsers = async (res) => {
  try {
    const sql = "SELECT user_id, username, email, avatar, description, role FROM users"
    const [rows] = await promisePool.query(sql)
    return rows
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// Get a specific user from the database
const getUserById = async (res, userId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM users WHERE user_id = ?", [userId])
    return rows[0]
  } catch (e) {
    res.status(500).send(e.message)
  }
}

// Get email as a parameter when logging in and get the user data with the specific email
const getUserLogin = async (email) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE email = ?;",
      email)
    return rows
  } catch (e) {
    console.log("error", e.message)
  }
}

// Get the 5 most following users
const getUsersByTrending = async (res) => {
  try {
    const sql = "SELECT username, avatar, user_id FROM users INNER JOIN follows ON users.user_id = follows.followee_id GROUP BY username ORDER BY COUNT(followee_id) DESC LIMIT 5;"
    const [highestFollows] = await promisePool.query(sql)
    return highestFollows
  } catch (e) {
    res.status(500).json({ "message": e.message })
  }
}

// Create a new user
const addUser = async (user, res) => {
  try {
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
    const values = [user.username, user.email, user.password]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    res.status(500).json({ "message": e.message })
  }
}

// Modifying a specific user
const updateUserGeneral = async (user, res) => {
  try {
    const sql = "UPDATE users SET username = ?, avatar = ?, description = ?" +
      "WHERE user_id = ?"
    const values = [user.username, user.avatar, user.description, user.id]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ "error": e.message })
  }
}

const updateUserPassword = async (user, res) => {
  try {
    console.log("password modification user:", user)
    const sql = "UPDATE users SET password = ? WHERE user_id = ?"
    const values = [user.password, user.id]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    res.status(500).json({ "error": e.message })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserLogin,
  getUsersByTrending,
  addUser,
  updateUserGeneral,
  updateUserPassword
}