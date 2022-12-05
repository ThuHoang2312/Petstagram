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
    console.error('error getting all users:', e.message)
    res.status(500).send(e.message)
  }
}

// Get a specific user from the database
const getUserById = async (res, userId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM users WHERE user_id = ?", [userId])
    return rows[0]
  } catch (e) {
    console.error("error getting a user with ID:", e.message)
    res.status(500).send(e.message)
  }
}

// Get email as a parameter when logging in and get the user data with the specific email
const getUserLogin = async (email) => {
  //console.log("user email: ", email, "from getUserLogin()")
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE email = ?;",
      email)
      console.log(rows[0]);
    return rows
  } catch (e) {
    console.error("error", e.message)
    res.status(500).send(e.message)
  }
}

// Create a new user
const addUser = async (user, res) => {
  try {
    const sql = "INSERT INTO users (user_id, username, email, password, role) VALUES (NULL, ?, ?, ?, ?)"
    const values = [user.username, user.email, user.password, user.role]
    const [result] = await promisePool.query(sql, values)
    console.log(result)
    return result.insertId
  } catch (e) {
    console.log("user data:", user)
    console.error("error adding a new user:", e.message)
    res.status(500).json({ "message": e.message })
  }
}

// Modifying a specific user
const updateUserById = async (user, res) => {
  try {
    console.log('Modified user: ', user)
    const sql = "UPDATE users SET username = ?, email = ?, password = ?, avatar = ?, description = ?, role = ? " +
      "WHERE user_id = ?"
    const values = [user.username, user.email, user.password, user.avatar, user.description, user.role, user.id]
    const [rows] = await promisePool.query(sql, values)
    return rows
  } catch (e) {
    console.error("error while updating a specific user:", e.message)
    res.status(500).json({ "error": e.message })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserLogin,
  addUser,
  updateUserById
}