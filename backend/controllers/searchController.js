'use strict'
const searchModel = require('../models/searchModel')

// Get username for searching
const getUsernameForSearch = async (req, res) => {
  const searchQuery = req.params.query
  const data = await searchModel.getUsernameDataForSearch(searchQuery, res)
  res.json(data)
}

// Get photos for searching
const getPhotoForSearch = async (req, res) => {
  const searchQuery = req.params.query
  const data = await searchModel.getPhotoDataForSearch(searchQuery, res)
  res.json(data)
}

module.exports = {
  getUsernameForSearch,
  getPhotoForSearch
}
