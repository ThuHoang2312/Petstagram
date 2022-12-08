'use strict'
const searchModel = require('../models/searchModel')

// Get data for searching
const getUsernameForSearch = async (req, res) => {
  const searchQuery = req.params.query //need to change according to frontend
  console.log(searchQuery)
  const data = await searchModel.getUsernameDataForSearch(searchQuery, res)
  console.log(data)
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
