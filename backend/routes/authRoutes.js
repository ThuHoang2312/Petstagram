'use strict'
const express = require('express')
const router = express.Router()
const { login, register, logout } = require('../controllers/authController')
const { body } = require('express-validator')

// Route for registering and logging in
router
  .get('/logout', logout)
  .post('/login', login)
  .post(
    '/register',
    body('username').isLength({ min: 2 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 4 }).trim(),
    register
  )

module.exports = router
