const express = require('express')
const router = express.Router()

const searchController = require('../controllers/searchController')

router
  .get('/username/:query', searchController.getUsernameForSearch)
  .get('/photo/:query', searchController.getPhotoForSearch)

module.exports = router
