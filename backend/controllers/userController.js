'use strict'
const e = require('express')
const userModel = require('../models/userModel')

// Uses the data from userModel to display all users
const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(res)
  res.json(users)
}

// Uses the data from userModel to display a user
const getUser = async (req, res) => {
  //console.log("test", req.params.userId);
  // placeholder, userId will be gotten from the jwt.
  const user = await userModel.getUserById(res, req.params.userId)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'user with the given id does not exist' })
  }
}

const getTrendingUsers = async (req, res ) => {
  const users = await userModel.getUsersByTrending(req, res)
  if (users) {
    res.json(users)
  } else {
    res.status(404).json({ message: "Can't get trending users" })
  }
}

// Uses the data from userModel to modify the user
const modifyUserGeneral = async (req, res) => {
  const user = req.body
  console.log("test", req.file)
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

const follow = async (req, res) => {
  const followedId = req.params.userId // get the id of the person you want to follow from parameters
  const followerId = req.user.user_id // get your id from the token

  const result = await userModel.startFollowing(followerId, followedId)
  if (result) {
    res.json({ follower_id: followerId, followee_id: followedId })
  } else {
    res.status(404).json({ message: "couldn't follow" })
  }
}

const checkToken = (req, res) => {
  delete req.user.password
  res.json({ user: req.user })
}

module.exports = {
  getUsers,
  getUser,
  getTrendingUsers,
  modifyUserGeneral,
  modifyUserPassword,
  follow,
  checkToken
}
