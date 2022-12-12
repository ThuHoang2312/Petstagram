'use strict'
const searchModel = require('../models/searchModel')

// Get data for searching
const getUsernameForSearch = async (req, res) => {
  const searchQuery = req.params.query 
  const data = await searchModel.getUsernameDataForSearch(searchQuery, res)
  res.json(data)
}

module.exports = {
  getUsernameForSearch,
}
