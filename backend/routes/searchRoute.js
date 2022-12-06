const express = require('express')
const router = express.Router()

const searchController = require('../controllers/searchController')

router
  .get('/username', searchController.getUsernameForSearch)
  .get('/tag', searchController.getTagForSearch)

module.exports = router
