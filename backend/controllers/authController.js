"use strict"
const userModel = require('../models/userModel')
const {validationResult} = require ('express-validator')

// TODO: add logging in functionality and add password as hash to the database when registering

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
    const result = await userModel.addUser(newUser, res)
    res.status(201).json({message: "user created", userId: result})
  } else {
    res.status(400).json({message: "user creation failed", errors: errors.array()})
  }
}

module.exports = {
  register
}