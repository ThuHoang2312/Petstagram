'use strict'
const userModel = require('../models/userModel')

// Uses the data from userModel to display all users
const getUsers = async (req, res) => {
  const users = await userModel.getAllUsers(res)
  res.json(users)
}

// Uses the data from userModel to display a user
const getUser = async (req, res) => {
  //console.log("test", req.params);
  // placeholder, userId will be gotten from the jwt.
  const user = await userModel.getUserById(res, 1)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ 'message': 'user with the given id does not exist' })
  }
}

// Uses the data from userModel to modify the user
const modifyUser = async (req, res) => {
  const user = req.body
  if (req.params.userId) {
    user.id = req.params.userId
  }
  const result = await userModel.updateUserById(user, res)
  if (result.affectedRows > 0) {
    res.json({ message: "user updated: " + user.id })
  } else {
    res.status(404).json({ message: 'nothing was changed' })
  }
}

const follow = async (req, res) => {
  // TODO: get the username for the person you want to follow from their profile
  console.log("test", req.user);
  const followedName = "TuomasH" // get the username of the person you want to follow
  const followerId = req.user.user_id

  const result = await userModel.startFollowing(followerId, followedName)
  if (result) {
    res.json({ followerId: followerId, followedName: followedName })
  } else {
    res.status(404).json({ "message": "couldn't follow" })
  }
}

const checkToken = (req, res) => {
  delete req.user.password;
  res.json({ user: req.user });
}

module.exports = {
  getUsers,
  getUser,
  modifyUser,
  follow,
  checkToken
}