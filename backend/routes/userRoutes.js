'use strict'
const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  getUsers,
  getUser,
  modifyUserGeneral,
  // follow,
  checkToken,
  getTrendingUsers
} = require('../controllers/userController')

const fileFilter = (req, file, cb) => {
  const acceptedTypes = ['image/jpeg', 'image/png']
  if (acceptedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ dest: 'uploads/', fileFilter })

// Routes for accessing the user data
router
  .get('/', getUsers)
  .get('/token', checkToken)
  .get('/profile/:userId', getUser)
  .get('/trend', getTrendingUsers)
  // .post('/follow/:userId', follow)
  .put('/:userId', upload.single('avatar'), modifyUserGeneral)

module.exports = router
