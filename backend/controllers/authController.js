"use strict"
const passport = require('passport')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
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
  const errors = validationResult(req)
  console.log('validation errors: ' + errors)
  if (errors.isEmpty()) {
    // Encrypt the password when registering a new user before adding it to the database
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(newUser.password, salt)
    newUser.password = passwordHash
    const result = await userModel.addUser(newUser, res)
    res.status(201).json({ message: "user created", userId: result })
  } else {
    res.status(400).json({ message: "user creation failed", errors: errors.array() })
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