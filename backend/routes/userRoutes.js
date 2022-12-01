'use strict'
const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

// Routes for accessing the user data
router.get('/', userController.getUsers)
  .get('/:userId', userController.getUser)
  .put('/:userId', userController.modifyUser)

module.exports = router