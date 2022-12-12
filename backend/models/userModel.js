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
  try {
    console.log("user email: ", email)
    const [rows] = await promisePool.execute(
      "SELECT * FROM users WHERE email = ?;",
      email)
    return rows
  } catch (e) {
    console.log("error", e.message)
  }
}


const getUsersByTrending = async (res) => {
  try {
    const sql = "SELECT username, avatar, user_id FROM users INNER JOIN follows ON users.user_id = follows.followee_id GROUP BY username ORDER BY COUNT(followee_id) DESC LIMIT 5;"
    const [highestFollows] = await promisePool.query(sql)
    console.log(highestFollows)
    return highestFollows
  } catch (e) {
    console.error("error adding a new user:", e.message)
    res.status(500).json({ "message": e.message })
  }
}

// Create a new user
const addUser = async (user, res) => {
  try {
    const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
    const values = [user.username, user.email, user.password, user.role]
    const [result] = await promisePool.query(sql, values)
    return result.insertId
  } catch (e) {
    console.log("user data:", user)
    console.error("error adding a new user:", e.message)
    res.status(500).json({ "message": e.message })
  }
}

// const startFollowing = async (followerId, followedId) => {
//   try {
//     const [checkFollowedId] = await promisePool.query("SELECT * FROM users WHERE user_id = ?;", followedId)
//     const [checkFollowerId] = await promisePool.query("SELECT * FROM users WHERE user_id = ?;", followerId)
//     if (checkFollowedId[0] && checkFollowerId[0]) {
//       const insertFollows = "INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)"
//       const values = [followerId, followedId]
//       const [result] = await promisePool.query(insertFollows, values)
//       return result
//     } else {
//       console.log("user id incorrect")
//     }
//   } catch (e) {
//     console.error("error", e.message)
//   }
// }

// Modifying the logged in user
const updateUserGeneral = async (user, res) => {
  try {
    let noDuplicateUsernames = true
    console.log('user to modify:', user)
    const userList = await getAllUsers()
    for (let i = 1; i <= userList.length; i++) {
      if (userList[i-1].username == user.username) {
        noDuplicateUsernames = false
        break
      }
    }
    if (noDuplicateUsernames) {
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

const deleteCurrentUser = async (user, res) => {
  try {
    const [result] = await promisePool.query("SELECT email, role FROM users WHERE user_id = ?", user.id)
    console.log(result)
    const userEmail = result[0].email
    const userRole = result[0].role
    console.log(userEmail, userRole)
    if (userEmail == user.email || userRole == 0) {
      const [follower] = await promisePool.query("DELETE FROM follows WHERE follower_id = ?", user.id)
      const [followed] = await promisePool.query("DELETE FROM follows WHERE followee_id = ?", user.id)
      const [result] = await promisePool.query("DELETE FROM users WHERE email = ?", user.email)
      console.log("follower", follower, followed)
      return result
    } else {
      return false
    }
    // const value = user.user_id
    // // Delete comments and likes that belongs to the user (has user_id as foreign key)
    // const deleteCommentByUser = 'DELETE FROM comments WHERE user_id = ?'
    // await promisePool.query(deleteCommentByUser, value)
    // const deleteComment = 'DELETE FROM comments JOIN photos ON comments.photo_id = photos.photos_id WHERE photos.user_id = ?'
    // await promisePool.query(deleteComment, value)
    // const removeLike = 'DELETE FROM likes WHERE user_id = ?'
    // await promisePool.query(removeLike, value)
    // // Delete photo
    // const removePhoto = 'DELETE FROM photos WHERE user_id = ?'
    // await promisePool.query(removePhoto, value)
    // const deleteUser = 'DELETE FROM users WHERE user_id = ?'
    // const [rows] = await promisePool.query(deleteUser, value)
    // return rows
  } catch (e) {
    console.error("error trying to delete the user:", e.message)
    res.status(500).json({ "error": e.message })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserLogin,
  getUsersByTrending,
  addUser,
  // startFollowing,
  updateUserGeneral,
  updateUserPassword,
  deleteCurrentUser
}