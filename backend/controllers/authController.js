'use strict'
const jwt = require('jsonwebtoken')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { addUser, getAllUsers } = require('../models/userModel')
const { validationResult } = require('express-validator')
const config = require('../config/config')

const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Check you email and password again',
        user: user
      })
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err)
      }
      // generate a signed son web token with the contents of user object and return it in the response
      delete user.password
      const token = jwt.sign(user, config.KEY)
      console.log('token:', token, 'user:', user)
      return res.json({ user, token })
    })
  })(req, res)
}

const register = async (req, res) => {
  console.log('Creating a new user: ', req.body)
  const newUser = req.body
  if (!newUser.role) {
    // default user role
    newUser.role = 1
  }
  //console.log(req.body.email)
  // When registering, check if an email and/or username is already in use.
  // Display the message on screen for the user
  const user = await getAllUsers()
  let validation = true
  for (let i = 1; i <= user.length; i++) {
    for (let u = 1; u <= user.length; u++) {
      if (
        user[i - 1].username === req.body.username &&
        user[u - 1].email === req.body.email
      ) {
        res.status(400).json({ message: 'Email and username already in use' })
        validation = false
      }
    }
    if (user[i - 1].email === req.body.email && validation) {
      res.status(400).json({ message: 'Email already in use' })
      validation = false
    }
    if (user[i - 1].username === req.body.username && validation) {
      res.status(400).json({ message: 'Username already in use' })
      validation = false
    }
  }
  const errors = validationResult(req)
  console.log('validation errors: ' + errors)
  if (errors.isEmpty() && validation) {
    // Encrypt the password when registering a new user before adding it to the database
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(newUser.password, salt)
    newUser.password = passwordHash
    const result = await addUser(newUser, res)
    //console.log("resulttest", result)
    res.status(201).json({ message: 'user created', userId: result })
  } else {
    console.log('req.body', req.body)
  }
}

const logout = (req, res) => {
  console.log('some user logged out')
  res.json({ message: 'logged out' })
}

module.exports = {
  login,
  register,
  logout
}
