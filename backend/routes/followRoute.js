const express = require('express')
const router = express.Router()

const followController = require('../controllers/followController')

router
  .post('/:followeeId', followController.addFollow)
  .get('/followStatus/:followeeId', followController.isUserFollowing)
  .delete('/:followeeId', followController.removeFollow)

  module.exports = router