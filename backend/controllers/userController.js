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

// Uses the data from userModel to modify the user
const modifyUserGeneral = async (req, res) => {
  const user = req.body
  if (req.params.userId) {
    user.id = req.params.userId
    user.avatar = req.file.filename
  }
  const result = await userModel.updateUserGeneral(user, res)
  if (result.affectedRows > 0) {
    res.json({ message: 'user updated: ' + user.id })
  } else {
    res.status(404).json({ message: 'nothing was changed' })
  }
}

const modifyUserPassword = async (req, res) => {
  const user = req.body
  if (req.params.userId) {
    user.id = req.params.userId
  }
  const result = await userModel.updateUserPassword(user, res)
  if (result.affectedRows > 0) {
    res.json({ message: 'user updated: ' + user.id })
  } else {
    res.status(404).json({ message: 'nothing was changed' })
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
