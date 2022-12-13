'use strict'
const pool = require("../database/db")
const bcrypt = require('bcrypt')
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
    res.status(500).json({ "message": e.message })
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

// Modifying the logged in user
const updateUserGeneral = async (user, res) => {
  try {
    let noDuplicateUsernames = true
    const userList = await getAllUsers()
    const userById = await getUserById(res, user.id)
    if (user.username != userById.username) {
      // Make sure there are no duplicate usernames before updating the user
      for (let i = 1; i <= userList.length; i++) {
        if (userList[i - 1].username == user.username) {
          noDuplicateUsernames = false
          break
        }
      }
    }
    if (noDuplicateUsernames) {
      if (!user.avatar) {
        user.avatar = userById.avatar
      }
      const sql = "UPDATE users SET username = ?, avatar = ?, description = ?" +
        "WHERE user_id = ?"
      const values = [user.username, user.avatar, user.description, user.id]
      const [rows] = await promisePool.query(sql, values)
      return rows
    } else {
      return false
    }
  } catch (e) {
    console.error("error while updating the user's username, avatar and description:", e.message)
    res.status(500).json({ "error": e.message })
  }
}

// Change the logged in user's password
const updateUserPassword = async (user, res) => {
  try {
    // Checks if the given "current password" matches the user's password
    const [result] = await promisePool.query("SELECT password FROM users WHERE user_id = ?", user.id)
    const userPassword = result[0].password
    const correctPassword = await bcrypt.compare(user.current_password, userPassword)
    if (!correctPassword) {
      return false
    } else {
      // Crypt the new password and add salt to it
      const salt = await bcrypt.genSalt()
      const HashedPassword = await bcrypt.hash(user.new_password, salt)
      const sql = "UPDATE users SET password = ? WHERE user_id = ?"
      const values = [HashedPassword, user.id]
      const [rows] = await promisePool.query(sql, values)
      return rows
    }
  } catch (e) {
    console.error("error while updating a specific user's password:", e.message)
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
  updateUserPassword,
}