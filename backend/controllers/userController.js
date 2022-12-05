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
  //console.log("user", user);
  //console.log('user ID:', req.params.userId, user)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({'message': 'user with the given id does not exist'})
  }
}

// Uses the data from userModel to modify the user
const modifyUser = async (req, res) => {
  const user = req.body
  //console.log("req body modifyuser: ", user)
  //console.log("req params modifyuser: ", req.params)
  if (req.params.userId) {
    user.id = req.params.userId
  }
  const result = await userModel.updateUserById(user, res)
  if (result.affectedRows > 0) {
    res.json({message: "user updated: " + user.id})
  } else {
    res.status(404).json({message: 'nothing was changed'})
  }
}

module.exports = {
  getUsers,
  getUser,
  modifyUser,
}