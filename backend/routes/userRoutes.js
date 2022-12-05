'use strict'
const express = require('express')
const router = express.Router()
const multer = require('multer')
const {getUsers, getUser, modifyUser} = require('../controllers/userController')

const fileFilter = (req, file, cb) => {
  const acceptedTypes = ['image/jpeg', 'image/png']
  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({dest: 'uploads/', fileFilter})

// Routes for accessing the user data
router.get('/', getUsers)
  .get('/:userId', getUser)
  .put('/:userId', upload.single('avatar'), modifyUser)

module.exports = router