'use strict'
const searchModel = require('../models/searchModel')

// Get data for searching
const getUsernameForSearch = async (req, res) => {
  const searchQuery = req.query.query //need to change according to frontend
  const data = await searchModel.getUsernameDataForSearch(searchQuery, res)
  res.json(data)
}

const getTagForSearch = async (req, res) => {
  const searchQuery = req.query.query //need to change according to frontend
  const data = await searchModel.getTagDataForSearch(searchQuery, res)
  res.json(data)
}

module.exports = {
  getUsernameForSearch,
  getTagForSearch
}
