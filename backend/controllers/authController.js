"use strict"
const passport = require('passport')
const bcrypt = require('bcrypt')
const { addUser, getUserLogin, getAllUsers } = require('../models/userModel')
const { validationResult } = require('express-validator')

const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    //console.log("this is the user: ", user)
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      })
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err)
      }
      // generate a signed son web token with the contents of user object and return it in the response
      delete user.password
      return res.json({user})
    })
  })(req, res)
}

const register = async (req, res) => {
  console.log("Creating a new user: ", req.body)
  const newUser = req.body
  if (!newUser.role) {
    // default user role
    newUser.role = 1
  }
  //console.log(req.body.email)
  // When registering, check if an email and/or username is already in use.
  // Display the message on screen for the user
  const errors = validationResult(req)
  console.log('validation errors: ' + errors)
  if (errors.isEmpty()) {
    // Encrypt the password when registering a new user before adding it to the database
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(newUser.password, salt)
    newUser.password = passwordHash
    const result = await addUser(newUser, res)
    res.status(201).json({ message: "user created", userId: result })
  } else {
    const user = await getAllUsers()
    console.log("req.body", req.body);
    for (let i = 1; i <= user.length; i++) {
      if (user[i - 1].username === req.body.username && user[i - 1].email === req.body.email) {
        res.status(400).json({ message: "Email and username already in use" })
      }
      if (user[i - 1].username === req.body.username) {
        res.status(400).json({ message: "username already in use" })
      }
      if (user[i - 1].email === req.body.email) {
        res.status(400).json({ message: "Email already in use" })
      }
    }
  }
}

const logout = (req, res) => {
  console.log('some user logged out')
  res.json({message: 'logged out'})
}

module.exports = {
  login,
  register,
  logout
}