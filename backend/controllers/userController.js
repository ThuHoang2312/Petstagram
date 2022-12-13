'use strict'
const userModel = require('../models/userModel')

// Uses the data from userModel to display all users
const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(res)
  res.json(users)
}

// Uses the data from userModel to display a user
const getUser = async (req, res) => {
  // placeholder, userId will be gotten from the jwt.
  const user = await userModel.getUserById(res, req.params.userId)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'user with the given id does not exist' })
  }
}

const getTrendingUsers = async (req, res) => {
  const users = await userModel.getUsersByTrending(res)
  if (users) {
    res.json(users)
  } else {
    res.status(404).json({ message: "Can't get trending users" })
  }
}

// Uses the logic from userModel to modify the user
const modifyUserGeneral = async (req, res) => {
  const user = req.body
  console.log('test', req.file)
  if (req.params.userId) {
    user.id = req.params.userId
    user.avatar = req.file.filename
  }
  const result = await userModel.updateUserGeneral(user, res)
  if (result.affectedRows > 0) {
    res.json({ message: 'user updated: ' + user.id })
  } else if (!result) {
    res.json({ message: "Username already in use" })
  } else {
    res.status(404).json({ message: 'nothing was changed' })
  }
}

// Checks if the new password fields match before accessing the userModel
// Uses the logic from userModel to change the password for the logged in user
const modifyUserPassword = async (req, res) => {
  const user = req.body
  if (req.params.userId) {
    user.id = req.params.userId
  }
  if (user.new_password != user.checked_password) {
    res.json({ message: "new password fields don't match"})
  } else {
    const result = await userModel.updateUserPassword(user, res)
    if (result.affectedRows > 0) {
      res.json({ message: 'user updated: ' + user.id })
    } else if (!result) {
      res.json({ message: "Current password incorrect" })
    } else {
      res.status(404).json({ message: 'nothing was changed' })
    }
  }
}

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('Token is not valid!'))
  } else {
    delete req.user.password
    res.json({ user: req.user })
  }
}

module.exports = {
  getUsers,
  getUser,
  getTrendingUsers,
  modifyUserGeneral,
  modifyUserPassword,
  checkToken
}
